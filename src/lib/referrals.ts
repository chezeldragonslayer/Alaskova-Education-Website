import { randomInt } from "node:crypto";

/**
 * Referral rules. Pure and dependency-injected so they can be unit tested without Stripe or a database.
 *
 * The offer: when a friend you referred makes their FIRST PAID subscription payment, you receive
 * REFERRAL_REWARD_MONTHS months of credit on your own Alaskova Education bill.
 *
 * Abuse guards (all enforced server-side):
 *  - a person can only be referred once, and never by themselves (database constraints);
 *  - only brand-new subscribers count (no earlier subscription of any kind);
 *  - the reward fires on a real payment: a $0 first invoice (100%-off coupon) earns nothing;
 *  - one referral can only ever be paid once (Stripe idempotency key + status check);
 *  - a referrer can earn at most MAX_REWARDED_REFERRALS rewards.
 */
export const REFERRAL_REWARD_MONTHS = 3;
/** Cap per person: 12 referrals = 36 free months. OWNER DECISION: change here if you want a different limit. */
export const MAX_REWARDED_REFERRALS = 12;
export const REFERRAL_COOKIE = "alaskova_ref";
export const REFERRAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/** No I, L, O, 0 or 1, so a code read aloud or typed from a screenshot is never ambiguous. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;
const CODE_PATTERN = new RegExp(`^[${ALPHABET}]{${CODE_LENGTH}}$`);

export function generateReferralCode(pick: (max: number) => number = (n) => randomInt(n)): string {
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) out += ALPHABET[pick(ALPHABET.length)];
  return out;
}

/** Accepts "abcd-efgh", " ABCD EFGH " etc. Returns the canonical code, or null if it isn't a valid code. */
export function normaliseReferralCode(input: unknown): string | null {
  if (typeof input !== "string" || input.length > 32) return null;
  const code = input.toUpperCase().replace(/[\s-]/g, "");
  return CODE_PATTERN.test(code) ? code : null;
}

/** "ABCD-EFGH" for display. */
export const formatReferralCode = (code: string) => `${code.slice(0, 4)}-${code.slice(4)}`;

export const referralLink = (siteOrigin: string, code: string) =>
  `${siteOrigin.replace(/\/$/, "")}/r/${code}`;

/** Credit in the smallest currency unit (cents) for the reward: N months at the monthly price. */
export const rewardCredit = (monthlyUnitAmount: number, months = REFERRAL_REWARD_MONTHS) =>
  monthlyUnitAmount * months;

export type AttachDecision = "attach" | "self" | "already-referred" | "not-new";

/** May this user be recorded as referred by this referrer? */
export function decideAttach(input: {
  referrerId: string | null;
  refereeId: string;
  alreadyReferred: boolean;
  priorSubscriptions: number;
}): AttachDecision | "unknown-code" {
  if (!input.referrerId) return "unknown-code";
  if (input.referrerId === input.refereeId) return "self";
  if (input.alreadyReferred) return "already-referred";
  if (input.priorSubscriptions > 0) return "not-new";
  return "attach";
}

export type PendingReferral = { id: string; referrerId: string };

export type RewardDeps = {
  findPending(refereeId: string): Promise<PendingReferral | null>;
  countRewarded(referrerId: string): Promise<number>;
  /** Credit the referrer's Stripe balance (must be idempotent per referralId). Returns the Stripe transaction id. */
  creditReferrer(input: {
    referrerId: string;
    referralId: string;
    amount: number;
    currency: string;
  }): Promise<string>;
  markRewarded(referralId: string, balanceTransactionId: string): Promise<void>;
  markCapped(referralId: string): Promise<void>;
};

/** Called when a user's first real payment succeeds. Safe to call more than once. */
export async function rewardReferral(
  input: { userId: string; unitAmount: number; currency: string },
  deps: RewardDeps,
): Promise<"none" | "rewarded" | "capped"> {
  if (!Number.isInteger(input.unitAmount) || input.unitAmount <= 0) return "none";
  const referral = await deps.findPending(input.userId);
  if (!referral) return "none";

  if ((await deps.countRewarded(referral.referrerId)) >= MAX_REWARDED_REFERRALS) {
    await deps.markCapped(referral.id);
    return "capped";
  }

  const txn = await deps.creditReferrer({
    referrerId: referral.referrerId,
    referralId: referral.id,
    amount: rewardCredit(input.unitAmount),
    currency: input.currency,
  });
  await deps.markRewarded(referral.id, txn);
  return "rewarded";
}

/** The id of a Stripe balance transaction that already credits this referral, if there is one. */
export function findExistingCredit(
  transactions: { id: string; amount: number; metadata?: Record<string, string> | null }[],
  referralId: string,
): string | null {
  return transactions.find((t) => t.amount < 0 && t.metadata?.referral_id === referralId)?.id ?? null;
}
