import { describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import { isFullRefund, processStripeEvent, periodEnd, type SyncDeps, type SubscriptionRow } from "@/lib/stripe/sync";
import { grantsAccess } from "@/lib/security";

const sub = (over: Record<string, unknown> = {}) =>
  ({
    id: "sub_1",
    customer: "cus_1",
    status: "active",
    cancel_at_period_end: false,
    metadata: { user_id: "user-1", book_slug: "molecular-atlas" },
    items: { data: [{ current_period_end: 1_900_000_000 }] },
    ...over,
  }) as unknown as Stripe.Subscription;

const evt = (type: string, object: unknown, id = "evt_1") =>
  ({ id, type, data: { object } }) as unknown as Stripe.Event;

function deps(over: Partial<SyncDeps> = {}, current = sub()) {
  const rows: SubscriptionRow[] = [];
  const d: SyncDeps = {
    claimEvent: vi.fn(async () => "new" as const),
    markProcessed: vi.fn(async () => {}),
    retrieveSubscription: vi.fn(async () => current),
    upsertSubscription: vi.fn(async (r) => void rows.push(r)),
    linkCustomer: vi.fn(async () => {}),
    userForCustomer: vi.fn(async () => null),
    subscriptionForCharge: vi.fn(async () => "sub_1"),
    cancelSubscriptionNow: vi.fn(async () => {}),
    ...over,
  };
  return { d, rows };
}

describe("processStripeEvent", () => {
  it("skips duplicate events entirely (idempotent)", async () => {
    const { d, rows } = deps({ claimEvent: vi.fn(async () => "duplicate" as const) });
    expect(await processStripeEvent(evt("customer.subscription.updated", sub()), d)).toBe("duplicate");
    expect(rows).toHaveLength(0);
    expect(d.retrieveSubscription).not.toHaveBeenCalled();
    expect(d.markProcessed).not.toHaveBeenCalled();
  });

  it("checkout.session.completed links the customer and records the subscription", async () => {
    const { d, rows } = deps();
    const s = { mode: "subscription", customer: "cus_1", client_reference_id: "user-1", subscription: "sub_1", metadata: {} };
    await processStripeEvent(evt("checkout.session.completed", s), d);
    expect(d.linkCustomer).toHaveBeenCalledWith("user-1", "cus_1");
    expect(rows[0]).toMatchObject({ id: "sub_1", user_id: "user-1", book_slug: "molecular-atlas", status: "active" });
    expect(d.markProcessed).toHaveBeenCalledWith("evt_1");
  });

  it("ignores non-subscription checkouts", async () => {
    const { d, rows } = deps();
    await processStripeEvent(evt("checkout.session.completed", { mode: "payment" }), d);
    expect(rows).toHaveLength(0);
  });

  it("uses fresh Stripe state, not the (possibly stale) event payload", async () => {
    const { d, rows } = deps({}, sub({ status: "canceled" }));
    await processStripeEvent(evt("customer.subscription.updated", sub({ status: "active" })), d);
    expect(rows[0].status).toBe("canceled");
  });

  it("failed payment results in the stored status Stripe reports (past_due)", async () => {
    const { d, rows } = deps({}, sub({ status: "past_due" }));
    const invoice = { parent: { subscription_details: { subscription: "sub_1" } } };
    await processStripeEvent(evt("invoice.payment_failed", invoice), d);
    expect(d.retrieveSubscription).toHaveBeenCalledWith("sub_1");
    expect(rows[0].status).toBe("past_due");
  });

  it("falls back to the customer->user mapping when metadata lacks user_id", async () => {
    const { d, rows } = deps(
      { userForCustomer: vi.fn(async () => "user-9") },
      sub({ metadata: { book_slug: "molecular-atlas" } }),
    );
    await processStripeEvent(evt("customer.subscription.created", sub()), d);
    expect(rows[0].user_id).toBe("user-9");
  });

  it("does not store subscriptions it cannot attribute", async () => {
    const { d, rows } = deps({}, sub({ metadata: {} }));
    await processStripeEvent(evt("customer.subscription.created", sub()), d);
    expect(rows).toHaveLength(0);
  });

  it("does not mark processed when handling fails, so Stripe's retry works", async () => {
    const { d } = deps({ upsertSubscription: vi.fn(async () => { throw new Error("db down"); }) });
    await expect(processStripeEvent(evt("customer.subscription.updated", sub()), d)).rejects.toThrow("db down");
    expect(d.markProcessed).not.toHaveBeenCalled();
  });

  it("acknowledges unrelated events", async () => {
    const { d } = deps();
    expect(await processStripeEvent(evt("charge.refunded", {}), d)).toBe("processed");
    expect(d.markProcessed).toHaveBeenCalled();
  });
});

describe("periodEnd", () => {
  it("reads the billing period from the subscription item (current API)", () => {
    expect(periodEnd(sub())).toBe(new Date(1_900_000_000 * 1000).toISOString());
  });
  it("falls back to the legacy top-level field", () => {
    expect(periodEnd(sub({ items: { data: [{}] }, current_period_end: 1_800_000_000 }))).toBe(
      new Date(1_800_000_000 * 1000).toISOString(),
    );
  });
});

describe("subscription lifecycle from webhooks", () => {
  const future = new Date((1_900_000_000) * 1000);
  it("cancel at period end keeps access until the period ends", async () => {
    const { d, rows } = deps({}, sub({ cancel_at_period_end: true }));
    await processStripeEvent(evt("customer.subscription.updated", sub()), d);
    expect(rows[0]).toMatchObject({ status: "active", cancel_at_period_end: true });
    expect(grantsAccess(rows[0].status, rows[0].current_period_end, new Date(future.getTime() - 1000))).toBe(true);
    expect(grantsAccess(rows[0].status, rows[0].current_period_end, new Date(future.getTime() + 1000))).toBe(false);
  });
  it.each(["canceled", "paused", "unpaid", "past_due", "incomplete_expired"])(
    "a subscription that becomes %s loses access",
    async (status) => {
      const { d, rows } = deps({}, sub({ status }));
      await processStripeEvent(evt("customer.subscription.deleted", sub()), d);
      expect(rows[0].status).toBe(status);
      expect(grantsAccess(rows[0].status, rows[0].current_period_end)).toBe(false);
    },
  );
  it("resubscribing after cancellation stores a new active subscription", async () => {
    const { d, rows } = deps({}, sub({ id: "sub_2", status: "active" }));
    await processStripeEvent(evt("customer.subscription.created", sub({ id: "sub_2" }), "evt_new"), d);
    expect(rows[0]).toMatchObject({ id: "sub_2", status: "active" });
  });
});

describe("refunds end access immediately (owner policy)", () => {
  const charge = (over: Record<string, unknown> = {}) =>
    ({ id: "ch_1", amount: 1199, amount_refunded: 1199, refunded: true, payment_intent: "pi_1", ...over });

  it("a full refund cancels the subscription it paid for, and access ends", async () => {
    const { d, rows } = deps({}, sub({ status: "canceled" }));
    await processStripeEvent(evt("charge.refunded", charge()), d);
    expect(d.subscriptionForCharge).toHaveBeenCalled();
    expect(d.cancelSubscriptionNow).toHaveBeenCalledWith("sub_1");
    expect(rows[0].status).toBe("canceled");
    expect(grantsAccess(rows[0].status, rows[0].current_period_end)).toBe(false);
  });

  it("a partial refund leaves access alone", async () => {
    const { d, rows } = deps();
    await processStripeEvent(evt("charge.refunded", charge({ amount_refunded: 500, refunded: false })), d);
    expect(d.cancelSubscriptionNow).not.toHaveBeenCalled();
    expect(rows).toHaveLength(0);
  });

  it("a refund of a non-subscription payment changes nothing", async () => {
    const { d } = deps({ subscriptionForCharge: vi.fn(async () => null) });
    await processStripeEvent(evt("charge.refunded", charge()), d);
    expect(d.cancelSubscriptionNow).not.toHaveBeenCalled();
  });

  it("if cancelling fails, the event is not marked done, so Stripe retries it", async () => {
    const { d } = deps({ cancelSubscriptionNow: vi.fn(async () => { throw new Error("stripe down"); }) });
    await expect(processStripeEvent(evt("charge.refunded", charge()), d)).rejects.toThrow("stripe down");
    expect(d.markProcessed).not.toHaveBeenCalled();
  });

  it("recognises full and partial refunds", () => {
    expect(isFullRefund({ refunded: true, amount: 1199, amount_refunded: 1199 })).toBe(true);
    expect(isFullRefund({ refunded: false, amount: 1199, amount_refunded: 1199 })).toBe(true);
    expect(isFullRefund({ refunded: false, amount: 1199, amount_refunded: 600 })).toBe(false);
  });
});
