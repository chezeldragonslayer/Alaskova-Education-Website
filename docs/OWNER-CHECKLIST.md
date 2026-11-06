# Alaskova Education launch tracker

Updated 7 November 2026. Paste into Notion: each `- [ ]` line becomes a checkbox. Never paste a secret key into a
chat, email or document; only into Render's Environment screen. Detailed steps: `GO-LIVE.md`,
`CONNECT-MOLECULAR-ATLAS.md` and `REPOSITIONING-PLAN.md`.

## 1. Decisions
- [ ] Bio wording: approve the website version of your bio (or keep your original)
- [ ] Headline now that you're an intern pharmacist: keep "Built by a pharmacy student, for pharmacy students" (you built it as a student) or switch to "Built by a pharmacy graduate…"
- [ ] Instagram handle for every "Follow us" button
- [ ] Coming-soon modules: Instagram "follow for news" only (recommended) or also an email waitlist
- [ ] Measuring Instagram sign-ups: private "came from Instagram" note on each account (recommended) or nothing
- [ ] Analytics: none at launch (recommended) or a privacy-friendly tool such as Plausible
- [ ] GST: registered or not (ask your accountant); sets one line in the terms
- [ ] Sole trader or company (Pty Ltd) (ask your accountant); as a sole trader your full name appears in the terms and on the ABN register
- [ ] Change-of-mind refunds: none for part-months (recommended) or e.g. a full refund within 7 days of the first payment
- [ ] Bank disputes (chargebacks): end access straight away (recommended) or at the end of the paid month
- [ ] Minimum age: 18+, or younger with a parent's permission (recommended)
- [ ] Support reply time you promise: 2 business days (recommended)
- [ ] Notice before a price change: 30 days (recommended)

## 2. Details to send the website agent
- [ ] Business details: legal name, ABN, address for notices, support email, state whose law applies
- [x] About page: first name (Chelsea), role (Intern Pharmacist), photo, bio (received 7 Nov)
- [ ] Final book description for Molecular Atlas
- [ ] 3 to 5 screenshots of the real book (after it's connected)

## 3. Accounts and services
- [ ] Domain: buy it; plan alaskovaeducation.com for the site and atlas.alaskovaeducation.com for the book
- [ ] Support email address on the domain; check mail arrives
- [ ] Resend: verify the domain, get SMTP details (sign-up and password-reset emails)
- [ ] Supabase email settings: custom SMTP (Resend) on, Confirm email on, two email templates changed (GO-LIVE 4)
- [ ] Anthropic API key in a "Molecular Atlas" workspace with a monthly spending limit
- [ ] Supabase Pro (backups; no pausing)
- [ ] Render: both services on a paid always-on plan (Starter), 1 instance each, before launch

## 4. Connect the book (Render)
- [ ] Book service > Environment: delete ALASKOVA_PUBLIC_KEY
- [ ] Book service: the four ALASKOVA_ addresses use alaskova-education-website.onrender.com (with "-website")
- [ ] Book service: ANTHROPIC_API_KEY set; deploy shows Live with no red ConfigError
- [ ] Website service: MODULE_URL_MOLECULAR_ATLAS = https://molecular-atlas.onrender.com
- [ ] Tell the website agent "book connected" (it checks the link from outside)
- [ ] Molecular Atlas agent: allow 90-minute reading sessions, then set SESSION_MINUTES=90
- [ ] Give the Molecular Atlas agent docs/FOR-MODULE-AGENT.md (new brand, pharmaceutical wording now allowed)

## 5. Test everything (Stripe sandbox)
- [ ] Subscribe with 4242 4242 4242 4242; the book appears in My library
- [ ] Stripe webhook deliveries show 200 OK
- [ ] Subscribe again is refused (no double charge)
- [ ] Read now opens the book (no "token=" in the address); Back to my library works
- [ ] AI tutor answers a question
- [ ] Final exam and certificate work (only then can the website mention them)
- [ ] Non-subscribers and signed-out visitors are refused
- [ ] Cancel in Manage billing: "Access until <date>"
- [ ] Full refund in Stripe: dashboard shows "Ended" within seconds
- [ ] Resubscribe works
- [ ] Sign-up email arrives; password reset works
- [ ] Google and Microsoft sign-in work (in Safari/Chrome; Google won't work inside Instagram's browser)
- [ ] Referral: a friend's first payment gives 1 free month of credit
- [ ] Contact form message appears in Supabase > support_requests
- [ ] Everything works on your phone, in Safari/Chrome and inside Instagram's browser

## 6. Website agent builds (repositioning, REPOSITIONING-PLAN.md section 12)
- [ ] New homepage ("Built by a pharmacy student, for pharmacy students")
- [ ] Molecular Atlas page (/molecular-atlas), with pricing and what you'll learn
- [ ] Modules page and coming-soon page (no prices, "In development")
- [ ] About & mission page with your photo and bio
- [ ] /start page for your Instagram bio link, with Instagram-browser tips
- [ ] New navigation, redirects, page titles and link previews
- [ ] You review every page on your phone

## 7. Legal
- [ ] Business details in (section 2), then a lawyer reviews terms, privacy and refunds
- [ ] Website agent removes the "Draft" banners and sets the date

## 8. Launch day (in this order: CONNECT-MOLECULAR-ATLAS.md part D)
- [ ] Domain on both Render services; "Certificate issued" on both
- [ ] Website settings: new domain; new signing key with kid alaskova-module-2
- [ ] Book settings: four ALASKOVA_ addresses on the new domain
- [ ] Supabase: Site URL and redirect URL; Google and Microsoft sign-in on the new domain
- [ ] Stripe live mode: A$8.99 monthly product, live keys and price in Render, live webhook (9 events incl. charge.refunded), customer portal
- [ ] Clear sandbox records in Supabase (before any real customer)
- [ ] Website agent runs the final check against the domain

## 9. After launch
- [ ] Buy, read, cancel and refund with your own card
- [ ] Uptime monitoring on both /healthz addresses
- [ ] Check Supabase > support_requests every business day
- [ ] Process account-deletion requests (GO-LIVE step 9)
- [ ] Instagram content plan (REPOSITIONING-PLAN.md section 10)
