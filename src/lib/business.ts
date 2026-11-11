/**
 * Business facts shown on the legal pages, the footer and the support page.
 *
 * No postal address is published (owner's choice: it is a home address); notices and requests go to the support email.
 * OWNER: replace every value that starts with "[TO BE CONFIRMED" with the real details. Until you do, the site shows
 * the placeholder text as-is, so it is obvious on every page that it still needs filling in. Nothing here is a secret.
 */
export const business = {
  /** Brand and website name. NOT a registered business name (owner, 11 Nov 2026): never call it a "trading name". */
  tradingName: "Alaskova Education",
  /** The business name registered with ASIC that the company trades under. */
  registeredBusinessName: "Alaskova",
  /** The legal entity that sells the subscriptions: a company ("Alaskova Education Pty Ltd") or a sole trader's name. */
  legalEntity: "Alaskova Pty Ltd",
  /** Australian Business Number. */
  abn: "22 703 973 700",
  /** Address customers write to for help, privacy requests and refunds. */
  supportEmail: "support@alaskovaeducation.com",
  /** State or territory whose law governs the terms (e.g. "New South Wales"). */
  governingState: "New South Wales",
  /** Business Instagram account (never a personal account). */
  instagram: "alaskova",
  /** Date the legal pages came into force / were last updated (update whenever the text changes). Also saved as
   *  terms_version with every acceptance (src/lib/legal.ts). */
  legalUpdated: "11 November 2026",
} as const;

/** True once the owner has filled in a value (used to decide whether to show a mailto link). */
export const isConfirmed = (value: string) => !value.startsWith("[");

export const instagramUrl = `https://www.instagram.com/${business.instagram}/`;
