import type { NextConfig } from "next";

/**
 * Security headers for every response.
 * The CSP is deliberately non-breaking: it forbids framing (clickjacking), plugins and <base> hijacking, but does not
 * restrict scripts, because a script CSP needs a per-request nonce, which would stop pages being pre-rendered.
 * `form-action` is left out on purpose: our forms redirect on to Stripe and the sign-in providers, and a missed host
 * there would break checkout.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Molecular Atlas's "Back to my library" link may point at /library; the library is the dashboard.
    return [
      { source: "/library", destination: "/dashboard", permanent: false },
      // Old addresses from before the November 2026 redesign keep working.
      { source: "/catalogue/molecular-atlas", destination: "/molecular-atlas", permanent: true },
      { source: "/catalogue/:slug", destination: "/modules", permanent: true },
      { source: "/catalogue", destination: "/modules", permanent: true },
      { source: "/how-it-works", destination: "/molecular-atlas", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
