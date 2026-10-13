/**
 * Plan configuration. Stripe is the source of truth for what a customer is
 * actually charged; this file drives display only and is replaced by
 * database/Stripe-synced plans in Phase 2.
 *
 * Owner-confirmed: $11.99 per month, one subscription = one textbook.
 * TO CONFIRM: currency (shown as "$" only) and whether an annual option exists.
 */
export type Plan = {
  id: string;
  name: string;
  priceCents: number;
  interval: "month";
  /** Textbook slug this subscription unlocks. */
  bookSlug: string;
};

export const plans: Plan[] = [
  {
    id: "molecular-atlas-monthly",
    name: "Molecular Atlas",
    priceCents: 1199,
    interval: "month",
    bookSlug: "molecular-atlas",
  },
];

export const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

export const planForBook = (slug: string) =>
  plans.find((p) => p.bookSlug === slug);
