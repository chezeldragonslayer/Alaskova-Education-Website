#!/usr/bin/env node
/**
 * Black-box smoke test for a RUNNING copy of the site. Changes nothing and needs no keys.
 *   node scripts/smoke.mjs                      # http://localhost:3000
 *   node scripts/smoke.mjs https://alaskova-education-website.onrender.com
 * Exit code 0 = every check passed.
 */
const base = (process.argv[2] ?? process.env.SMOKE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok: Boolean(ok), detail });
const get = (path, init = {}) => fetch(base + path, { redirect: "manual", ...init });
const loc = (r) => r.headers.get("location") ?? "";

for (const p of ["/", "/catalogue", "/catalogue/molecular-atlas", "/pricing", "/how-it-works", "/about", "/support",
  "/legal/terms", "/legal/privacy", "/legal/refunds", "/login", "/register", "/forgot-password"]) {
  const r = await get(p);
  check(`GET ${p} is 200`, r.status === 200, r.status);
}

for (const p of ["/dashboard", "/account", "/read/molecular-atlas"]) {
  const r = await get(p);
  check(`GET ${p} signed out redirects to sign-in`, r.status >= 300 && r.status < 400 && loc(r).includes("/login"), `${r.status} ${loc(r)}`);
  check(`GET ${p} is never cached`, (r.headers.get("cache-control") ?? "").includes("no-store"), r.headers.get("cache-control"));
}

const lib = await get("/library");
check("/library redirects to the dashboard", loc(lib).endsWith("/dashboard"), loc(lib));

const missing = await get("/this-page-does-not-exist");
check("unknown page is 404 with the branded page", missing.status === 404 && (await missing.text()).includes("couldn’t find that page"), missing.status);

const home = await get("/");
const h = (k) => home.headers.get(k) ?? "";
check("CSP forbids framing", h("content-security-policy").includes("frame-ancestors 'none'"), h("content-security-policy"));
check("X-Frame-Options DENY", h("x-frame-options") === "DENY");
check("X-Content-Type-Options nosniff", h("x-content-type-options") === "nosniff");
check("Referrer-Policy set", h("referrer-policy") !== "");
check("Strict-Transport-Security set", h("strict-transport-security").includes("max-age="));
check("No X-Powered-By", !home.headers.has("x-powered-by"));

const robots = await (await get("/robots.txt")).text();
check("robots.txt disallows private pages", robots.includes("Disallow: /dashboard") && robots.includes("Sitemap:"));
const sitemap = await get("/sitemap.xml");
check("sitemap.xml lists the book", sitemap.status === 200 && (await sitemap.text()).includes("/catalogue/molecular-atlas"));

const jwksRes = await get("/.well-known/jwks.json");
if (jwksRes.status === 200) {
  const jwks = await jwksRes.json();
  const k = jwks.keys?.[0] ?? {};
  check("JWKS publishes an Ed25519 public key", k.kty === "OKP" && k.crv === "Ed25519" && k.alg === "EdDSA" && k.kid);
  check("JWKS never contains the private part", jwks.keys.every((key) => !("d" in key)));
} else {
  check("JWKS answers 503 when no signing key is configured", jwksRes.status === 503, jwksRes.status);
}

for (const path of ["/api/stripe/checkout", "/api/stripe/portal", "/auth/signout"]) {
  const r = await get(path, { method: "POST", headers: { origin: "https://evil.example" } });
  check(`POST ${path} from another site is refused (CSRF)`, r.status === 403, r.status);
}
const hook = await get("/api/stripe/webhook", { method: "POST", body: "{}" });
check("webhook without a Stripe signature is refused", hook.status === 400 || hook.status === 503, hook.status);
const forged = await get("/api/stripe/webhook", { method: "POST", body: "{}", headers: { "stripe-signature": "t=1,v1=forged" } });
check("webhook with a forged signature is refused", forged.status === 400 || forged.status === 503, forged.status);

const ref = await get("/r/not-a-code");
check("invalid referral link sets no cookie", !(ref.headers.get("set-cookie") ?? "").includes("alaskova_ref"));
const goodRef = await get("/r/ABCD2345");
check("referral link remembers the code and goes to sign-up", loc(goodRef).endsWith("/register") && (goodRef.headers.get("set-cookie") ?? "").includes("HttpOnly"), loc(goodRef));

const confirm = await get("/auth/confirm?token_hash=x&type=bogus");
check("email-confirm route rejects junk", loc(confirm).includes("/login?error=callback"), loc(confirm));
const evilNext = await get("/auth/callback?next=//evil.example");
check("auth callback never redirects off-site", !loc(evilNext).includes("evil.example"), loc(evilNext));

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.ok ? "" : `  (${r.detail})`}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed against ${base}`);
process.exit(failed ? 1 : 0);
