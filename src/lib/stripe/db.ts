import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { getStripe } from "./client";
import { invoiceSubscription, type SyncDeps } from "./sync";
import { TERMS_VERSION } from "@/lib/legal";
import { completeScheduledClosure } from "@/lib/account-closure";

/** Real dependencies for the webhook: Stripe API + Supabase (service role). */
export function realSyncDeps(): SyncDeps {
  const db = createSupabaseAdmin();
  const stripe = getStripe();
  return {
    async claimEvent(id, type) {
      const { error } = await db.from("stripe_events").insert({ id, type });
      if (!error) return "new";
      if (error.code !== "23505") throw error; // not a unique violation
      const { data, error: readErr } = await db
        .from("stripe_events")
        .select("processed_at")
        .eq("id", id)
        .single();
      if (readErr) throw readErr;
      // Seen before but never finished (earlier attempt failed): process again.
      return data.processed_at ? "duplicate" : "new";
    },
    async markProcessed(id) {
      const { error } = await db
        .from("stripe_events")
        .update({ processed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    retrieveSubscription: (id) => stripe.subscriptions.retrieve(id),
    async upsertSubscription(row) {
      const { error } = await db.from("subscriptions").upsert(row, { onConflict: "id" });
      // 23503 = the account no longer exists (closed and deleted). Nothing to store; don't make Stripe retry for days.
      if (error?.code === "23503") return console.warn("subscription event for a deleted account", row.id);
      if (error) throw error;
    },
    async linkCustomer(userId, customerId) {
      const { error } = await db
        .from("stripe_customers")
        .upsert({ user_id: userId, stripe_customer_id: customerId }, { onConflict: "user_id" });
      if (error) throw error;
    },
    async userForCustomer(customerId) {
      const { data } = await db
        .from("stripe_customers")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .maybeSingle();
      return data?.user_id ?? null;
    },
    async subscriptionForCharge(charge) {
      const paymentIntent = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      if (!paymentIntent) return null;
      // Current Stripe API versions link a payment to its invoice through "invoice payments".
      const payments = await stripe.invoicePayments.list({
        payment: { type: "payment_intent", payment_intent: paymentIntent },
        limit: 1,
      });
      const inv = payments.data[0]?.invoice;
      const invoiceId = typeof inv === "string" ? inv : inv?.id;
      if (!invoiceId) return null;
      return invoiceSubscription(await stripe.invoices.retrieve(invoiceId));
    },
    retrieveCharge: (chargeId) => stripe.charges.retrieve(chargeId),
    async setDisputePause(subscriptionId, paused) {
      // Setting a metadata value to "" removes the key in Stripe.
      await stripe.subscriptions.update(subscriptionId, { metadata: { access_paused: paused ? "dispute" : "" } });
    },
    async recordCheckoutConsent(subscriptionId, acceptedAt) {
      // Never fail the webhook over the consent record: payment and access matter more. Logged for follow-up.
      const { error } = await db
        .from("subscriptions")
        .update({ terms_accepted_at: acceptedAt, terms_version: TERMS_VERSION })
        .eq("id", subscriptionId);
      if (error) console.error("could not record checkout terms consent", subscriptionId, error.message);
    },
    async completeScheduledClosure(userId) {
      await completeScheduledClosure(userId);
    },
    async cancelAtPeriodEnd(subscriptionId) {
      const current = await stripe.subscriptions.retrieve(subscriptionId);
      if (current.status === "canceled" || current.status === "incomplete_expired" || current.cancel_at_period_end) return;
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
        cancellation_details: { comment: "Payment refunded: access continues to the end of the paid period (Alaskova Education policy)." },
      });
    },
    async cancelSubscriptionNow(subscriptionId) {
      const current = await stripe.subscriptions.retrieve(subscriptionId);
      if (current.status === "canceled" || current.status === "incomplete_expired") return;
      await stripe.subscriptions.cancel(
        subscriptionId,
        { cancellation_details: { comment: "Payment dispute lost: subscription ended (Alaskova Education policy)." } },
        { idempotencyKey: `dispute-cancel-${subscriptionId}` },
      );
    },
  };
}
