# Go-live checklist

Work through this in order once TEST-PLAN.md passes in Stripe test mode. Steps marked **[Owner]** can only be done by
you in a dashboard (Stripe, Supabase, Render, your domain registrar); the agent cannot do them. Steps marked **[Agent]**
are code changes an agent can make once you have decided.

Never paste a secret key into a chat, an email, a document or the repository. Paste secrets only into the Render
"Environment" screen.

## 0. Decisions needed first **[Owner]**

| Decision | Where it lands |
|---|---|
| ~~Currency~~ **Decided: AUD** (site shows A$11.99). Still open: GST registration and wording | Stripe price in AUD; terms page GST line |
| ~~Grace period~~ **Decided: none.** Access pauses as soon as a renewal fails (current behaviour) | done |
| **Decided:** a refund keeps access to the end of the paid period. Still open: whether you offer change-of-mind refunds at all | refunds page; how you refund in Stripe (step 2.7) |
| ~~Referral safeguards~~ **Decided: instalments** (1 free month per friend's paid month, up to 3). Built. Optional extra: refuse rewards when the friend pays with the referrer's own card | done |
| Legal entity name, ABN, address, support email, governing state, minimum age | `src/lib/business.ts` and the age line in the terms **[Agent or Owner]** |
| ~~AI tutor~~ **Decided: on** | privacy policy updated; set `ANTHROPIC_API_KEY` on the module (step 6) |
| Analytics: none (current), or a privacy-friendly tool | privacy policy must change first |
| Lawyer review of the three legal pages, then remove the "Draft" banner and set `legalUpdated` | `src/components/LegalPage.tsx`, `src/lib/business.ts` |

## 1. Domain **[Owner]**

1. Choose the domain, e.g. `www.<domain>` for this site and `atlas.<domain>` for the book.
2. Render > this service > Settings > Custom Domains > add `www.<domain>` (and the bare domain, redirecting to www).
   Add the DNS records Render shows at your registrar. Render issues the HTTPS certificate automatically; wait until it
   shows "Certificate issued".
3. Do the same on the Molecular Atlas service for `atlas.<domain>`.

## 2. Stripe: switch from test to live **[Owner]**

Test-mode products, prices, keys and webhooks do **not** carry over to live mode.

1. Turn off "Test mode" (top right). Complete Stripe's account activation (business details, bank account).
2. Product catalogue > **Add product** "Molecular Atlas", recurring, monthly, **$11.99 in the confirmed currency**.
   Copy the live `price_...` id.
3. Developers > API keys: copy the **live secret key** (`sk_live_...`). A restricted key with write access to Customers,
   Checkout Sessions, Subscriptions, Billing Portal, Customer balance transactions and read access to Prices also works.
4. Developers > Webhooks > **Add endpoint** `https://www.<domain>/api/stripe/webhook`, events:
   `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`, `invoice.paid`,
   `invoice.payment_failed`. Copy its **signing secret** (`whsec_...`).
5. Settings > Billing > **Customer portal** (live mode): allow updating payment methods, viewing invoices, and cancelling
   **at the end of the billing period** (the refunds page promises this). Add links to your terms and privacy pages.
6. Settings > Billing > Subscriptions and emails: turn on emails for failed payments and expiring cards, and Smart
   Retries. Settings > Public details: support email and statement descriptor ("ALASKOVA EDUCATION").
7. When you refund someone: Payments > the payment > Refund. Then open the subscription and **Cancel > At end of
   current period**. Your policy is that a refund keeps access until the period they paid for ends; the refund alone
   does not stop future charges, so the cancel step is what prevents next month's payment.
8. Disputes: Stripe emails you. Respond in Stripe with the evidence; consider cancelling the subscription.

## 3. Signing key for the book: replace the test key **[Owner]**

The current key was shared in a chat, so it must not be used in production.

1. On your own computer, in this repository: `node scripts/generate-module-keys.mjs`. It prints a new private key and
   public key. Do not paste them anywhere except step 2.
2. Render > this site > Environment: replace `ALASKOVA_MODULE_PRIVATE_KEY` with the new private key and set
   `ALASKOVA_MODULE_KID` to a **new** value, e.g. `alaskova-module-2`. Save (Render redeploys).
3. Check `https://www.<domain>/.well-known/jwks.json` shows the new `kid`.
4. If the module uses `ALASKOVA_JWKS_URL` (recommended) nothing else is needed: it fetches the new key the first time it
   sees the new `kid`. If it uses a pasted `ALASKOVA_PUBLIC_KEY`, replace that with the new public key at the same time.
5. Future rotations: repeat steps 1 to 4 with the next `kid`. Because launch passes last 60 seconds, there is no
   overlap to manage.

## 4. Supabase production settings **[Owner]**

1. Authentication > Providers > Email: **Confirm email ON**. Minimum password length 8 (matches the site).
2. Authentication > SMTP Settings: **enable custom SMTP**. Supabase's built-in sender allows only a handful of emails an
   hour and is not for real customers. Resend is a simple choice: create an account, verify your domain (it gives you
   DNS records: SPF, DKIM, and add a DMARC record), create an SMTP password, and enter host `smtp.resend.com`, port 465,
   user `resend`, the password, sender `no-reply@<domain>`, name "Alaskova Education". Then raise the email rate limit
   under Authentication > Rate Limits.
3. Authentication > URL Configuration: Site URL `https://www.<domain>`. Redirect URLs: `https://www.<domain>/**`.
   Remove the onrender.com and localhost entries once live.
4. Authentication > Email Templates (so links work when opened on another device):
   - Confirm signup: link to
     `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard`
   - Reset password: link to
     `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password`
   Brand the wording ("Alaskova Education") while you are there.
5. Google and Microsoft providers: switch the Google OAuth consent screen to "In production", and add the live domain
   to the authorised domains in Google Cloud and to the redirect URIs in the Microsoft Entra app registration.
6. SQL editor: confirm migrations 0001, 0002, **0003** and **0004** have been run, in that order.
7. Database > Backups: the Pro plan keeps daily backups for 7 days; Point-in-Time Recovery is an add-on. The free plan
   has **no** downloadable backups and pauses inactive projects: use Pro for a paying business.
8. Make yourself admin: `update public.profiles set role='admin' where email='you@example.com';`

## 5. Render: this website **[Owner]**

1. Instance type: a paid, always-on instance (Starter or higher). The free plan sleeps (the first request in the audit
   took 34 seconds), which delays Stripe webhooks.
2. Instances: **1**. The sign-in and contact-form rate limits are kept in memory and only work on a single instance.
3. Settings > Health Check Path: `/healthz`.
4. Build command `npm ci && npm run build`, start command `npm start`, Node 22 or later.
5. Environment: every name in `.env.example`, with **live** values. `NEXT_PUBLIC_SITE_URL=https://www.<domain>`.
   Changing `NEXT_PUBLIC_*` values needs a redeploy (they are built into the pages, as are sitemap.xml and robots.txt).
6. Auto-deploy from `main`: on. Every commit to `main` goes live, so only merge tested changes.

## 6. Molecular Atlas service: matching settings **[Owner]**, or ask its agent

| Setting | Value |
|---|---|
| `ALASKOVA_JWKS_URL` | `https://www.<domain>/.well-known/jwks.json` (and leave `ALASKOVA_PUBLIC_KEY` empty) |
| `ALASKOVA_RETURN_URL` | `https://www.<domain>/read/molecular-atlas` |
| `ALASKOVA_ORIGIN` | `https://www.<domain>` |
| `ALASKOVA_LIBRARY_URL` | `https://www.<domain>/dashboard` (`/library` also works; it redirects) |
| `ALASKOVA_ISSUER` / `MODULE_AUDIENCE` | `alaskova-education` / `molecular-atlas` |
| Instances | **1** (it remembers used launch passes in memory) on a paid always-on plan |
| Health check | `/healthz` |
| `ANTHROPIC_API_KEY` | your Anthropic API key (turns the AI tutor on; keep it secret) |

On **this** site set `MODULE_URL_MOLECULAR_ATLAS=https://atlas.<domain>`.

## 7. Final checks on the live site **[Owner]**

1. `npm run smoke -- https://www.<domain>`: every line PASS.
2. Subscribe with your own real card, open the book, then cancel in Manage billing and refund yourself in Stripe.
3. Send yourself a password reset and a contact-form message.

## 8. Monitoring **[Owner]**

- **Uptime**: a free external monitor (UptimeRobot, Better Stack) checking `https://www.<domain>/healthz` and
  `https://atlas.<domain>/healthz` every few minutes, alerting you by email or SMS.
- **Stripe**: Developers > Webhooks shows failed deliveries; Stripe also emails you if the endpoint keeps failing.
- **Render**: Logs, and email notifications for failed deploys (Account settings > Notifications).
- **Contact form and deletion requests**: until email notifications are built, check Supabase > Table editor >
  `support_requests` (filter `status = open`) every business day.
- Error tracking (e.g. Sentry) was not added: it sends data to a third party, so it needs your approval and a privacy
  policy line first.

## 9. Handling a deletion request **[Owner]**

1. Supabase > `support_requests`, open rows with kind `account_deletion`.
2. Stripe > Customers > search the email > cancel any active subscription (immediately) and decide on any refund.
3. Supabase > Authentication > Users > the user > Delete user. This removes their profile, subscription records,
   referral code and referrals automatically.
4. Email them that it is done; set the request's `status` to `done` and `handled_at` to now.
Stripe keeps its own billing records, which you need for tax.

## 10. Rollback plan

- **Bad deploy**: Render > this service > Events (or Deploys) > pick the last good deploy > **Rollback**. Takes about a
  minute. Then revert the bad commit on GitHub so the next auto-deploy does not bring it back.
- **Bad environment variable**: Render keeps no history of values, so keep a private, offline note of the last working
  non-secret values; secrets can be re-copied from Stripe/Supabase.
- **Database problem**: Supabase Pro > Database > Backups > restore. Restoring rewinds all data to that point, so Stripe
  may then hold newer subscription changes: after a restore, resend recent events from Stripe > Webhooks (the site
  ignores ones it has already processed).
- **Payments broken**: in Render, temporarily remove `STRIPE_PRICE_MOLECULAR_ATLAS`; Subscribe then shows "We couldn't
  start checkout" instead of charging anyone, while existing subscribers keep reading.
- **Book broken**: remove `MODULE_URL_MOLECULAR_ATLAS`; Read now shows "The online reader for this textbook isn't
  connected yet" rather than an error page.
