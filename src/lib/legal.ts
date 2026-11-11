import { business } from "@/lib/business";

/**
 * Wording that must match the legal pages (legal pages implementation brief, 11 November 2026).
 * If the price, billing, cancellation or liability terms change, update this file in the same release.
 */

/** The Terms "Last updated" date. Saved with every acceptance (sign-up and checkout) as terms_version. */
export const TERMS_VERSION = business.legalUpdated;

const SITE = "https://alaskovaeducation.com";

/** Stripe Checkout: the terms checkbox (Stripe supports Markdown links here). Brief item D2. */
export const CHECKOUT_TERMS_CHECKBOX =
  `I agree to the [Terms of service](${SITE}/legal/terms) and the [Cancellation and refunds policy](${SITE}/legal/refunds).`;

/** Stripe Checkout: key terms shown above the Pay button (Stripe allows 1,200 characters). Brief item D2. */
export const CHECKOUT_KEY_TERMS =
  "This is a subscription contract. You pay A$8.99 (including GST) today, then on the same date each month until you " +
  "cancel. There is no minimum term and no notice period. Cancel any time in My account → Manage billing and keep " +
  "access until the end of the month you've paid for. We don't refund part-months if you change your mind, but your " +
  "Australian Consumer Law rights are not affected. Access pauses if a payment fails. Your progress saves only in the " +
  "browser you study in, and we're not responsible for losing it if that browser's data is cleared.";

/** Shown on the library when a payment dispute has paused access. Brief item D4. */
export const DISPUTE_PAUSED_MESSAGE =
  `Your access is paused because a payment is being disputed with your bank. Contact ${business.supportEmail} if this is a mistake.`;
