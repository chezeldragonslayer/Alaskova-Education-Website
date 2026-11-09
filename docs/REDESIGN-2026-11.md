# Website repositioning: audit and change log (November 2026)

Brief: "Alaskova Education — website repositioning & redesign" (owner, 9 November 2026). Owner decisions confirmed
the same day where the brief conflicted with earlier ones: **A$8.99/month including GST** (not $11.99),
**"Built by a pharmacy student, for pharmacy students."** (singular), **navy and gold** kept (no blush/lavender),
and **Instagram-only** updates for future modules (no "Notify me" email list). The "Master Vision & Action Plan"
mentioned in the brief was not attached; the brief itself was used.

## 1. Audit (before changes)

Live site checked at https://alaskovaeducation.com (code at commit `c87e531`).

| # | Page / element | Finding | Effect |
|---|---|---|---|
| A1 | Home hero | "All Your Textbooks. One Smarter Way to Study." and a catalogue search box suggest a large library; Alaskova has one product. Nothing says who it is for (pharmacy students) or why. | Instagram visitors can't tell in the first screen what they would buy. |
| A2 | Home | A "student dashboard" mock-up with invented titles (Introduction to Biology, Principles of Accounting…) and a fake reader preview. Labelled "demo", but they show products that don't exist. | Undermines credibility; conflicts with "only Molecular Atlas". |
| A3 | Home / Molecular Atlas | The book is described in one generic line. Nothing on the pharmacy angle (164 real medicines, medicinal chemistry, drug design, case studies), the interactive tools, or how it differs from ordinary organic chemistry teaching. | The product's strongest selling points are invisible. |
| A4 | Navigation | "Textbooks" (a catalogue of one), "How it works" (a separate generic page). No direct route to Molecular Atlas; the main button says "Get started" (account sign-up) rather than the product. | Extra steps between Instagram and checkout. |
| A5 | Book page `/catalogue/molecular-atlas` | Long address; a narrow three-column layout that cramps the details table on laptops; the price box is good. | Hard to share; weak sales page. |
| A6 | Pricing | Correct (A$8.99 incl. GST, cancel any time) but generic ("What's included" lists access only). | OK; light copy update. |
| A7 | About | Founder section (Chelsea, photo, bio) is strong. The rest still says "publishes digital textbooks"; no mission, no clearly labelled future vision. | Mission and long-term plans not communicated. |
| A8 | Future modules | Not shown anywhere. | The "what Alaskova is building" story is missing. |
| A9 | Sign-in from Instagram | Google blocks its sign-in inside Instagram's built-in browser; the sign-in page shows the Google button first. Book progress is saved per browser, so studying inside Instagram's browser keeps progress there. | Failed sign-ins and "lost" progress for Instagram visitors. |
| A10 | Measurement | No way to tell which subscribers came from Instagram. No analytics (owner's choice). | Can't judge whether Instagram works. |
| A11 | Domain | The site answers on alaskovaeducation.com but still names the onrender.com address as its official one (canonical, sitemap) until `NEXT_PUBLIC_SITE_URL` is changed in Render. | Owner step (OWNER-CHECKLIST section 3); no code change needed. |
| A12 | Preserved | Accounts, sign-in, Stripe checkout and portal, webhooks, refunds/disputes, `/read` launch, dashboard, account page, legal pages, support form. | Not touched except links and copy. |

Facts used in the copy come from the Molecular Atlas repository (read-only): 229 lessons in 10 modules, 702 practice
problems, 164 medicines as examples, 14 core rules; interactive tools (mechanism player, 3D molecule viewer, spectrum
interpreter, pKa ladder, conformation wheel, energy-diagram explorer, structure drawer, SAR explorer, reaction bench,
electron-density explorer); practice, spaced review, notebook, module checkpoints and a final exam; evidence marked as
"established" or "uncertain". The featured questions are covered in the book: celecoxib and COX-2 selectivity
(case study 10-01, with its uncertainties), sulfamethoxazole's N4-arylamine and the reactive nitroso metabolite
implicated in sulfonamide hypersensitivity (lesson 05-24, which says the mechanism is unsettled), structure and drug
behaviour (module 8).

## 2. Change log

### Changed or added
| Area | Change | Addresses |
|---|---|---|
| Homepage | Rewritten: hero "Built by a pharmacy student, for pharmacy students." with the brief's supporting headline and description; Molecular Atlas definition, 4 verified numbers and 6 highlights; 3 real questions from the book; "how it's different" and the 10 interactive tools; price card with the live subscribe button; "Why Alaskova exists" with 4 pillars; 3 coming-soon cards; founder quote; FAQ; final call to action. Demo dashboard, fake reader preview and catalogue search removed. | A1–A3 |
| Molecular Atlas page | New `/molecular-atlas` (also the Instagram landing page): title, price and subscribe button in the first screen on a 360px phone; facts; why pharmacy students care; questions; differences; tools; 10-module curriculum with lesson counts; how it works; pricing; FAQ. Subscribers see "Open Molecular Atlas" instead. | A3, A5 |
| Modules | New `/modules`: Molecular Atlas as the only "Available now" item; coming-soon catalogue (6 featured cards, 4 more in an expandable list), each with a "Coming soon" text label, no price, no buy button; Instagram follow and "suggest a topic". | A8 |
| Mission | `/about` rewritten as "Our mission": mission, 4 pillars, founder section (unchanged), "What we offer today", and "The future of Alaskova" labelled as plans, with "Alaskova Pharmaceuticals does not operate today". | A7 |
| Pricing | Uses the shared price card; billing FAQ updated (holidays: cancel and resubscribe; no free trial; future modules not on sale). | A6 |
| Navigation | Header: Molecular Atlas · Modules · Pricing · Our mission · Support; main button "Start learning" goes to Molecular Atlas. Footer regrouped (Learn, Alaskova, Account, Legal) with Instagram. Site title and link previews updated. | A4 |
| Old addresses | `/catalogue/molecular-atlas` → `/molecular-atlas`, `/catalogue` → `/modules`, `/how-it-works` → `/molecular-atlas` (permanent redirects). Checkout, sign-in and `/read` now return students to `/molecular-atlas`. | URLs preserved |
| Instagram browser | Inside Instagram's built-in browser, the sign-in page hides "Continue with Google" (Google blocks it there) and explains how to open the page in Safari/Chrome; the library shows a note to open the normal browser before reading, because progress is saved per browser. | A9 |
| Attribution | Links with `?utm_source=instagram` (or `?src=ig`) store only the source name in a first-party cookie for 30 days; checkout records `source` (`instagram` or `direct`) in the Stripe checkout and subscription metadata. Privacy policy updated. No third-party tracker. | A10 |

### Preserved (not changed)
Accounts and sign-in, password reset, Stripe checkout logic and double-subscription guard, billing portal, webhook
processing (refunds and disputes end access), `/read` launch tokens, dashboard, My account, support form, legal pages
(apart from one privacy-policy line), security headers, and everything inside Molecular Atlas (separate service, not
touched). Learner notes, scores and progress live inside Molecular Atlas and the learner's browser and were not affected.

### Measuring Instagram (privacy-conscious, nothing active until verified)
- **Landing-page visits:** not counted (no analytics, owner's choice). Render's logs show requests but not people.
- **Checkout started:** Stripe > Payments > Checkout sessions; open one and look at Metadata > `source`.
- **Completed subscriptions:** Stripe search `metadata['source']:'instagram'` on Subscriptions.
- Use the link `https://alaskovaeducation.com/molecular-atlas?utm_source=instagram` in the Instagram bio and story links.
- Not yet verified with a real checkout: do one sandbox subscription through that link and check the metadata.

### Outstanding
1. **Not tested end to end:** payment, registration and subscription flows (needs the owner's Stripe sandbox and a
   real sign-in; follow TEST-PLAN.md). Code paths for these were changed only for return addresses and metadata.
2. **Screenshots:** no genuine Molecular Atlas screenshots yet. The page has a ready slot (`atlasScreenshots` in
   `src/lib/molecular-atlas.ts`) that stays hidden until real images are added.
3. **Celecoxib question:** the brief's "Why is celecoxib selective for COX-2?" is **not** answered in the book (it covers
   celecoxib's metabolism, "sulfa allergy" labelling and the consequences of COX-2 selectivity, but not the binding-site
   reason). It was replaced with "Does a 'sulfa allergy' rule out celecoxib?", which the book does cover. To feature the
   original question, ask the Molecular Atlas agent to add that content first.
4. **Visual check:** layouts were measured at 360, 768 and 1280px (no sideways scrolling, navigation on one line,
   subscribe button in the first screen) but screenshots could not be taken in this session; the owner should review
   the pages on a phone.
5. **Domain settings** still pending in Render (`NEXT_PUBLIC_SITE_URL`), Supabase and Stripe (OWNER-CHECKLIST section 3).
6. **Not added on purpose:** blush/lavender palette, "Notify me" email list, $11.99 price, plural tagline (owner
   decisions, 9 Nov 2026), and any certificates, accreditation, partnerships or launch dates.
