import { randomInt } from "node:crypto";

/**
 * Referral rules. Pure and dependency-injected so they can be unit tested without Stripe or a database.
 *
 * The offer, paid in instalments: for each of the FIRST REFERRAL_REWARD_MONTHS paid monthly payments a referred friend
 * makes, the referrer receives ONE month of credit on their own Alaskova Education bill. A genuine friend who stays three
 * months earns the full three months; a throwaway account can never earn more credit than it paid in, so creating fake
 * accounts is never profitable.
 *
 * Abuse guards (all enforced server-side):
 *  - a person can only be referred once, and never by themselves (database constraints);
 *  - only brand-new subscribers count (no earlier subscription of any kind);
 *  - each instalment needs a real payment: $0 invoices (100%-off coupons) earn nothing;
 *  - each paid invoice can pay at most one instalment, and each instalment is paid once (unique invoice id,
 *    unique referral+instalment, Stripe idempotency key, and a search for an earlier credit);
 *  - a referrer can have at most MAX_REWARDED_REFERRALS friends earning them rewards.
 */
export const REFERRAL_REWARD_MONTHS = 3;
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

/** Credit for one instalment, in the smallest currency unit (cents): one month at the friend's monthly price. */
export const instalmentCredit = (monthlyUnitAmount: number) => monthlyUnitAmount;

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

export type OpenReferral = { id: string; referrerId: string; monthsRewarded: number };

export type RewardDeps = {
  /** The referral for this friend that still has instalments to pay (status pending or active), if any. */
  findOpen(refereeId: string): Promise<OpenReferral | null>;
  /** Has this Stripe invoice already paid an instalment? */
  invoiceRewarded(invoiceId: string): Promise<boolean>;
  /** How many of this referrer's friends have started earning them rewards (status active or rewarded). */
  countEarning(referrerId: string): Promise<number>;
  /** Credit the referrer's Stripe balance (idempotent per referral + instalment). Returns the Stripe transaction id. */
  creditReferrer(input: {
    referrerId: string;
    referralId: string;
    instalment: number;
    amount: number;
    currency: string;
  }): Promise<string>;
  recordInstalment(input: {
    referralId: string;
    instalment: number;
    invoiceId: string;
    balanceTransactionId: string;
  }): Promise<void>;
  markCapped(referralId: string): Promise<void>;
};

/** Called for each paid subscription invoice of a referred friend. Safe to call more than once for the same invoice. */
export async function rewardReferral(
  input: { userId: string; invoiceId: string; unitAmount: number; currency: string },
  deps: RewardDeps,
): Promise<"none" | "rewarded" | "capped"> {
  if (!Number.isInteger(input.unitAmount) || input.unitAmount <= 0 || !input.invoiceId) return "none";
  const referral = await deps.findOpen(input.userId);
  if (!referral || referral.monthsRewarded >= REFERRAL_REWARD_MONTHS) return "none";
  if (await deps.invoiceRewarded(input.invoiceId)) return "none";

  // The cap applies when a friend would START earning; a friend already earning finishes their three instalments.
  if (referral.monthsRewarded === 0 && (await deps.countEarning(referral.referrerId)) >= MAX_REWARDED_REFERRALS) {
    await deps.markCapped(referral.id);
    return "capped";
  }

  const instalment = referral.monthsRewarded + 1;
  const txn = await deps.creditReferrer({
    referrerId: referral.referrerId,
    referralId: referral.id,
    instalment,
    amount: instalmentCredit(input.unitAmount),
    currency: input.currency,
  });
  await deps.recordInstalment({ referralId: referral.id, instalment, invoiceId: input.invoiceId, balanceTransactionId: txn });
  return "rewarded";
}

/** The id of a Stripe balance transaction that already credits this referral instalment, if there is one. */
export function findExistingCredit(
  transactions: { id: string; amount: number; metadata?: Record<string, string> | null }[],
  referralId: string,
  instalment: number,
): string | null {
  return (
    transactions.find(
      (t) => t.amount < 0 && t.metadata?.referral_id === referralId && t.metadata?.instalment === String(instalment),
    )?.id ?? null
  );
}
