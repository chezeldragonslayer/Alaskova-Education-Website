# Alaskova Education

Digital textbook subscription platform (Next.js App Router, TypeScript, Tailwind v4, Motion).

## Run locally
    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

## Status
| Area | Status |
|---|---|
| Public site, catalogue, pricing, info pages | Working |
| Sign-up / sign-in (email, Google, Microsoft), sessions, route protection | **Built, needs Supabase configured** |
| Student dashboard (library, subscription status, billing portal link, sign out) | **Built, needs Supabase + Stripe configured** |
| Stripe Checkout, Customer Portal, signature-verified idempotent webhook | **Built, needs Stripe configured** |
| Server-side entitlement check + signed launch token for the Molecular Atlas module | **Built, needs keys + module URL** |
| Unit tests (webhook idempotency, access rules, tokens, redirect/CSRF guards) | 43 passing |
| NOT yet tested against live Supabase/Stripe | Do the checklist below before launch |
| Reader inside this site, admin area, Resend emails, PostHog, Sentry, support form | Not built |

## Setup (in order)
1. **Supabase**: create a project. SQL editor: run `supabase/migrations/0001_init.sql`, then `supabase/migrations/0002_referrals.sql` (referral rewards).
   - Authentication > URL Configuration: Site URL = `NEXT_PUBLIC_SITE_URL`; add Redirect URL `NEXT_PUBLIC_SITE_URL/auth/callback`.
   - Authentication > Providers: enable Email, Google (needs a Google Cloud OAuth client) and Azure (Microsoft; needs an Entra app registration). Callback URL for both is shown in the Supabase provider screen.
   - Decide whether "Confirm email" stays on (recommended).
2. **Stripe**: Products > create "Molecular Atlas" with a recurring monthly price of $11.99 (set your currency). Copy the `price_...` id to `STRIPE_PRICE_MOLECULAR_ATLAS`.
   - Developers > Webhooks > add endpoint `NEXT_PUBLIC_SITE_URL/api/stripe/webhook` for: `checkout.session.completed`, `customer.subscription.created|updated|deleted|paused|resumed`, `invoice.paid`, `invoice.payment_failed`. Copy the signing secret to `STRIPE_WEBHOOK_SECRET`.
   - Settings > Billing > Customer portal: enable cancellation and payment-method updates.
3. **Keys for the textbook module**: `node scripts/generate-module-keys.mjs`. Put the private key in `ALASKOVA_MODULE_PRIVATE_KEY`; give the module agent the public key or `/.well-known/jwks.json`.
4. **Render**: new Web Service from this repo. Build `npm ci && npm run build`, start `npm start`, add every variable from `.env.example`.
5. Make yourself admin (admin screens come later): `update public.profiles set role='admin' where email='you@example.com';`

## Pre-launch test checklist (use Stripe test mode first)
- [ ] Register by email, confirm email, sign in/out. Try Google and Microsoft.
- [ ] Subscribe with test card 4242 4242 4242 4242; dashboard shows the book within seconds.
- [ ] Failed payment (card 4000 0000 0000 0341) removes access once Stripe marks the subscription past_due.
- [ ] Cancel in the billing portal; access ends at the period end.
- [ ] Open `/dashboard` signed out: redirected to sign-in. Open `/read/molecular-atlas` without a subscription: refused.
- [ ] Stripe CLI `stripe trigger` / resend an event: second delivery is acknowledged and ignored.

## Access rules
Access = subscription status `active` or `trialing` AND period not ended. `past_due`, `unpaid`, `canceled`, `incomplete` get no access. Access is decided only on the server from webhook-confirmed data, never from the checkout redirect.

## Owner-editable content (until the admin area exists)
- Book details / description: `src/lib/catalogue.ts`
- Price and plan: `src/lib/plans.ts`
- FAQs: `src/lib/demo.ts`

## Hosting
Target is Render (Node web service: `npm ci && npm run build`, start `npm start`). Add environment variables in Render, never in the repo.

## Brand notes
- Logo files in `public/brand/` are the supplied artwork (opaque white background); never recreated or recoloured.
- `#1D7DD9` (bright blue) is 4.2:1 on white: use for large text, graphics and dark backgrounds only. `#176BC0` (5.4:1) is the AA-safe blue for text/buttons.
- Header uses the symbol only (guideline: below 160px wide use symbol). A horizontal lockup would need to be supplied/commissioned.

## Demo content
`src/lib/demo.ts` holds placeholder books/FAQs. No real titles, prices, publishers or statistics are used.

## Molecular Atlas module
See `docs/molecular-atlas-module-brief.md` for the integration contract (separate Render service, signed launch token, Stripe stays on this site).
