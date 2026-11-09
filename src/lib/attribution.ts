/**
 * Privacy-conscious attribution. When a visitor arrives from a link such as
 *   https://alaskovaeducation.com/molecular-atlas?utm_source=instagram
 * the site remembers the SOURCE only (e.g. "instagram") in a first-party cookie for 30 days. If they subscribe, the
 * source is saved with the Stripe checkout and subscription, so subscriptions can be counted by source in Stripe.
 * No third-party tracker, no visitor profile, nothing else is stored. Listed in the privacy policy.
 */
export const SOURCE_COOKIE = "alaskova_src";
export const SOURCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/** Only known sources are kept; anything else is ignored (no free text from the address bar is stored). */
const KNOWN: Record<string, string> = { instagram: "instagram", ig: "instagram" };

export function sourceFromParams(params: URLSearchParams): string | null {
  const raw = (params.get("utm_source") ?? params.get("src") ?? "").trim().toLowerCase();
  return KNOWN[raw] ?? null;
}

/** The stored value is re-checked before use, so a hand-edited cookie can't put arbitrary text into Stripe. */
export function sourceFromCookie(value: string | undefined): string {
  return value && Object.values(KNOWN).includes(value) ? value : "direct";
}
