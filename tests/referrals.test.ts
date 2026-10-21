import { describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import {
  MAX_REWARDED_REFERRALS, decideAttach, findExistingCredit, formatReferralCode, generateReferralCode,
  instalmentCredit, normaliseReferralCode, referralLink, rewardReferral, type RewardDeps,
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
  it("each instalment credits one month of the monthly price", () => expect(instalmentCredit(1199)).toBe(1199));
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

/**
 * In-memory stand-in for the database and Stripe: one referral (friend -> referrer), the invoices that have paid an
 * instalment, and the credits added to the referrer's Stripe balance.
 */
function fakeWorld(opts: { months?: number; earning?: number; status?: string } = {}) {
  const referral = { id: "ref1", referrerId: "referrer", monthsRewarded: opts.months ?? 0, status: opts.status ?? "pending" };
  const rewardedInvoices = new Set<string>();
  const credits: { instalment: number; amount: number }[] = [];
  const deps: RewardDeps = {
    findOpen: vi.fn(async (refereeId: string) =>
      refereeId === "friend" && (referral.status === "pending" || referral.status === "active") ? { ...referral } : null),
    invoiceRewarded: vi.fn(async (id: string) => rewardedInvoices.has(id)),
    countEarning: vi.fn(async () => opts.earning ?? 0),
    creditReferrer: vi.fn(async ({ instalment, amount }) => {
      credits.push({ instalment, amount });
      return `cbtxn_${instalment}`;
    }),
    recordInstalment: vi.fn(async ({ instalment, invoiceId }) => {
      rewardedInvoices.add(invoiceId);
      referral.monthsRewarded = instalment;
      referral.status = instalment >= 3 ? "rewarded" : "active";
    }),
    markCapped: vi.fn(async () => {
      referral.status = "capped";
    }),
  };
  const pay = (invoiceId: string, unitAmount = 1199) =>
    rewardReferral({ userId: "friend", invoiceId, unitAmount, currency: "aud" }, deps);
  return { deps, referral, credits, pay };
}

describe("rewardReferral (1 free month per paid month, for the friend's first 3)", () => {
  it("pays one month of credit on the friend's first payment", async () => {
    const w = fakeWorld();
    expect(await w.pay("in_1")).toBe("rewarded");
    expect(w.credits).toEqual([{ instalment: 1, amount: 1199 }]);
    expect(w.referral).toMatchObject({ monthsRewarded: 1, status: "active" });
  });

  it("pays one month per paid month, stops after three", async () => {
    const w = fakeWorld();
    for (const inv of ["in_1", "in_2", "in_3", "in_4", "in_5"]) await w.pay(inv);
    expect(w.credits.map((c) => c.instalment)).toEqual([1, 2, 3]);
    expect(w.credits.reduce((n, c) => n + c.amount, 0)).toBe(3 * 1199);
    expect(w.referral.status).toBe("rewarded");
  });

  it("a throwaway account that pays once earns exactly what it paid, never more", async () => {
    const w = fakeWorld();
    await w.pay("in_1", 1199); // pays one month, then cancels
    expect(w.credits.reduce((n, c) => n + c.amount, 0)).toBeLessThanOrEqual(1199);
  });

  it("the same invoice never pays twice (webhook retries)", async () => {
    const w = fakeWorld();
    await w.pay("in_1");
    expect(await w.pay("in_1")).toBe("none");
    expect(w.credits).toHaveLength(1);
  });

  it("does nothing when the friend wasn't referred", async () => {
    const w = fakeWorld();
    expect(await rewardReferral({ userId: "stranger", invoiceId: "in_1", unitAmount: 1199, currency: "aud" }, w.deps)).toBe("none");
    expect(w.deps.creditReferrer).not.toHaveBeenCalled();
  });

  it("caps a NEW friend once the referrer has the maximum earning friends", async () => {
    const w = fakeWorld({ earning: MAX_REWARDED_REFERRALS });
    expect(await w.pay("in_1")).toBe("capped");
    expect(w.deps.creditReferrer).not.toHaveBeenCalled();
    expect(w.referral.status).toBe("capped");
  });

  it("lets a friend who is already earning finish their three months, even at the cap", async () => {
    const w = fakeWorld({ months: 1, status: "active", earning: MAX_REWARDED_REFERRALS });
    expect(await w.pay("in_2")).toBe("rewarded");
    expect(w.credits).toEqual([{ instalment: 2, amount: 1199 }]);
  });

  it("ignores zero or invalid prices and missing invoice ids", async () => {
    const w = fakeWorld();
    expect(await w.pay("in_1", 0)).toBe("none");
    expect(await rewardReferral({ userId: "friend", invoiceId: "", unitAmount: 1199, currency: "aud" }, w.deps)).toBe("none");
    expect(w.deps.findOpen).not.toHaveBeenCalled();
  });

  it("records nothing if crediting fails, so Stripe's retry can finish it", async () => {
    const w = fakeWorld();
    (w.deps.creditReferrer as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("stripe down"));
    await expect(w.pay("in_1")).rejects.toThrow("stripe down");
    expect(w.deps.recordInstalment).not.toHaveBeenCalled();
    expect(await w.pay("in_1")).toBe("rewarded"); // the retry succeeds
  });
});

describe("webhook triggers an instalment only on a real monthly payment", () => {
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
  it("on the first paid invoice", async () => {
    expect(await run(invoice({}))).toHaveBeenCalledWith({ userId: "friend", invoiceId: "in_1", unitAmount: 1199, currency: "aud" });
  });
  it("on a paid renewal", async () =>
    expect(await run(invoice({ id: "in_2", billing_reason: "subscription_cycle" }))).toHaveBeenCalledWith(
      expect.objectContaining({ invoiceId: "in_2" })));
  it("not on other invoices (e.g. plan changes)", async () =>
    expect(await run(invoice({ billing_reason: "subscription_update" }))).not.toHaveBeenCalled());
  it("not on a $0 invoice", async () => expect(await run(invoice({ amount_paid: 0 }))).not.toHaveBeenCalled());
  it("not on a failed payment", async () => expect(await run(invoice({}), "invoice.payment_failed")).not.toHaveBeenCalled());
});

describe("findExistingCredit (retries after Stripe's 24-hour idempotency window)", () => {
  const txns = [
    { id: "cbtxn_other", amount: -1199, metadata: { referral_id: "ref-2", instalment: "1" } },
    { id: "cbtxn_debit", amount: 500, metadata: { referral_id: "ref-1", instalment: "1" } },
    { id: "cbtxn_first", amount: -1199, metadata: { referral_id: "ref-1", instalment: "1" } },
  ];
  it("finds the earlier credit for this instalment", () => expect(findExistingCredit(txns, "ref-1", 1)).toBe("cbtxn_first"));
  it("does not mistake instalment 1 for instalment 2", () => expect(findExistingCredit(txns, "ref-1", 2)).toBeNull());
  it("returns null when this referral was never credited", () => expect(findExistingCredit(txns, "ref-3", 1)).toBeNull());
  it("ignores transactions without metadata", () =>
    expect(findExistingCredit([{ id: "x", amount: -1, metadata: null }], "ref-1", 1)).toBeNull());
});
