# End-to-end test plan (Stripe TEST mode)

Follow this before launch, with Stripe in **test mode** (the toggle at the top right of the Stripe Dashboard says
"Test mode"). Test cards never move real money.

Each step is marked:

- **Automated**: covered by tests in this repository. Run `npm test` (unit tests, no keys needed) and
  `npm run smoke -- <site address>` (checks a running site from the outside, changes nothing).
- **Owner, in a dashboard**: needs you to click through the site and look in Stripe or Supabase.
- **Not testable from code**: depends on something outside this repository (email delivery, Google/Microsoft, the
  Molecular Atlas service).

What has already been run (21 October 2026): `npm test` 104 tests passing; `npm run smoke -- http://localhost:3100`
40/40 against a local production build with **no** Supabase or Stripe keys. Nothing has yet been run against a
configured Supabase project or a Stripe account.

## Before you start

1. Supabase project created, migrations `0001`, `0002`, `0003` and `0004` run, in that order (Supabase > SQL editor).
2. Render environment variables set with **test** Stripe keys (`sk_test_...`, the test `whsec_...`, the test
   `price_...`). See `.env.example`.
3. Stripe webhook endpoint added for the events listed in GO-LIVE.md, step 2.
4. Run `npm run smoke -- https://<your Render address>` and confirm every line says PASS.
5. Use a fresh private/incognito window for each "person" in the tests. Use real email addresses you can open
   (Gmail's `you+test1@gmail.com` trick works).

## The tests

| # | Test | How | What you should see | Type |
|---|---|---|---|---|
| 1 | Sign up by email | Register at `/register`. Open the confirmation email **on your phone** (a different browser). | Email arrives within a minute. The link signs you in or lands on sign-in with a note that your account is probably confirmed. Signing in works. | Owner (email delivery: not testable from code) |
| 2 | Sign up with Google | "Continue with Google" on `/register`. | Lands on the dashboard, greeted by your Google first name. | Owner |
| 3 | Sign up with Microsoft | "Continue with Microsoft". | Same as 2. | Owner |
| 4 | Wrong password | Sign in with a wrong password. | "Incorrect email or password." The email you typed stays in the box. | Owner (message wording: automated) |
| 5 | Password reset | Sign in page > "Forgot your password?" > enter email > open the email > choose a new password. | Lands on My account with "Your password has been changed." The old password no longer works. | Owner |
| 6 | Subscribe | Catalogue > Molecular Atlas > Subscribe to read. Card `4242 4242 4242 4242`, any future date, any CVC, any postcode. | Stripe checkout shows **A$11.99 per month** (AUD). After paying, the dashboard says access is activating, then shows Molecular Atlas under My library within a few seconds. Stripe > Customers shows the customer with an active subscription. | Owner (webhook handling: automated) |
| 7 | No double subscription | While subscribed, open the book page in a second tab and press Subscribe again (or press it twice quickly during test 6). | You are sent to the dashboard with "You already have an active subscription". Stripe shows only **one** subscription. | Automated (logic) + Owner (confirm in Stripe) |
| 8 | Read now | Dashboard > Read now. | The book opens on the module's address. The address bar shows no `token=`. "Back to my library" returns to the dashboard. | Not testable from code (needs the module running); Automated: token contents match INTEGRATION.md |
| 9 | Signed out access refused | Sign out, then open `/dashboard`, `/account`, `/read/molecular-atlas` directly. | Each goes to the sign-in page. | Automated (smoke) |
| 10 | Unsubscribed access refused | Sign in as a second person with no subscription and open `/read/molecular-atlas`. | Book page with "You need an active subscription to read this textbook." | Owner (rule itself: automated) |
| 11 | Failed payment removes access | Subscribe with `4242...`. In Manage billing, replace the card with `4000 0000 0000 0341` (Stripe accepts this card but every charge on it fails). Then in Stripe > Subscriptions > open it > **Update subscription** and reset the billing cycle to now, so Stripe charges straight away. | Stripe marks the subscription **Past due**. Dashboard shows "Payment failed: update your card". Read now refuses within the module's session time (30 to 60 minutes) or immediately on a new launch. | Owner (status mapping: automated) |
| 12 | Fix a failed payment | Manage billing > update to `4242...` > pay the open invoice. | Status returns to Active; Read now works again. | Owner |
| 13 | Cancel keeps access until period end | Manage billing > Cancel subscription. | Dashboard: "Cancelled · Access until <date>". Read now still works. Stripe shows "Cancels <date>". | Owner (logic: automated) |
| 14 | Period end ends access | Waiting a month is impractical, so simulate the end: Stripe > Subscriptions > open it > **Cancel subscription > Immediately**. (Stripe test clocks cannot be used here, because the site creates its own Stripe customers.) | Stripe sends `customer.subscription.deleted`; dashboard shows "Ended"; Read now refuses. | Owner (logic: automated) |
| 15 | Resubscribe | After 14, Subscribe again with `4242...`. | A new subscription; access returns. | Owner (logic: automated) |
| 16 | Replayed webhook ignored | Stripe > Developers > Webhooks > your endpoint > pick a delivered event > **Resend**. | Delivery shows 200 with `"result":"duplicate"`. Nothing changes on the dashboard. | Automated (idempotency) + Owner (resend) |
| 17 | Forged webhook refused | (Done by the smoke test.) | 400 "Invalid signature". | Automated (smoke) |
| 18 | Referral reward | Person A: dashboard > copy referral link. Person B (new browser): open the link, register, subscribe with `4242...`. | Stripe > Person A's customer > "Credit balance" shows a credit of **one** month (A$11.99), described "Referral reward: 1 free month (your friend's payment 1 of 3)". A's dashboard: Friends subscribed 1, Free months earned 1. When B's second and third months are paid, one more month is added each time, then no more. | Owner (rules: automated) |
| 19 | Referral abuse refused | Signed in as Person A, open A's own link and subscribe. | No credit for referring yourself. A throwaway second account earns one month per month it pays, so it never earns more than it costs. | Automated (rules) |
| 20 | Expired module session | Open the book, wait past the module's session time (default 45 minutes; or ask the module agent for a short test setting), then click a link in the book. | The browser briefly returns to `/read/molecular-atlas` and comes straight back to the same page of the book, no sign-in needed. If the subscription ended in the meantime, you land on the subscribe page instead. | Not testable from code here (module side) |
| 21 | Account page | My account: change your name; check email, sign-in method and subscription; Manage billing opens Stripe. | All shown correctly. | Owner |
| 22 | Contact form | Support > send a message. | "Thanks, we've got your message". The message appears in Supabase > Table editor > `support_requests`. Sending 4 in a row is refused for a few minutes. | Owner (validation and limits: automated) |
| 23 | Deletion request | My account > Delete my account > tick > Request. | Confirmation shown; a row with kind `account_deletion` in `support_requests`. Then follow GO-LIVE "Handling a deletion request". | Owner |
| 24 | Refund | In Stripe, refund a test payment, then cancel the subscription **at end of period** (GO-LIVE step 2.7). | Dashboard shows "Cancelled · Access until <date>"; Read now still works until that date; no further charge. | Owner |
| 25 | Pages and links | Click every footer link; open a made-up address like `/abc`. | No 404s except the made-up one, which shows the branded "We couldn't find that page". | Automated (smoke) |
| 26 | Phone layout | Repeat 6, 8 and 21 on a phone. | Nothing cut off, no sideways scrolling. | Owner (360px and 768px layouts were checked by the agent for the new pages only) |

## Automated tests in this repository

| File | Covers |
|---|---|
| `tests/security.test.ts` | open-redirect guard, CSRF origin check, rate limiter (including spoofed addresses and memory bound), access rules, double-subscription guard, dashboard status wording |
| `tests/sync.test.ts` | webhook idempotency, out-of-order and stale events, past_due, cancel at period end, paused, unpaid, deleted, resubscribe, unattributable subscriptions, retries |
| `tests/referrals.test.ts` | codes, self/repeat/existing-customer refusal, 1 month per paid month up to 3, throwaway accounts never profit, cap, $0 invoices, failed payments, webhook retries, no double credit after Stripe's 24-hour window |
| `tests/module-token.test.ts` | launch token claims and lifetime against INTEGRATION.md, unique `jti`, wrong audience/issuer/key, tampering, `alg: none`, JWKS has no private part |
| `tests/support.test.ts` | contact form validation, honeypot, display names |
| `scripts/smoke.mjs` | 40 outside-in checks of a running site: pages, health check, private-route redirects and caching, 404, security headers, robots/sitemap, JWKS, CSRF refusals, forged webhooks, referral cookie, auth redirects |

Playwright browser tests were not added: every flow worth driving end to end needs real Supabase and Stripe test
accounts and email, which the agent does not have. The smoke script covers what can be checked without them.
