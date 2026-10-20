import { describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import {
  MAX_REWARDED_REFERRALS, decideAttach, findExistingCredit, formatReferralCode, generateReferralCode,
  normaliseReferralCode, referralLink, rewardCredit, rewardReferral, type RewardDeps,
} from "@/lib/referrals";
import { processStripeEvent, type SyncDeps } from "@/lib/stripe/sync";

describe("codes", () => {
  it("generates 8 unambiguous characters that round-trip", () => {
    for (let i = 0; i < 200; i++) {
      const c = generateReferralCode();
      expect(c).toMatch(/^[A-HJKMNP-Z2-9]{8}$/);
      expect(normaliseReferralCode(c)).toBe(c);
    }
  });
  it("normalises case, spaces and dashes; rejects junk", () => {
    expect(normaliseReferralCode(" abcd-efg2 ")).toBe("ABCDEFG2");
    expect(normaliseReferralCode("ABCDEFG")).toBeNull();
    expect(normaliseReferralCode("ABCDEFGO")).toBeNull(); // O is not in the alphabet
    expect(normaliseReferralCode("../../etc")).toBeNull();
    expect(normaliseReferralCode(undefined)).toBeNull();
    expect(normaliseReferralCode("A".repeat(500))).toBeNull();
  });
  it("formats and links", () => {
    expect(formatReferralCode("ABCDEFG2")).toBe("ABCD-EFG2");
    expect(referralLink("https://x.com/", "ABCDEFG2")).toBe("https://x.com/r/ABCDEFG2");
  });
  it("credits 3 months of the monthly price", () => expect(rewardCredit(1199)).toBe(3597));
});

describe("decideAttach", () => {
  const base = { referrerId: "a", refereeId: "b", alreadyReferred: false, priorSubscriptions: 0 };
  it("attaches a new user with a valid code", () => expect(decideAttach(base)).toBe("attach"));
  it("refuses unknown codes, self-referral, repeat referral, and existing customers", () => {
    expect(decideAttach({ ...base, referrerId: null })).toBe("unknown-code");
    expect(decideAttach({ ...base, referrerId: "b" })).toBe("self");
    expect(decideAttach({ ...base, alreadyReferred: true })).toBe("already-referred");
    expect(decideAttach({ ...base, priorSubscriptions: 1 })).toBe("not-new");
  });
});

function rewardDeps(over: Partial<RewardDeps> = {}): RewardDeps {
  return {
    findPending: vi.fn(async () => ({ id: "ref1", referrerId: "referrer" })),
    countRewarded: vi.fn(async () => 0),
    creditReferrer: vi.fn(async () => "cbtxn_1"),
    markRewarded: vi.fn(async () => {}),
    markCapped: vi.fn(async () => {}),
    ...over,
  };
}

describe("rewardReferral", () => {
  it("credits the referrer 3 months and marks it rewarded", async () => {
    const d = rewardDeps();
    expect(await rewardReferral({ userId: "friend", unitAmount: 1199, currency: "aud" }, d)).toBe("rewarded");
    expect(d.creditReferrer).toHaveBeenCalledWith({ referrerId: "referrer", referralId: "ref1", amount: 3597, currency: "aud" });
    expect(d.markRewarded).toHaveBeenCalledWith("ref1", "cbtxn_1");
  });
  it("does nothing when the user wasn't referred", async () => {
    const d = rewardDeps({ findPending: vi.fn(async () => null) });
    expect(await rewardReferral({ userId: "x", unitAmount: 1199, currency: "aud" }, d)).toBe("none");
    expect(d.creditReferrer).not.toHaveBeenCalled();
  });
  it("stops at the cap without crediting", async () => {
    const d = rewardDeps({ countRewarded: vi.fn(async () => MAX_REWARDED_REFERRALS) });
    expect(await rewardReferral({ userId: "x", unitAmount: 1199, currency: "aud" }, d)).toBe("capped");
    expect(d.creditReferrer).not.toHaveBeenCalled();
    expect(d.markCapped).toHaveBeenCalledWith("ref1");
  });
  it("ignores zero or invalid prices", async () => {
    const d = rewardDeps();
    expect(await rewardReferral({ userId: "x", unitAmount: 0, currency: "aud" }, d)).toBe("none");
    expect(d.findPending).not.toHaveBeenCalled();
  });
  it("leaves the referral pending if crediting fails, so Stripe's retry can finish it", async () => {
    const d = rewardDeps({ creditReferrer: vi.fn(async () => { throw new Error("stripe down"); }) });
    await expect(rewardReferral({ userId: "x", unitAmount: 1199, currency: "aud" }, d)).rejects.toThrow("stripe down");
    expect(d.markRewarded).not.toHaveBeenCalled();
  });
});

describe("webhook triggers the reward only on a real first payment", () => {
  const sub = {
    id: "sub_1", customer: "cus_1", status: "active", cancel_at_period_end: false,
    metadata: { user_id: "friend", book_slug: "molecular-atlas" },
    items: { data: [{ current_period_end: 1_900_000_000, price: { unit_amount: 1199, currency: "aud" } }] },
  } as unknown as Stripe.Subscription;
  const invoice = (over: Record<string, unknown>) =>
    ({ id: "in_1", billing_reason: "subscription_create", amount_paid: 1199, parent: { subscription_details: { subscription: "sub_1" } }, ...over });
  const run = async (inv: unknown, type = "invoice.paid") => {
    const reward = vi.fn(async () => {});
    const deps: SyncDeps = {
      claimEvent: async () => "new", markProcessed: async () => {}, retrieveSubscription: async () => sub,
      upsertSubscription: async () => {}, linkCustomer: async () => {}, userForCustomer: async () => null, rewardReferral: reward,
    };
    await processStripeEvent({ id: "e", type, data: { object: inv } } as unknown as Stripe.Event, deps);
    return reward;
  };
  it("rewards on the first paid invoice", async () => {
    expect(await run(invoice({}))).toHaveBeenCalledWith({ userId: "friend", unitAmount: 1199, currency: "aud" });
  });
  it("not on renewals", async () => expect(await run(invoice({ billing_reason: "subscription_cycle" }))).not.toHaveBeenCalled());
  it("not on a $0 first invoice", async () => expect(await run(invoice({ amount_paid: 0 }))).not.toHaveBeenCalled());
  it("not on a failed payment", async () => expect(await run(invoice({}), "invoice.payment_failed")).not.toHaveBeenCalled());
});

describe("findExistingCredit (retries after Stripe's 24-hour idempotency window)", () => {
  const txns = [
    { id: "cbtxn_other", amount: -3597, metadata: { referral_id: "ref-2" } },
    { id: "cbtxn_debit", amount: 500, metadata: { referral_id: "ref-1" } },
    { id: "cbtxn_mine", amount: -3597, metadata: { referral_id: "ref-1" } },
  ];
  it("finds the earlier credit for this referral", () => expect(findExistingCredit(txns, "ref-1")).toBe("cbtxn_mine"));
  it("returns null when this referral was never credited", () => expect(findExistingCredit(txns, "ref-3")).toBeNull());
  it("ignores transactions without metadata", () =>
    expect(findExistingCredit([{ id: "x", amount: -1, metadata: null }], "ref-1")).toBeNull());
});
