# Owner checklist: everything left before launch

In order. Each step says where it is done. Detailed click-by-click steps are in `GO-LIVE.md` (the step numbers in
brackets), and the tests are in `TEST-PLAN.md`. Never paste a secret key into a chat, email or document; only into
Render's Environment screen.

## A. Decide (no dashboards needed)

- [ ] **GST:** are you registered for GST (or will you be)? Ask your accountant. Then tell the agent which line to use
      on the terms page.
- [ ] **Change-of-mind refunds:** none, or e.g. "full refund if asked within 7 days of the first payment".
- [ ] **Analytics:** none, or a privacy-friendly tool (see the agent's advice).
- [ ] **Business details** for `src/lib/business.ts`: legal entity name, ABN, address for notices, support email, state
      for the governing law, plus minimum age, support reply time, and notice period for price changes.
- [ ] **About page:** your name, a short bio and a photo.
- [ ] **Book description:** the final blurb for Molecular Atlas (`src/lib/catalogue.ts`).
- [ ] **Molecular Atlas wording:** its own README says "organic and medicinal chemistry"; confirm what you want.

## B. Set up accounts

- [ ] **Domain:** buy/choose it; plan `www.<domain>` for the site and `atlas.<domain>` for the book. (GO-LIVE 1)
- [ ] **Support email address** on that domain, e.g. `support@<domain>`, and check you can receive mail.
- [ ] **Resend** (or another email sender): verify the domain, get SMTP details. (GO-LIVE 4.2)
- [ ] **Anthropic API key** for the AI tutor, with a monthly spending limit set in the Anthropic console.
- [ ] **Supabase:** upgrade to Pro (backups, no pausing). (GO-LIVE 4.7)
- [ ] **Render:** both services on a paid always-on plan, one instance each. (GO-LIVE 5, 6)

## C. Test everything in Stripe TEST mode

- [ ] Supabase SQL editor: run `supabase/migrations/0003_support_requests.sql`, then `0004_referral_instalments.sql`
      (0001 and 0002 should already be done).
- [ ] Stripe (test mode) > Developers > Webhooks > your endpoint > add the event **`charge.refunded`**, so a full
      refund ends access automatically.
- [ ] Supabase: custom SMTP on, Confirm email on, the two email templates changed. (GO-LIVE 4)
- [ ] Check the book's Render service has the matching settings, including `ANTHROPIC_API_KEY`. (GO-LIVE 6)
- [ ] Work through all 26 tests in `TEST-PLAN.md`. Note anything that fails and send it to the agent.

## D. Legal

- [ ] Fill in the business details (A), then have a **lawyer review** the terms, privacy policy and refunds pages.
- [ ] After review, ask the agent to remove the "Draft" banners and set the "last updated" date.

## E. Switch to live

- [ ] Stripe: activate the account, create the live A$11.99 monthly product, live webhook, customer portal settings
      (cancel at end of period), failed-payment emails. (GO-LIVE 2)
- [ ] **New signing key** for the book (the test one was shared in a chat), with a new key id. (GO-LIVE 3)
- [ ] Render: replace test keys with live ones, set `NEXT_PUBLIC_SITE_URL` to your domain, health check `/healthz`.
      (GO-LIVE 5)
- [ ] Supabase: Site URL and redirect URLs to your domain; Google and Microsoft sign-in set to production with the new
      domain. (GO-LIVE 4)
- [ ] Book's Render service: point `ALASKOVA_*` settings at your domain. (GO-LIVE 6)

## F. Launch day

- [ ] Ask the agent to run the smoke test against your domain (every line must pass).
- [ ] Buy a subscription with your own card, open the book, cancel, refund yourself.
- [ ] Set up uptime monitoring for both `/healthz` addresses. (GO-LIVE 8)
- [ ] From now on, check `support_requests` in Supabase every business day.
