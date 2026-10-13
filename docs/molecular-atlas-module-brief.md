# Brief for the Molecular Atlas module agent

You are working on **Molecular Atlas**, an organic and pharmaceutical chemistry textbook. It is one product of **Apex Education**, a digital textbook subscription business. Molecular Atlas will be hosted as its **own Render web service**, separate from the main **Apex Education website** (its own Render web service, repo: https://github.com/chezeldragonslayer/Apex-Education-Website). Your job is to make Molecular Atlas work as a **protected module** that the main website unlocks for paying subscribers. Do not build payments or user accounts into it.

## Architecture (fixed decisions)
- **The main Apex website owns everything commercial:** user accounts (Supabase Auth), Stripe (Checkout, Billing, Customer Portal, webhooks), and the database record of who is entitled to which book.
- **Stripe belongs to the main website only.** Molecular Atlas must contain no Stripe code, no Stripe keys, no checkout pages, no pricing, no sign-up or login. Customers pay at the main site: $11.99 per month, one subscription = one textbook.
- **Molecular Atlas owns only the textbook experience** and must never be reachable without a valid pass from the main website.
- Both services run on Render. Prefer subdomains of the same domain (for example `www.<domain>` for Apex and `atlas.<domain>` for the textbook). Users reach the module by a normal full-page redirect from Apex, **not an iframe** (iframes break cookies under modern browser privacy rules).

## The access flow you must implement
1. A subscriber clicks **Read** on the main site. The main site checks, server-side, that the user has an active subscription for this book, then redirects the browser to:
   `https://<module-host>/launch?token=<JWT>`
2. The `token` is a short-lived JWT signed by the main site. Signing is **EdDSA (Ed25519)**, header `kid` = `apex-module-1`. The main site holds the private key; the module holds only the **public key** (or fetches the JWKS the main site publishes at `https://<apex-host>/.well-known/jwks.json`). Do not share a signing secret with the module.
3. Claims you can rely on:
   - `iss` = `apex-education`
   - `aud` = `molecular-atlas`
   - `sub` = the Apex user's id (opaque; use it only as an identifier)
   - `book` = `molecular-atlas`
   - `iat`, `exp` (about 60 seconds after issue), `jti` (unique id)
4. `/launch` must **verify**: signature, algorithm (reject `none` and any unexpected alg), `iss`, `aud`, `book`, `exp` with small clock tolerance, and that the `jti` has **not been used before** (single use; keep used ids until they expire).
5. On success, the module creates its **own session**: an HttpOnly, Secure, SameSite=Lax cookie, signed or encrypted with `SESSION_SECRET`, lifetime **30 to 60 minutes**, containing only `sub`, the book, and an expiry. Then redirect to the book's first page.
6. When the session is missing or expired, **do not show an error wall**. Redirect the browser to `APEX_RETURN_URL` (the main site's read route, which is exactly `https://<apex-host>/read/molecular-atlas`), which re-checks the subscription and issues a fresh token. This is how cancellations take effect without the module ever talking to Stripe.
7. Provide a visible **Back to my library** link to the main site, and a logout that clears the module cookie.

## Protection rules (these are the whole point)
- Every route that serves textbook content, images, figures, data files, downloads and APIs must require a valid session. No content may be reachable by direct URL, search engine, or guessing.
- Only these may be public: `/launch`, `/healthz` (returns 200, no data), and generic branding or error assets. No textbook text in public HTML, public JSON or public static folders.
- Add `X-Robots-Tag: noindex, nofollow` and `Cache-Control: private, no-store` on all protected responses. Add a restrictive CSP, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: no-referrer`.
- Never log tokens or session cookies. Never put the token in any URL after `/launch` (redirect immediately so it does not stay in history).
- No user database and no personal data beyond `sub`. Do not collect names or emails.
- Rate-limit `/launch`.

## Configuration (environment variables on Render, never committed)
- `APEX_ISSUER=apex-education`
- `MODULE_AUDIENCE=molecular-atlas`
- `APEX_PUBLIC_KEY` (PEM) **or** `APEX_JWKS_URL`
- `APEX_RETURN_URL` (main site read route)
- `APEX_ORIGIN` (main site origin, for the back link and CORS if ever needed)
- `SESSION_SECRET` (long random string)
- `NODE_ENV=production`

## Local development without the main site
The main site's token issuer may not exist yet. Build a **dev-only token generator** (for example `npm run dev:token`) that creates a throwaway keypair and prints a valid launch URL. The module must **refuse to start in production** if any dev bypass setting is enabled.

## Design
Match Apex Education's branding so the transition feels seamless: Midnight Navy #032048, Deep Navy #062E61, Ocean Blue #176BC0, Bright Blue #1D7DD9, Steel Blue #0F4886, white backgrounds, Montserrat for headings and Inter for body text. Use Ocean Blue (#176BC0) for text and buttons; Bright Blue only for large text, graphics, and dark backgrounds, because it fails contrast for small text on white. Target WCAG 2.2 AA, keyboard navigation, responsive layout, and respect prefers-reduced-motion. Do not recreate the Apex logo; use files supplied by the owner.

## Deliverables
1. The token verification and session middleware, the `/launch`, `/healthz` and logout routes, and protected-route enforcement for **every** content route and asset.
2. Tests: valid token passes; expired, wrong `aud`, wrong `iss`, wrong `book`, tampered signature, `alg: none`, and **replayed `jti`** are all rejected; no session redirects to `APEX_RETURN_URL`; every content URL and asset returns a redirect or 401/403 without a session.
3. A `render.yaml` (or documented Render settings: build command, start command, health check path `/healthz`, environment variables).
4. A `README` explaining the flow, env vars, and how to generate a dev token, plus a short note listing what is finished and what is not.
5. A short **integration note** for the main-site developer stating the exact token claims, the public key or JWKS format you expect, and the module URL.

## Out of scope
Payments, pricing, user registration, password handling, email, analytics tied to personal data, and admin of subscriptions. All of that lives in the main Apex website.

## Ask before assuming
If anything here conflicts with how Molecular Atlas is built, stop and report the conflict with options rather than weakening the protection rules. Do not invent facts about the book, authors, or pricing.
