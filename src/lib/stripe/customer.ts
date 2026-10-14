import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { getStripe } from "./client";

/**
 * Finds or creates the Stripe customer for a user and records the link.
 * The idempotency key means two simultaneous calls (checkout + a referral reward) end up with one customer.
 */
export async function ensureStripeCustomer(userId: string, email: string | undefined | null) {
  const admin = createSupabaseAdmin();
  const { data: existing } = await admin
    .from("stripe_customers")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();
  if (existing?.stripe_customer_id) return existing.stripe_customer_id as string;

  const customer = await getStripe().customers.create(
    { email: email ?? undefined, metadata: { user_id: userId } },
    { idempotencyKey: `customer-${userId}` },
  );
  const { error } = await admin
    .from("stripe_customers")
    .upsert({ user_id: userId, stripe_customer_id: customer.id }, { onConflict: "user_id" });
  if (error) throw error;
  return customer.id;
}
