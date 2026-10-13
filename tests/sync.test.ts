import { describe, expect, it, vi } from "vitest";
import type Stripe from "stripe";
import { processStripeEvent, periodEnd, type SyncDeps, type SubscriptionRow } from "@/lib/stripe/sync";

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
