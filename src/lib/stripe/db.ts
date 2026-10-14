import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { getStripe } from "./client";
import { rewardReferral } from "@/lib/referrals";
import { realRewardDeps } from "@/lib/referrals-db";
import type { SyncDeps } from "./sync";

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
    rewardReferral: (input) => rewardReferral(input, realRewardDeps()),
  };
}
