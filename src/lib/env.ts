import "server-only";

/**
 * Lazy environment access. Nothing throws at import/build time, so the site
 * still builds and the public pages still work before services are configured.
 * Server-only secrets must never be prefixed NEXT_PUBLIC_.
 */
function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const authConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const billingConfigured = () =>
  Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.STRIPE_WEBHOOK_SECRET &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

export const env = {
  supabaseUrl: () => need("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: () => need("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceRoleKey: () => need("SUPABASE_SERVICE_ROLE_KEY"),
  stripeSecretKey: () => need("STRIPE_SECRET_KEY"),
  stripeWebhookSecret: () => need("STRIPE_WEBHOOK_SECRET"),
  /** Stripe Price id for a book, e.g. STRIPE_PRICE_MOLECULAR_ATLAS. */
  stripePriceForBook: (slug: string) =>
    need(`STRIPE_PRICE_${slug.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`),
  /** Module launch URL for a book, e.g. MODULE_URL_MOLECULAR_ATLAS (optional). */
  moduleUrlForBook: (slug: string) =>
    process.env[`MODULE_URL_${slug.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`] ?? null,
  moduleSigningKeyPem: () => need("ALASKOVA_MODULE_PRIVATE_KEY"),
  moduleKeyId: () => process.env.ALASKOVA_MODULE_KID ?? "alaskova-module-1",
};
