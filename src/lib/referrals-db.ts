import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { ensureStripeCustomer } from "@/lib/stripe/customer";
import {
  REFERRAL_REWARD_MONTHS,
  decideAttach,
  findExistingCredit,
  generateReferralCode,
  normaliseReferralCode,
  type AttachDecision,
  type RewardDeps,
} from "@/lib/referrals";

/** The user's own referral code; created the first time it's needed. */
export async function getOrCreateReferralCode(userId: string): Promise<string> {
  const db = createSupabaseAdmin();
  const { data } = await db.from("referral_codes").select("code").eq("user_id", userId).maybeSingle();
  if (data?.code) return data.code as string;

  for (let attempt = 0; attempt < 6; attempt++) {
    const code = generateReferralCode();
    const { error } = await db.from("referral_codes").insert({ user_id: userId, code });
    if (!error) return code;
    if (error.code !== "23505") throw error;
    // Unique violation: either another request just created this user's code, or the code collided.
    const { data: again } = await db.from("referral_codes").select("code").eq("user_id", userId).maybeSingle();
    if (again?.code) return again.code as string;
  }
  throw new Error("Could not allocate a referral code");
}

export async function getReferralStats(userId: string) {
  const { data, error } = await createSupabaseAdmin()
    .from("referrals")
    .select("status")
    .eq("referrer_id", userId);
  if (error) throw error;
  const rows = data ?? [];
  const rewarded = rows.filter((r) => r.status === "rewarded").length;
  return {
    joined: rows.length,
    rewarded,
    monthsEarned: rewarded * REFERRAL_REWARD_MONTHS,
  };
}

/**
 * Records that `refereeId` was referred by the owner of `rawCode`, if the rules allow it.
 * Called at checkout, so it works the same for email and Google/Microsoft sign-ups.
 */
export async function attachReferral(refereeId: string, rawCode: unknown): Promise<AttachDecision | "unknown-code" | "invalid"> {
  const code = normaliseReferralCode(rawCode);
  if (!code) return "invalid";
  const db = createSupabaseAdmin();

  const [{ data: owner }, { data: existing }, { count }] = await Promise.all([
    db.from("referral_codes").select("user_id").eq("code", code).maybeSingle(),
    db.from("referrals").select("id").eq("referee_id", refereeId).maybeSingle(),
    db.from("subscriptions").select("id", { count: "exact", head: true }).eq("user_id", refereeId),
  ]);

  const referrerId = (owner?.user_id as string | undefined) ?? null;
  const decision = decideAttach({
    referrerId,
    refereeId,
    alreadyReferred: Boolean(existing),
    priorSubscriptions: count ?? 0,
  });
  if (decision !== "attach" || !referrerId) return decision === "attach" ? "unknown-code" : decision;

  const { error } = await db.from("referrals").insert({ referrer_id: referrerId, referee_id: refereeId });
  if (error && error.code !== "23505") throw error; // 23505 = a concurrent request already recorded it
  return "attach";
}

/** Real dependencies for rewardReferral: Supabase (service role) + Stripe customer balance. */
export function realRewardDeps(): RewardDeps {
  const db = createSupabaseAdmin();
  return {
    async findPending(refereeId) {
      const { data, error } = await db
        .from("referrals")
        .select("id, referrer_id")
        .eq("referee_id", refereeId)
        .eq("status", "pending")
        .maybeSingle();
      if (error) throw error;
      return data ? { id: data.id as string, referrerId: data.referrer_id as string } : null;
    },
    async countRewarded(referrerId) {
      const { count, error } = await db
        .from("referrals")
        .select("id", { count: "exact", head: true })
        .eq("referrer_id", referrerId)
        .eq("status", "rewarded");
      if (error) throw error;
      return count ?? 0;
    },
    async creditReferrer({ referrerId, referralId, amount, currency }) {
      const { data: user, error } = await db.auth.admin.getUserById(referrerId);
      if (error) throw error;
      const customerId = await ensureStripeCustomer(referrerId, user.user?.email);
      // Stripe forgets idempotency keys after 24 hours, but webhook retries can come days later. If an earlier attempt
      // already credited this referral (and only recording it failed), reuse that credit instead of adding another.
      const earlier = [];
      for await (const t of getStripe().customers.listBalanceTransactions(customerId, { limit: 100 })) earlier.push(t);
      const already = findExistingCredit(earlier, referralId);
      if (already) return already;
      // A NEGATIVE balance transaction is a credit: Stripe takes it off the referrer's next invoices.
      // The idempotency key guarantees one referral can never be credited twice, even if we retry.
      const txn = await getStripe().customers.createBalanceTransaction(
        customerId,
        {
          amount: -amount,
          currency,
          description: `Referral reward: ${REFERRAL_REWARD_MONTHS} months free`,
          metadata: { referral_id: referralId },
        },
        { idempotencyKey: `referral-${referralId}` },
      );
      return txn.id;
    },
    async markRewarded(referralId, balanceTransactionId) {
      const { error } = await db
        .from("referrals")
        .update({
          status: "rewarded",
          stripe_balance_transaction_id: balanceTransactionId,
          rewarded_at: new Date().toISOString(),
        })
        .eq("id", referralId)
        .eq("status", "pending");
      if (error) throw error;
    },
    async markCapped(referralId) {
      const { error } = await db.from("referrals").update({ status: "capped" }).eq("id", referralId).eq("status", "pending");
      if (error) throw error;
    },
  };
}
