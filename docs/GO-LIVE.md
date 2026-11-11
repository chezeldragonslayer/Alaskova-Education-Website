# Go-live checklist

Work through this in order once TEST-PLAN.md passes in Stripe test mode. Steps marked **[Owner]** can only be done by
you in a dashboard (Stripe, Supabase, Render, your domain registrar); the agent cannot do them. Steps marked **[Agent]**
are code changes an agent can make once you have decided.

Never paste a secret key into a chat, an email, a document or the repository. Paste secrets only into the Render
"Environment" screen.

## 0. Decisions needed first **[Owner]**

| Decision | Where it lands |
|---|---|
| ~~Currency and GST~~ **Decided:** A$8.99 per month in AUD, GST included (Alaskova Pty Ltd is GST-registered) | Stripe price A$8.99 AUD; inclusive GST tax rate (step 2.2) |
| ~~Grace period~~ **Decided: none.** Access pauses as soon as a renewal fails (current behaviour) | done |
| **Decided (11 Nov 2026):** any refund cancels the subscription at the end of the paid month (access continues until then); cancelling it yourself in Stripe ends access immediately; a dispute pauses access, then restores it (won) or ends it (lost). No change-of-mind refunds for part-months | refunds page, terms section 4; built into the webhook |
| ~~Referral programme~~ **Decided: removed** (7 Nov 2026) | done |
| Legal entity name, ABN, address, support email, governing state, minimum age | `src/lib/business.ts` and the age line in the terms **[Agent or Owner]** |
| ~~AI tutor~~ **Removed from the reader, 9 November 2026** | nothing to set; the privacy policy no longer mentions Anthropic |
| Analytics: none (current), or a privacy-friendly tool | privacy policy must change first |
| Lawyer review of the three legal pages, then remove the "Draft" banner and set `legalUpdated` | `src/components/LegalPage.tsx`, `src/lib/business.ts` |

## 1. Domain: alaskovaeducation.com (DNS at Wix) **[Owner]**

The domain's DNS is managed by Wix (nameservers `ns2/ns3.wixdns.net`) and currently points at Wix. Email for
`support@alaskovaeducation.com` runs through **Zoho**: never delete the `MX` records (`mx.zoho.com.au`, `mx2`, `mx3`) or
any `TXT` records for SPF/DKIM while doing this.

1. **Render, website service** > Settings > Custom Domains > **Add**: `alaskovaeducation.com`, then
   `www.alaskovaeducation.com`. Render shows the DNS record each one needs (an `A` record for the bare domain and a
   `CNAME` for www). Keep that screen open.
2. **Render, book service** > Settings > Custom Domains > **Add** `molecularatlas.alaskovaeducation.com` (a `CNAME`).
3. **Wix** > Domains > alaskovaeducation.com > **Manage DNS records**. If Wix says the domain is connected to a Wix
   site, first disconnect it from that site (Wix > Domains > ⋯ > "Disconnect from site"); the domain and email stay.
   - `A` record, host `@`: replace Wix's values with the address Render showed (remove the other Wix `A` records).
   - `CNAME`, host `www`: change to what Render showed (e.g. `alaskova-education-website.onrender.com`).
   - `CNAME`, host `atlas`: add, pointing to what Render showed for the book (e.g. `molecular-atlas.onrender.com`).
4. Back in Render, wait until all three show **Verified** and **Certificate issued** (minutes to a few hours).
5. Only then do steps 4 (Supabase), 5 (Render settings) and 6 (book settings) below. Switching settings before the
   domain works would take the site offline.

## 2. Stripe: switch from test to live **[Owner]**

Test-mode products, prices, keys and webhooks do **not** carry over to live mode.

1. Turn off "Test mode" (top right). Complete Stripe's account activation (business details, bank account).
2. Product catalogue > **Add product** "Molecular Atlas", recurring, monthly, **A$8.99 AUD**, "Include tax in
   price": **yes**. Copy the live `price_...` id. Then Product catalogue > **Tax rates** > New: "GST", 10%, Australia,
   **Inclusive**; put its `txr_...` id into Render as `STRIPE_TAX_RATE_GST`. Settings > Business > Tax details: add the
   ABN, so invoices are valid tax invoices.
3. Developers > API keys: copy the **live secret key** (`sk_live_...`). A restricted key with write access to Customers,
   Checkout Sessions, Subscriptions, Billing Portal, Customer balance transactions and read access to Prices also works.
4. Developers > Webhooks > **Add endpoint** `https://alaskovaeducation.com/api/stripe/webhook`, events:
   `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `customer.subscription.paused`, `customer.subscription.resumed`, `invoice.paid`,
   `invoice.payment_failed`, **`charge.refunded`**, **`charge.dispute.created`**, **`charge.dispute.closed`** (11 events). Copy its **signing secret** (`whsec_...`).
5. Settings > Billing > **Customer portal** (live mode): allow updating payment methods, viewing invoices, and cancelling
   **at the end of the billing period** (the refunds page promises this). Add links to your terms and privacy pages.
6. Settings > Billing > Subscriptions and emails: turn on emails for failed payments and expiring cards, and Smart
   Retries. Settings > Public details: support email and statement descriptor ("ALASKOVA EDUCATION").
   **Settings > Business > Public details > Terms of service URL: `https://alaskovaeducation.com/legal/terms`.**
   Required: checkout now shows a "I agree to the Terms" checkbox, and Stripe refuses to open checkout without this URL
   (students would see "Something went wrong"). Do it in both sandbox and live mode before the release goes live.
7. Refunds (what the refunds page promises):
   - Payments > the payment > **Refund**. That is all: the website sets the subscription to end at the end of the
     paid month. The student keeps access until then and is never charged again. This applies to every refund,
     including a charge made by mistake and a partial refund.
   - To end access **straight away** as well: Subscriptions > the subscription > **Cancel subscription > Immediately**.
8. Disputes: when a customer disputes a payment with their bank, the website **pauses** their access automatically
   (the library says why). Stripe emails you; respond in Stripe with the evidence. If you win (or the inquiry closes
   as a warning), access comes back automatically. If you lose, the subscription is cancelled and access ends.

## 3. Signing key for the book: replace the test key **[Owner]**

The current key was shared in a chat, so it must not be used in production.

1. On your own computer, in this repository: `node scripts/generate-module-keys.mjs`. It writes the new private key
   to `module-private-key.pem` (gitignored) and prints only the public key — a secret echoed to a terminal ends up in
   scrollback, shell history and any transcript, which is how the key you are replacing leaked.
2. Render > this site > Environment: replace `ALASKOVA_MODULE_PRIVATE_KEY` with the new private key and set
   `ALASKOVA_MODULE_KID` to a **new** value, e.g. `alaskova-module-2`. Save (Render redeploys).
3. Check `https://alaskovaeducation.com/.well-known/jwks.json` shows the new `kid`, then **delete
   `module-private-key.pem`**. The book needs no change: it reads the JWKS and refetches on an unknown `kid`.
4. If the module uses `ALASKOVA_JWKS_URL` (recommended) nothing else is needed: it fetches the new key the first time it
   sees the new `kid`. If it uses a pasted `ALASKOVA_PUBLIC_KEY`, replace that with the new public key at the same time.
5. Future rotations: repeat steps 1 to 4 with the next `kid`. Because launch passes last 60 seconds, there is no
   overlap to manage.

## 4. Supabase production settings **[Owner]**

1. Authentication > Providers > Email: **Confirm email ON**. Minimum password length 8 (matches the site).
2. Authentication > SMTP Settings: **enable custom SMTP**. Supabase's built-in sender allows only a handful of emails an
   hour and is not for real customers. Resend is a simple choice: create an account, verify your domain (it gives you
   DNS records: SPF, DKIM, and add a DMARC record), create an SMTP password, and enter host `smtp.resend.com`, port 465,
   user `resend`, the password, sender `no-reply@alaskovaeducation.com`, name "Alaskova Education". Then raise the email rate limit
   under Authentication > Rate Limits.
3. Authentication > URL Configuration: Site URL `https://alaskovaeducation.com`. Redirect URLs: `https://alaskovaeducation.com/**`.
   Remove the onrender.com and localhost entries once live.
4. Authentication > Email Templates (so links work when opened on another device):
   - Confirm signup: link to
     `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/dashboard`
   - Reset password: link to
     `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password`
   Brand the wording ("Alaskova Education") while you are there.
5. Google and Microsoft providers: switch the Google OAuth consent screen to "In production", and add the live domain
   to the authorised domains in Google Cloud and to the redirect URIs in the Microsoft Entra app registration.
6. SQL editor: confirm migrations 0001, 0002, 0003, 0004 and **0005** have been run, in that order (a new project:
   `supabase/setup-new-project.sql`, which now includes 0005).
7. Database > Backups: the Pro plan keeps daily backups for 7 days; Point-in-Time Recovery is an add-on. The free plan
   has **no** downloadable backups and pauses inactive projects: use Pro for a paying business.
8. Make yourself admin: `update public.profiles set role='admin' where email='you@example.com';`

## 5. Render: this website **[Owner]**

1. Instance type: a paid, always-on instance (Starter or higher). The free plan sleeps (the first request in the audit
   took 34 seconds), which delays Stripe webhooks.
2. Instances: **1**. The sign-in and contact-form rate limits are kept in memory and only work on a single instance.
3. Settings > Health Check Path: `/healthz`.
4. Build command `npm ci && npm run build`, start command `npm start`, Node 22 or later.
5. Environment: every name in `.env.example`, with **live** values. `NEXT_PUBLIC_SITE_URL=https://alaskovaeducation.com`.
   Changing `NEXT_PUBLIC_*` values needs a redeploy (they are built into the pages, as are sitemap.xml and robots.txt).
6. Auto-deploy from `main`: on. Every commit to `main` goes live, so only merge tested changes.

## 6. Molecular Atlas service: matching settings **[Owner]**, or ask its agent

| Setting | Value |
|---|---|
| `ALASKOVA_JWKS_URL` | `https://alaskovaeducation.com/.well-known/jwks.json` (and leave `ALASKOVA_PUBLIC_KEY` empty) |
| `ALASKOVA_RETURN_URL` | `https://alaskovaeducation.com/read/molecular-atlas` |
| `ALASKOVA_ORIGIN` | `https://alaskovaeducation.com` |
| `ALASKOVA_LIBRARY_URL` | `https://alaskovaeducation.com/dashboard` (`/library` also works; it redirects) |
| `ALASKOVA_ISSUER` / `MODULE_AUDIENCE` | `alaskova-education` / `molecular-atlas` |
| Instances | **1** (it remembers used launch passes in memory) on a paid always-on plan |
| Health check | `/healthz` |

On **this** site set `MODULE_URL_MOLECULAR_ATLAS=https://molecularatlas.alaskovaeducation.com`.

## 7. Final checks on the live site **[Owner]**

1. `npm run smoke -- https://alaskovaeducation.com`: every line PASS.
2. Subscribe with your own real card, open the book, then cancel in Manage billing and refund yourself in Stripe.
3. Send yourself a password reset and a contact-form message.

## 8. Monitoring **[Owner]**

- **Uptime**: a free external monitor (UptimeRobot, Better Stack) checking `https://alaskovaeducation.com/healthz` and
  `https://molecularatlas.alaskovaeducation.com/healthz` every few minutes, alerting you by email or SMS.
- **Stripe**: Developers > Webhooks shows failed deliveries; Stripe also emails you if the endpoint keeps failing.
- **Render**: Logs, and email notifications for failed deploys (Account settings > Notifications).
- **Contact form and deletion requests**: until email notifications are built, check Supabase > Table editor >
  `support_requests` (filter `status = open`) every business day.
- Error tracking (e.g. Sentry) was not added: it sends data to a third party, so it needs your approval and a privacy
  policy line first.

## 9. Account closures **[Owner]**

Students close their own account from **My account > Close my account** (legal brief D5). You don't need to do anything:
- no active subscription: the account is deleted straight away;
- active subscription: Stripe cancels it at the end of the paid month, and the account is deleted automatically when
  that happens. Each closure is logged in Supabase > `support_requests` (kind `account_deletion`).

If someone emails asking to be deleted instead: Stripe > Customers > search the email > cancel any active subscription
(immediately); then Supabase > Authentication > Users > the user > Delete user (this removes their profile and
subscription records). Email them that it is done. Stripe keeps its own billing records, which you need for tax.

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
