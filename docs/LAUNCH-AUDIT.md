# Alaskova Education website: launch audit

Audit of `main` at commit `3dda063` (21 October 2026), before any changes were made. The live test site
(https://alaskova-education-website.onrender.com) was checked from the outside only: response codes and headers, no
sign-in. Nothing was tested against a real Supabase project or Stripe account, because those keys are not available to
the agent.

**How to read this.** *Blocker* = must be fixed before taking real money. *High* = fix before launch. *Medium* = fix
soon after, or before launch if time allows. *Low* = polish. The "Status" column says what this pass did about it:
**Fixed** (code changed and tested), **Drafted** (built, needs the owner or a lawyer to confirm), **Owner** (a business
decision or dashboard step only the owner can take), **Open** (known, not done yet, with the reason).

Baseline checks on a fresh clone: `npm run lint` passes, `npm test` passes (58 tests), `npm run build` passes,
`npm run typecheck` **fails** until a build has been run once (finding Q1).

## Summary for the owner

The core of the site is well built: payments go through Stripe Checkout, access is only granted from messages Stripe
signs, the database blocks customers from reading or editing anyone else's records, and the book is unlocked with a
short-lived signed pass that matches what Molecular Atlas expects. What is missing is mostly the "shop front"
paperwork a real business needs (legal pages, password reset, an account page, a support contact) and a handful of
billing edge cases where the site could charge someone twice or describe the book wrongly.

## Blockers

| # | Area | File | What is wrong | Why it matters | Fix | Status |
|---|---|---|---|---|---|---|
| B1 | Legal | `src/lib/nav.ts` (footer links) | `/legal/terms`, `/legal/privacy`, `/legal/refunds` return 404. | Selling subscriptions in Australia without terms, a privacy policy (the site collects names and emails) and a clear cancellation policy is a legal and Stripe-account risk. | Draft all three as clearly marked drafts, with placeholders for the legal entity, ABN and address. A lawyer must review them. | Drafted |
| B2 | Copy | `src/app/page.tsx`, `pricing/page.tsx`, `catalogue/[slug]/page.tsx`, `src/lib/demo.ts` | The site promises **bookmarks**, **adjustable text size**, "upgrade, downgrade" and "search by course". Molecular Atlas has no bookmarks, its settings page says font scaling is "still to come", there is only one plan, and the catalogue has no courses. It also says progress follows you "on any device", but progress is stored only in the learner's browser unless the optional progress endpoint is built. | Claims that are not true of the product are misleading conduct under Australian Consumer Law, and lead to refund requests. | Rewrite the copy to features the module really has: chapter/lesson navigation with a table of contents, light and dark themes, progress tracking saved in your browser, practice and review, notebook, search and glossary. | Fixed |
| B3 | Billing | `src/app/api/stripe/checkout/route.ts` | The "already subscribed" guard only looks for `active`/`trialing`. A customer whose card failed (`past_due`/`unpaid`), whose subscription is `paused`, or who double-clicks Subscribe before Stripe's webhook arrives can start a **second** subscription and be charged twice. | Double charges mean refunds, disputes and Stripe penalties. | Refuse a new checkout while any subscription for that book is in a live state, checked both in our database and directly in Stripe, and send the customer to the billing portal instead. | Fixed |
| B4 | Support | `src/app/support/page.tsx` | No way at all to contact the business ("Support contact details coming soon"). | Australian Consumer Law and Stripe both expect customers to be able to reach you; without it, customers go straight to a card dispute. | Add a support email (placeholder until the owner supplies one) and a rate-limited contact form that stores messages in the database. | Drafted (email is a placeholder) |
| B5 | Accounts | `src/proxy.ts`, `src/app/support/page.tsx` | No password reset, though the Support page promises it. `/account` is protected by `proxy.ts` but does not exist (404 after sign-in). | Customers who forget their password are locked out of a paid product. | Build request-reset and set-new-password pages (Supabase recovery email) and an `/account` page. | Fixed (needs Supabase email template change, see GO-LIVE) |

## High

| # | Area | File | What is wrong | Why it matters | Fix | Status |
|---|---|---|---|---|---|---|
| H1 | Security headers | `next.config.ts` | No `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, framing protection (`frame-ancestors`/`X-Frame-Options`) or CSP on any page. `X-Powered-By: Next.js` is sent. Confirmed on the live site. | The sign-in page can be framed by another site (clickjacking), and browsers get no hardening hints. | Add these headers for every route and turn off `X-Powered-By`. A full script-blocking CSP needs per-request nonces, which conflicts with the pre-rendered pages; a non-breaking CSP (`frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action` for our own site, Stripe and the sign-in providers) is added now. | Fixed |
| H2 | Billing | `src/lib/plans.ts` | Prices show as "$11.99" with no currency, and the Stripe price currency is not confirmed. | If Stripe charges USD while the site implies AUD (or the reverse) the price shown is wrong. Australian pricing rules expect the currency to be clear. | Owner confirms the currency; the code then shows "A$" or "US$". | Owner |
| H3 | Billing | `src/lib/security.ts` (`grantsAccess`) | A single failed renewal (`past_due`) removes access at once, with no grace period. Stripe keeps retrying the card for days. | A customer whose card expired loses the book mid-study before they have even seen the email. | Owner decides the grace period (common choice: keep access while `past_due` for up to 7 days). Code change is small once decided. | Owner |
| H4 | Billing | `src/app/api/stripe/webhook/route.ts`, `src/lib/stripe/sync.ts` | Refunds and disputes (`charge.refunded`, `charge.dispute.created`) are ignored: refunding a customer in Stripe does not end their access, and a chargeback does not either. | Refunded or charged-back customers keep reading for free until the period ends. | Owner decides the policy (for example: refund = cancel immediately; dispute = cancel). For now GO-LIVE.md tells the owner to "cancel immediately" in Stripe when refunding. | Owner |
| H5 | Referrals | `src/lib/referrals.ts` | Throwaway-account abuse: one person can create a second account with another email, subscribe for one month ($11.99), cancel, and earn 3 months ($35.97) of credit. Repeated 12 times (the cap) that is 36 free months for 12 paid ones. The reward is also paid immediately, so a friend who pays and then gets a refund or files a dispute still earns the referrer 3 months. | Direct revenue loss; the cap limits it but does not stop it. | Owner decides: (a) reward only after the friend's **second** paid invoice, or 30 days after the first, and (b) refuse a reward when the friend's card is the same card the referrer uses (Stripe card fingerprint). Both are code changes once agreed. | Owner |
| H6 | Hosting | Render | The live site is on Render's free plan: it sleeps after inactivity and took **34 seconds** to answer the first request in this audit. Stripe webhooks that hit a sleeping site can time out and be retried, delaying access. The in-memory rate limits also reset every time it sleeps. | Slow first page, delayed access after payment, weaker abuse protection. | Paid always-on instance, one instance, health check. See GO-LIVE.md. | Owner |
| H7 | Keys | Render env | The test signing key was shared in a chat. | Anyone holding it can mint passes that open the book. | Generate a new key pair before launch and update the module. See GO-LIVE.md. | Owner |
| H8 | Email | Supabase | Supabase's built-in email sender is heavily rate-limited (a few emails per hour) and is not meant for production. Confirmation and password-reset emails will stop arriving. | Customers cannot confirm accounts or reset passwords. | Set up custom SMTP (for example Resend) in Supabase. See GO-LIVE.md. | Owner |
| H9 | Module | `src/app/read/[slug]/route.ts` | If the database or the signing key fails, `/read` throws and the learner sees a bare server error page. | Confusing dead end for a paying customer. | Catch failures and send the learner to the dashboard with "We couldn't open the reader. Please try again shortly." | Fixed |
| H10 | Errors | `src/app/` | No custom 404, error or global-error pages; failures show Next.js's unbranded defaults. | Looks broken; no route back to the library or support. | Add branded `not-found`, `error` and `global-error` pages. | Fixed |
| H11 | Accounts | `src/app/auth/callback/route.ts` | Email confirmation uses the PKCE code flow, which only works in the same browser the person signed up in. Opening the confirmation email on their phone shows "That sign-in link didn't work", although the account is in fact confirmed. | New customers think sign-up failed. | Add `/auth/confirm` (the token-hash flow Supabase recommends for server-rendered sites) and point the Supabase email templates at it; it also powers password reset. | Fixed (template change is an owner step) |

## Medium

| # | Area | File | What is wrong | Why it matters | Fix | Status |
|---|---|---|---|---|---|---|
| M1 | Rate limiting | `src/lib/security.ts`, `src/app/(auth)/actions.ts` | The limiter lives in memory, so it only works on a **single** instance and resets on restart. It keys on the **first** `X-Forwarded-For` value, which the visitor can set to anything, so the sign-in limit can be bypassed. The map is never pruned. | Password guessing and sign-up spam are only blunted by Supabase's own limits. | Use the client address set by Render's edge (`CF-Connecting-IP`/`True-Client-IP`), prune expired entries, and keep the site on one instance. A shared store (Redis) is the long-term answer if the site ever scales out. | Fixed (single-instance limit remains, documented) |
| M2 | Cookies | `src/proxy.ts`, `src/lib/supabase/server.ts` | Supabase session cookies are readable by JavaScript (the library default), although the site never reads them in the browser. | If any script injection ever happened, the session could be stolen. | Set the Supabase cookies `HttpOnly` and `Secure` (in production). | Fixed |
| M3 | Referrals | `src/lib/referrals-db.ts` | Stripe remembers idempotency keys for 24 hours only. If crediting the referrer succeeded but recording it failed, and Stripe's webhook retry comes more than 24 hours later, the referrer could be credited twice. | Small double-credit risk. | Before crediting, look for an existing balance transaction for this referral in Stripe. | Fixed |
| M4 | Referrals | `src/lib/referrals.ts` | Cap race: two friends paying at the same moment when the referrer has 11 rewards can both be rewarded (13 total). | Very small over-payment. | Accept for launch; a database-level counter would close it. | Open (accepted) |
| M5 | Dashboard | `src/app/dashboard/page.tsx` | A cancelled subscription is shown as "Canceled · Renews 3 March". A failed payment (`past_due`) shows no explanation. The list heading says "No active subscriptions" even when there are cancelled ones. | Confusing billing information. | Status-aware wording: "Ends", "Ended", "Payment failed: update your card". | Fixed |
| M6 | Module | `docs/molecular-atlas-module-brief.md`, module `.env.example` | The module's example `ALASKOVA_LIBRARY_URL` is `https://www.<domain>/library`, a page this site does not have (404). | "Back to my library" from the book would land on a 404. | Add `/library` that redirects to `/dashboard`, and set `ALASKOVA_LIBRARY_URL` to `/dashboard`. | Fixed (redirect); module setting in GO-LIVE |
| M7 | SEO | `src/app/` | No `sitemap.xml` or `robots.txt` (404 on the live site). Private routes are not disallowed for crawlers. | Search engines index less of the public site and may probe private URLs. | Add `sitemap.ts` and `robots.ts`. | Fixed |
| M8 | Config | `.gitignore` | `.env.example` is ignored by `.env*`, so it is not in the repo, although the README tells you to "add every variable from `.env.example`". | Whoever sets up Render has no list of variables. | Commit a `.env.example` with names only, no values. | Fixed |
| M9 | Privacy | Molecular Atlas | The module has an optional AI tutor (`ANTHROPIC_API_KEY`) that sends the learner's questions to Anthropic, and stores progress, notes and tutor conversations in the learner's browser. | The privacy policy must mention both if the tutor is switched on. | Drafted privacy policy covers both, conditionally. Owner confirms whether the tutor will be on. | Owner |
| M10 | Copy | `src/lib/demo.ts` | FAQ says "Access to textbooks is checked on the server for every request." In fact the subscription is checked when the book opens and again whenever the book's session runs out (30 to 60 minutes). | Inaccurate security claim. | Reword. | Fixed |
| M11 | Header | `src/components/SiteHeader.tsx` | The header always shows "Sign in / Get started", even when signed in (the links do redirect signed-in users to the dashboard). | Minor confusion. | Add a "My library" link. | Fixed |
| M12 | Account deletion | `supabase/migrations/0001_init.sql` | Deleting a user in Supabase cascades away their subscription records but **does not cancel the Stripe subscription**, which keeps charging. | A deleted customer could keep being billed. | Account deletion is a recorded request the owner processes: cancel in Stripe first, then delete the user. Steps in GO-LIVE.md. | Drafted |

## Low

| # | Area | File | What is wrong | Fix | Status |
|---|---|---|---|---|---|
| L1 | Webhook | `src/lib/stripe/db.ts` | Two simultaneous deliveries of the same event can both be processed. Harmless, because processing re-reads Stripe and the referral credit is idempotent. | None needed. | Open (accepted) |
| L2 | Webhook | `src/lib/stripe/sync.ts` | Two different events processed at the same moment could write an older snapshot last. The next event corrects it. | None needed for launch. | Open (accepted) |
| L3 | Profiles | `0001_init.sql` | `profiles.email` is not updated if a user changes email. Nothing reads it yet. | Fix when the admin area is built. | Open |
| L4 | Mobile menu | `SiteHeader.tsx` | Focus is not trapped inside the open mobile menu; Escape closes it. | Add a focus trap later. | Open |
| L5 | Forms | `AuthForm.tsx` | Error messages are announced but inputs have no `aria-invalid`/`aria-describedby`. | Add when forms are next touched. | Open |
| L6 | Copy | `src/app/page.tsx` | Headline "All Your Textbooks" while there is one textbook. This is brand copy, so it is the owner's call. | Owner. | Owner |
| L7 | Module | Molecular Atlas `README.md` | Describes itself as "organic and medicinal chemistry". The website says organic chemistry only, as instructed. | Owner to confirm wording. | Owner |
| L8 | Tooling | `package.json` | `npm run typecheck` fails on a fresh clone (`LayoutProps` is generated by Next). | Run `next typegen` first. | Fixed |
| L9 | About | `src/app/about/page.tsx` | Author bio is a placeholder (`TODO(owner)`). | Owner supplies name, bio, photo. | Owner |
| L10 | Footer | `SiteFooter.tsx` | No legal entity / ABN (`TODO(business)`). | Placeholder made visible, listed for owner. | Owner |

## Areas checked and found sound

- **Open redirects**: `safeNext` only allows same-site paths and rejects `//`, `/\` and control characters; tested.
- **CSRF**: every cookie-authenticated POST route (checkout, portal, sign-out) requires a matching `Origin` header;
  server actions get Next's built-in Origin check.
- **Database security (RLS)**: every table has row-level security. Customers can read only their own profile and
  subscriptions, can change only their display name, and cannot read or write Stripe links, webhook records,
  referral codes or referrals at all. The `role` column cannot be self-assigned.
- **Webhook**: signature verified on the raw body; each event id recorded once; failed events are retried by Stripe
  and re-processed; subscription state is re-fetched from Stripe, so out-of-order events cannot leave stale access.
  Access is never granted from the checkout redirect.
- **Cancel at period end** keeps access until the period ends (status stays `active` until Stripe ends it).
  **Paused**, **unpaid**, **incomplete** and **cancelled** give no access. **100%-off coupons** grant access but
  earn no referral reward.
- **Launch token** matches Molecular Atlas `INTEGRATION.md` exactly: EdDSA, `kid` `alaskova-module-1`, `iss`
  `alaskova-education`, `aud` and `book` `molecular-atlas`, opaque `sub` (the user id, no email), 60-second `exp`,
  unique `jti`, fresh token per launch, full-page redirect (no iframe), `Referrer-Policy: no-referrer` and
  `no-store` on the redirect. The module rejects bad tokens with a page that links back (no redirect loop) and
  returns learners to the page they were on after a fresh token.
- **Private routes** (`/dashboard`, `/read`, `/account`) send `Cache-Control: private, no-store` and
  `X-Robots-Tag: noindex`; the sign-in pages are `noindex`.
- **Error messages** shown to users are generic ("Incorrect email or password", sign-up never reveals whether an email
  exists); server logs record only the error message.
- **Secrets**: only `NEXT_PUBLIC_SUPABASE_URL`, the anon key and the site URL reach the browser. The service-role key,
  Stripe keys and signing key are read only in `server-only` modules. No secrets in the built client bundle.
- **Contrast**: brand colours are used correctly (Ocean for text and buttons, Bright only on dark backgrounds or as
  large text/focus rings). Focus outlines are visible; reduced motion is respected by the animation component and CSS.

## Key rotation plan (module pass)

The module accepts a JWKS (`ALASKOVA_JWKS_URL`) and refetches it when a token names an unknown `kid`. So rotation is:
generate a new key pair, set the new private key and a **new** `ALASKOVA_MODULE_KID` (for example `alaskova-module-2`)
on this site, deploy. The JWKS immediately publishes the new key; the module picks it up on the first token. Because
tokens live 60 seconds, no overlap period is needed. If the module is configured with a fixed `ALASKOVA_PUBLIC_KEY`
instead, both services must be updated within the same few minutes. Recommendation: use the JWKS URL.

## What the learner sees when something goes wrong

| Situation | What happens |
|---|---|
| Not signed in, opens `/read/molecular-atlas` | Sent to sign-in, then straight back to the book. |
| Signed in, no subscription | Sent to the book's page with "You need an active subscription to read this textbook." |
| Database or signing key fails | (Fixed) Dashboard with "We couldn't open the reader. Please try again shortly." |
| Module URL not configured | Dashboard with "The online reader for this textbook isn't connected yet." |
| Module is down | The browser shows Render's own error page for the module. There is nothing this site can do about that page; monitoring (GO-LIVE) is the mitigation. |
| Module rejects the token (wrong key, clock skew) | Module shows a short page with a button back to `/read/molecular-atlas`. No loop. |
| Module session expires (30 to 60 minutes) | Module redirects to `/read/molecular-atlas`, which re-checks the subscription and issues a fresh pass, then the learner returns to the same page. |
| Subscription cancelled or payment failed | At the next session expiry, `/read` refuses and the learner lands on the subscribe page. |
