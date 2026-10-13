# Apex Education

Digital textbook subscription platform (Next.js App Router, TypeScript, Tailwind v4, Motion).

## Run locally
    npm install
    npm run dev        # http://localhost:3000
    npm run build && npm start

## Status (Phase 1 + public pages)
| Area | Status |
|---|---|
| Brand tokens, typography, logo assets, shared components | Working |
| Homepage, About, How it works, Pricing, Support | Working (static content) |
| Catalogue search + subject filter, Molecular Atlas page | Working against `src/lib/catalogue.ts` (moves to database) |
| Pricing ($11.99/month, one subscription = one book) | Display only: `src/lib/plans.ts`; Stripe will be the source of truth |
| Auth, dashboard, reader, admin, Stripe checkout/webhooks, Supabase, email | Not built |
| Support contact form, author bio, support email, legal pages | Placeholders (TODO owner) |

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
