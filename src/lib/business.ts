/**
 * Business facts shown on the legal pages, the footer and the support page.
 *
 * OWNER: replace every value that starts with "[TO BE CONFIRMED" with the real details. Until you do, the site shows
 * the placeholder text as-is, so it is obvious on every page that it still needs filling in. Nothing here is a secret.
 */
export const business = {
  /** Trading name (fixed). */
  tradingName: "Alaskova Education",
  /** The legal entity that sells the subscriptions: a company ("Alaskova Education Pty Ltd") or a sole trader's name. */
  legalEntity: "[TO BE CONFIRMED: legal entity name]",
  /** Australian Business Number. */
  abn: "[TO BE CONFIRMED: ABN]",
  /** Address for legal notices (can be a registered office or PO box). */
  address: "[TO BE CONFIRMED: business address]",
  /** Address customers write to for help, privacy requests and refunds. */
  supportEmail: "[TO BE CONFIRMED: support email]",
  /** State or territory whose law governs the terms (e.g. "New South Wales"). */
  governingState: "[TO BE CONFIRMED: state or territory]",
  /** Date the legal pages were last updated (update whenever the text changes). */
  legalUpdated: "[DRAFT, not yet in force]",
} as const;

/** True once the owner has filled in a value (used to decide whether to show a mailto link). */
export const isConfirmed = (value: string) => !value.startsWith("[");
