import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { getSubscriptions } from "@/lib/access";
import { LIVE_STATUSES, grantsAccess } from "@/lib/security";

/**
 * Closing an account (legal brief D5, Terms section 9):
 *  - with a subscription that still gives access: cancel it at the end of the paid period, keep access until then,
 *    and delete the account automatically when Stripe ends the subscription (webhook customer.subscription.deleted);
 *  - otherwise: cancel anything still live and delete the account straight away.
 * Billing and tax records stay in Stripe, as the Privacy policy says. The request is logged in support_requests.
 */
const SCHEDULED = "Scheduled: close the account when the paid period ends.";

export type ClosureResult = { mode: "scheduled"; endsAt: string | null } | { mode: "deleted" };

export async function closeAccount(user: { id: string; email?: string | null; name: string }): Promise<ClosureResult> {
  const db = createSupabaseAdmin();
  const stripe = getStripe();
  const live = (await getSubscriptions(user.id)).filter((s) => (LIVE_STATUSES as readonly string[]).includes(s.status));
  const withAccess = live.filter((s) => grantsAccess(s.status, s.current_period_end));

  if (withAccess.length > 0) {
    for (const s of live) {
      if (grantsAccess(s.status, s.current_period_end)) {
        await stripe.subscriptions.update(s.id, { cancel_at_period_end: true });
      } else {
        await stripe.subscriptions.cancel(s.id); // e.g. an unpaid one: nothing more should be charged
      }
    }
    const endsAt = withAccess.map((s) => s.current_period_end).filter(Boolean).sort().at(-1) ?? null;
    const { data: open } = await db
      .from("support_requests")
      .select("id")
      .eq("user_id", user.id)
      .eq("kind", "account_deletion")
      .eq("status", "open")
      .limit(1);
    if (!open?.length) {
      const { error } = await db.from("support_requests").insert({
        kind: "account_deletion",
        topic: "privacy",
        user_id: user.id,
        name: user.name || "(no name)",
        email: user.email ?? "(no email)",
        message: `${SCHEDULED} Access ends ${endsAt ?? "(unknown)"}.`,
      });
      if (error) throw error;
    }
    return { mode: "scheduled", endsAt };
  }

  for (const s of live) await stripe.subscriptions.cancel(s.id);
  const { error: logError } = await db.from("support_requests").insert({
    kind: "account_deletion",
    topic: "privacy",
    user_id: user.id,
    name: user.name || "(no name)",
    email: user.email ?? "(no email)",
    message: "Closed and deleted straight away (no active subscription).",
    status: "done",
    handled_at: new Date().toISOString(),
  });
  if (logError) console.error("closure log failed", logError.message);
  const { error } = await db.auth.admin.deleteUser(user.id);
  if (error) throw error;
  return { mode: "deleted" };
}

/** The user's pending closure, if they asked to close their account and it is waiting for the paid period to end. */
export async function pendingClosure(userId: string): Promise<boolean> {
  const { data } = await createSupabaseAdmin()
    .from("support_requests")
    .select("id")
    .eq("user_id", userId)
    .eq("kind", "account_deletion")
    .eq("status", "open")
    .like("message", `${SCHEDULED}%`)
    .limit(1);
  return Boolean(data?.length);
}

/** Called by the webhook when a subscription ends: deletes the account if a scheduled closure is waiting. */
export async function completeScheduledClosure(userId: string): Promise<void> {
  if (!(await pendingClosure(userId))) return;
  const db = createSupabaseAdmin();
  const live = (await getSubscriptions(userId)).filter((s) => grantsAccess(s.status, s.current_period_end));
  if (live.length > 0) return; // another subscription still gives access: wait for that one to end
  const { error: markError } = await db
    .from("support_requests")
    .update({ status: "done", handled_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("kind", "account_deletion")
    .eq("status", "open");
  if (markError) throw markError;
  const { error } = await db.auth.admin.deleteUser(userId);
  if (error) throw error;
}
