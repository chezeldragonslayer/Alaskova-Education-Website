import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { grantsAccess } from "@/lib/security";

export type SubscriptionRecord = {
  id: string;
  book_slug: string;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export async function getSubscriptions(userId: string): Promise<SubscriptionRecord[]> {
  const { data, error } = await createSupabaseAdmin()
    .from("subscriptions")
    .select("id, book_slug, status, current_period_end, cancel_at_period_end")
    .eq("user_id", userId);
  if (error) throw error;
  return data ?? [];
}

/** Authoritative server-side entitlement check. Never trust client state or redirects. */
export async function hasAccess(userId: string, bookSlug: string): Promise<boolean> {
  const subs = await getSubscriptions(userId);
  return subs.some((s) => s.book_slug === bookSlug && grantsAccess(s.status, s.current_period_end));
}
