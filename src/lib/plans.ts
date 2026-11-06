/**
 * Plan configuration. Stripe is the source of truth for what a customer is
 * actually charged; this file drives display only and is replaced by
 * database/Stripe-synced plans in Phase 2.
 *
 * One subscription = one textbook.
 * Owner-confirmed (7 Nov 2026): A$8.99 per month, GST included (Alaskova Pty Ltd is GST-registered).
 * TO CONFIRM: whether an annual option exists.
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
    priceCents: 899,
    interval: "month",
    bookSlug: "molecular-atlas",
  },
];

/** Australian dollars, written "A$" so overseas visitors are not misled into reading US dollars. */
export const formatPrice = (cents: number) => `A$${(cents / 100).toFixed(2)}`;

export const planForBook = (slug: string) =>
  plans.find((p) => p.bookSlug === slug);
