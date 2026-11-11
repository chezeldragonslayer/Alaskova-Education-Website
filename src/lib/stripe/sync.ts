import type Stripe from "stripe";

/**
 * Pure, dependency-injected Stripe -> database synchronisation.
 * The webhook route supplies real Stripe/Supabase deps; tests supply fakes.
 *
 * Design rules:
 *  - Access is NEVER granted from a checkout redirect; only from subscription state
 *    that Stripe has confirmed via a signature-verified webhook.
 *  - We re-fetch the subscription from Stripe for every relevant event, so
 *    out-of-order or replayed events can't leave stale state behind.
 *  - Each event id is claimed in `stripe_events`; duplicates are acknowledged and skipped.
 *  - Refunds (legal brief D4): a refund NEVER cancels a subscription by itself, so refunding a duplicate or incorrect
 *    charge leaves paid access alone. To end a subscription with a refund, the owner cancels it in the Stripe
 *    Dashboard as well (GO-LIVE.md step 2.7).
 *  - Disputes (legal brief D4): when a payment is disputed, access is paused (status "disputed"). If the dispute is won
 *    or closed as a warning, access is restored; if it is lost, the subscription is cancelled and access ends.
 *    The pause is stored on the Stripe subscription (metadata access_paused=dispute), so a re-sync never undoes it.
 */
export type SubscriptionRow = {
  id: string;
  user_id: string;
  book_slug: string;
  stripe_customer_id: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  updated_at: string;
};

export type SyncDeps = {
  /** 'new' = first time we've seen it (or a previous attempt failed); 'duplicate' = already processed. */
  claimEvent(id: string, type: string): Promise<"new" | "duplicate">;
  markProcessed(id: string): Promise<void>;
  retrieveSubscription(id: string): Promise<Stripe.Subscription>;
  upsertSubscription(row: SubscriptionRow): Promise<void>;
  linkCustomer(userId: string, customerId: string): Promise<void>;
  userForCustomer(customerId: string): Promise<string | null>;
  /** The subscription a charge paid for (via its invoice), or null if it wasn't a subscription payment. */
  subscriptionForCharge(charge: Stripe.Charge): Promise<string | null>;
  /** Fetch a charge (a dispute names its charge by id). */
  retrieveCharge(chargeId: string): Promise<Stripe.Charge>;
  /** Cancel a subscription immediately (no-op if it has already ended). */
  cancelSubscriptionNow(subscriptionId: string): Promise<void>;
  /** Pause (true) or restore (false) access because of a payment dispute. */
  setDisputePause(subscriptionId: string, paused: boolean): Promise<void>;
  /** Optional: record that the customer ticked the terms checkbox at checkout (legal brief D2). */
  recordCheckoutConsent?(subscriptionId: string, acceptedAt: string): Promise<void>;
  /** Optional: a subscription has ended; delete the account if its owner asked to close it (legal brief D5). */
  completeScheduledClosure?(userId: string): Promise<void>;
};

/** Our own status for a subscription whose access is paused while a payment dispute is open. */
export const DISPUTED = "disputed";

const id = (x: string | { id: string } | null | undefined) =>
  typeof x === "string" ? x : (x?.id ?? null);

export function periodEnd(sub: Stripe.Subscription): string | null {
  // Newer Stripe API versions keep the billing period on the subscription item.
  const item = sub.items?.data?.[0] as { current_period_end?: number } | undefined;
  const legacy = (sub as unknown as { current_period_end?: number }).current_period_end;
  const ts = item?.current_period_end ?? legacy;
  return ts ? new Date(ts * 1000).toISOString() : null;
}

export async function subscriptionToRow(
  sub: Stripe.Subscription,
  deps: Pick<SyncDeps, "userForCustomer">,
  now = new Date(),
): Promise<SubscriptionRow | null> {
  const customerId = id(sub.customer);
  const bookSlug = sub.metadata?.book_slug;
  let userId: string | null = sub.metadata?.user_id ?? null;
  if (!userId && customerId) userId = await deps.userForCustomer(customerId);
  if (!userId || !bookSlug) return null; // not one of ours / can't attribute
  return {
    id: sub.id,
    user_id: userId,
    book_slug: bookSlug,
    stripe_customer_id: customerId,
    // A dispute pauses access only while the subscription would otherwise give access.
    status:
      sub.metadata?.access_paused === "dispute" && (sub.status === "active" || sub.status === "trialing")
        ? DISPUTED
        : sub.status,
    current_period_end: periodEnd(sub),
    cancel_at_period_end: Boolean(sub.cancel_at_period_end),
    updated_at: now.toISOString(),
  };
}

function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const parent = (invoice as unknown as {
    parent?: { subscription_details?: { subscription?: string | { id: string } } };
  }).parent;
  const legacy = (invoice as unknown as { subscription?: string | { id: string } }).subscription;
  return id(parent?.subscription_details?.subscription) ?? id(legacy);
}

export function invoiceSubscription(invoice: Stripe.Invoice): string | null {
  return invoiceSubscriptionId(invoice);
}

async function syncSubscription(subId: string, deps: SyncDeps) {
  const sub = await deps.retrieveSubscription(subId);
  const row = await subscriptionToRow(sub, deps);
  if (row) await deps.upsertSubscription(row);
  return { sub, row };
}

export async function processStripeEvent(
  event: Stripe.Event,
  deps: SyncDeps,
): Promise<"processed" | "duplicate"> {
  if ((await deps.claimEvent(event.id, event.type)) === "duplicate") return "duplicate";

  switch (event.type) {
    case "checkout.session.completed": {
      const s = event.data.object as Stripe.Checkout.Session;
      if (s.mode !== "subscription") break;
      const customerId = id(s.customer);
      const userId = s.client_reference_id ?? s.metadata?.user_id ?? null;
      if (customerId && userId) await deps.linkCustomer(userId, customerId);
      const subId = id(s.subscription as string | { id: string } | null);
      if (subId) await syncSubscription(subId, deps);
      if (subId && s.consent?.terms_of_service === "accepted" && deps.recordCheckoutConsent) {
        await deps.recordCheckoutConsent(subId, new Date(s.created * 1000).toISOString());
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.paused":
    case "customer.subscription.resumed": {
      await syncSubscription((event.data.object as Stripe.Subscription).id, deps);
      break;
    }
    case "customer.subscription.deleted": {
      const { row } = await syncSubscription((event.data.object as Stripe.Subscription).id, deps);
      if (row && deps.completeScheduledClosure) await deps.completeScheduledClosure(row.user_id);
      break;
    }
    case "invoice.paid":
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = invoiceSubscriptionId(invoice);
      if (!subId) break;
      await syncSubscription(subId, deps);
      break;
    }
    case "charge.dispute.created":
    case "charge.dispute.closed": {
      const dispute = event.data.object as Stripe.Dispute;
      const chargeId = typeof dispute.charge === "string" ? dispute.charge : dispute.charge?.id;
      if (!chargeId) break;
      const subId = await deps.subscriptionForCharge(await deps.retrieveCharge(chargeId));
      if (!subId) break;
      if (event.type === "charge.dispute.created") {
        await deps.setDisputePause(subId, true);
      } else if (dispute.status === "lost") {
        await deps.cancelSubscriptionNow(subId);
        await deps.setDisputePause(subId, false);
      } else {
        // won, or an inquiry closed as a warning: access comes back
        await deps.setDisputePause(subId, false);
      }
      await syncSubscription(subId, deps);
      break;
    }
    default:
      break; // acknowledged, nothing to do
  }

  await deps.markProcessed(event.id);
  return "processed";
}
