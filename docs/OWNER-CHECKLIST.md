# Alaskova Education launch tracker

Updated 7 November 2026. Paste into Notion: each `- [ ]` line becomes a checkbox. Never paste a secret key into a
chat, email or document; only into Render's Environment screen. Details: `GO-LIVE.md`, `CONNECT-MOLECULAR-ATLAS.md`,
`REPOSITIONING-PLAN.md`.

## 1. Do first (the site now shows A$8.99, but Stripe still charges the old price)
- [ ] Stripe sandbox > Product catalogue > Molecular Atlas > add price A$8.99 AUD, monthly, "Include tax in price" on
- [ ] Render > website service > Environment: STRIPE_PRICE_MOLECULAR_ATLAS = the new price_... id; archive the old A$11.99 price in Stripe
- [ ] Stripe sandbox > Tax rates > new: "GST", 10%, Australia, Inclusive; put its txr_... id into Render as STRIPE_TAX_RATE_GST
- [ ] Stripe > Settings > Business > Tax details: add the ABN (invoices become valid tax invoices)
- [ ] Stripe sandbox > Workbench > Webhooks > your endpoint: add the events charge.dispute.created and charge.dispute.closed
- [ ] Stripe (sandbox and live) > Settings > Business > Public details > Terms of service URL: https://alaskovaeducation.com/legal/terms (checkout fails without it)
- [ ] Supabase > SQL editor: run supabase/migrations/0005_terms_acceptance.sql (records when people accepted the terms)

## 2. Details still needed
- [ ] ABN (Alaskova Pty Ltd)
- [ ] Address for legal notices (registered office or PO box)
- [ ] State or territory whose law applies to the terms
- [ ] Supabase project region and Render region (Supabase > Project Settings; Render > service > Settings), for the privacy policy
- [x] Company name, GST, price, support email, reply time, bio, photo, Instagram, book description (done 7 Nov)

## 3. Domain: alaskovaeducation.com (GO-LIVE.md step 1)
- [ ] Render > website service > Custom Domains: add alaskovaeducation.com and www.alaskovaeducation.com
- [ ] Render > book service > Custom Domains: add molecularatlas.alaskovaeducation.com
- [ ] Wix > Domains > Manage DNS records: A record @ and CNAMEs www and atlas to the values Render shows (disconnect from any Wix site first; keep the Zoho MX and TXT records)
- [ ] Wait until Render shows Verified + Certificate issued on all three
- [ ] Then: Render website settings: NEXT_PUBLIC_SITE_URL=https://alaskovaeducation.com, MODULE_URL_MOLECULAR_ATLAS=https://molecularatlas.alaskovaeducation.com
- [ ] Then: Render book settings: the four ALASKOVA_ addresses on https://alaskovaeducation.com
- [ ] Then: Supabase > Authentication > URL Configuration: Site URL https://alaskovaeducation.com, redirect URL https://alaskovaeducation.com/**
- [ ] Then: Stripe webhook endpoint address: https://alaskovaeducation.com/api/stripe/webhook
- [ ] Then: Google Cloud and Microsoft Entra sign-in settings: add the new domain
- [ ] Tell the website agent "domain live": it checks the whole site on the new address

## 4. Accounts and services
- [ ] Resend: verify alaskovaeducation.com (add its DNS records in Wix; keep a single SPF record on the root, Zoho stays)
- [ ] Supabase email: custom SMTP (Resend) on, Confirm email on, two email templates changed (GO-LIVE step 4)
- [ ] Supabase Pro
- [ ] Render: both services on paid Starter plans, 1 instance each, before launch

## 5. Connect the book
- [ ] Book service: delete ALASKOVA_PUBLIC_KEY; four ALASKOVA_ addresses correct; deploy Live
- [ ] Website service: MODULE_URL_MOLECULAR_ATLAS set (the onrender.com address until the domain is live)
- [ ] Tell the website agent "book connected"
- [ ] Molecular Atlas agent: allow 90-minute sessions, then SESSION_MINUTES=90
- [ ] Give the Molecular Atlas agent docs/FOR-MODULE-AGENT.md (new brand, pharmaceutical wording allowed)

## 6. Test everything (Stripe sandbox)
- [ ] Subscribe with 4242 4242 4242 4242: checkout shows A$8.99 including GST; the book appears in My library
- [ ] Webhook deliveries show 200 OK; subscribing twice is refused
- [ ] Read now opens the book; Back to my library works
- [ ] Final exam and certificate work (only then can the website mention them)
- [ ] Non-subscribers and signed-out visitors are refused
- [ ] Cancel: "Access until <date>"; full refund: "Ended"; resubscribe works
- [ ] Dispute a test payment (Stripe test card 4000 0000 0000 0259): access ends
- [ ] Sign-up email arrives; password reset works; Google and Microsoft sign-in work in Safari/Chrome
- [ ] Contact form message appears in Supabase > support_requests
- [ ] Everything works on your phone, in Safari/Chrome and inside Instagram's browser
- [ ] Capture 3 to 5 screenshots of the real book for the website

## 7. Website agent builds (REPOSITIONING-PLAN.md)
- [ ] New homepage ("Built by a pharmacy student, for pharmacy students")
- [ ] Molecular Atlas page, modules page, coming-soon page ("Follow @alaskova for release updates")
- [ ] Full About & mission page (founder section already live)
- [ ] /start page for the Instagram bio link, with Instagram-browser tips
- [ ] Private "came from Instagram" note on new accounts (plus one privacy-policy line); no analytics
- [ ] You review every page on your phone

## 8. Legal
- [ ] ABN, address and state in (section 2), then a lawyer reviews terms, privacy and refunds
- [ ] Website agent removes the "Draft" banners and sets the date

## 9. Launch day
- [ ] New signing key with kid alaskova-module-2 (GO-LIVE step 3)
- [ ] Stripe live mode: A$8.99 incl. GST product, GST tax rate, live keys and price in Render, live webhook (11 events, including charge.refunded and charge.dispute.closed), customer portal
- [ ] Clear sandbox records in Supabase (before any real customer)
- [ ] Website agent runs the final check against alaskovaeducation.com

## 10. After launch
- [ ] Buy, read, cancel and refund with your own card
- [ ] Uptime monitoring on https://alaskovaeducation.com/healthz and https://molecularatlas.alaskovaeducation.com/healthz
- [ ] Check Supabase > support_requests every business day; reply within 2 business days
- [ ] Process account-deletion requests (GO-LIVE step 9)
