# Alaskova Education: repositioning plan and website copy

**Brief:** reposition the site as a trusted destination for pharmacy students arriving mainly from Instagram.
Molecular Atlas is the first and only workbook on sale; four more modules are coming soon; the wider mission
(mentoring, industry access, critical thinking, student-led innovation) is a developing vision, not a live service.

This document is the plan and the copy. Nothing in it has been built yet. Text in `[SQUARE BRACKETS]` is a
placeholder for a fact only the owner can supply.

---

## 0. Decisions the owner needs to make first

| # | Decision | Why it matters | Recommendation |
|---|---|---|---|
| D1 | ~~Pharmacy wording~~ **Decided (7 Nov 2026):** Molecular Atlas may be called a **pharmaceutical textbook**. | The earlier "never pharmaceutical" rule is withdrawn. | Use "an interactive pharmaceutical organic chemistry textbook" or "organic chemistry, taught through medicines". Both are accurate (modules 8 to 10, 164 real medicines). |
| D2 | **How the founder appears on the site.** | The hero says "built by a pharmacy student"; a real person behind it is what makes that believable to a stranger arriving from Instagram. | Owner's choice of level (see the note below the table). Minimum: first name + "pharmacy student" + photo, matching Instagram. |
| D3 | **Instagram handle** for every "Follow for launch news" button. | Coming-soon pages need somewhere to send people. | `[@INSTAGRAM_HANDLE]` |
| D4 | **Waitlist or Instagram-only for coming-soon modules.** A "notify me" email list collects personal data (privacy policy, storage, a way to unsubscribe). | Affects what gets built. | Launch with "Follow us on Instagram for launch news" (no data collected). Add an email waitlist later if wanted. |
| D5 | **Certificate of completion.** The book has a final exam and a certificate page. | A certificate can be mistaken for an accredited qualification. | Mention it only after you have tested it, always as "a certificate of completion, not an accredited qualification or CPD". |
| D6 | **AI study tutor.** Built, but needs your Anthropic key and has not been tested through the website. | Must not be advertised until it works. | Mention only after test step 10 in `CONNECT-MOLECULAR-ATLAS.md` passes. |
| D7 | **Product screenshots or a short screen recording** of the real book. | Instagram visitors decide visually; we must not show invented screens. | Owner captures 3 to 5 screenshots from the real book after it is connected. |
| D8 | **Measuring Instagram sign-ups.** | You will want to know if Instagram works. | Option A: Stripe and Supabase numbers only (no tracking). Option B: a first-party "came from Instagram" flag stored with the account (one privacy-policy line, no third-party tracker). Avoid the Meta pixel for now. |

**Note on D2 (founder on the site).** Not needed for legal or clinical reasons: the site gives no clinical advice.
It is a trust signal. Options, from least to most personal: (a) no name, "Founded by a pharmacy student" plus a link
to the Instagram account where you are the face; (b) first name, photo and "pharmacy student"; (c) full name, degree
and year. (b) is recommended. Separately, if you trade as a sole trader, your legal name appears in the terms and on
the public ABN register anyway; a company (Pty Ltd) avoids that. Owner-confirmed headline: "Built by a pharmacy student, for pharmacy
students." Change to the plural only when others join.

---

## 1. Positioning and voice

**One line:** Alaskova Education makes study resources built by a pharmacy student, for pharmacy students, connecting what
you learn at university to how medicines are discovered, made and used.

**Message pillars**
1. **Consolidate**: strengthen the science you are already studying (Molecular Atlas: organic chemistry).
2. **Apply**: see the chemistry inside real medicines.
3. **Explore** (coming soon): the industry roles, standards and skills behind medicines.
4. **Grow** (developing vision): mentoring, careers, interviews, entrepreneurship and student-led innovation.

**Voice:** approachable, intelligent, precise. Write like a senior student explaining something to a friend, with
the accuracy of a lecturer. Australian spelling. Short sentences. No hype.

**Claims rules**

| Say | Don't say |
|---|---|
| "Built by a pharmacy student, for pharmacy students." (owner-confirmed wording; plural only once others join) | "The best pharmacy resource", "number one", "trusted by thousands" |
| "Designed to help you consolidate…" | "Guarantees you'll pass" or "get you a job" |
| "Topics that can be hard to find in one place" | "Things pharmacy schools never teach you" |
| "Covers organic and medicinal chemistry found in many pharmacy degrees" | "Matches your university's course" or "accredited" |
| "In development" / "Coming soon" | Prices, release dates or "Buy" on unreleased modules |
| "We're working towards mentoring, a podcast and workshops" | "Join our mentoring program" (until it exists) |

**Naming:** call Molecular Atlas an **interactive workbook** (it is lessons plus 700+ practice problems), and keep
"textbook" as a secondary word for search. Call future products **modules**.

---

## 2. Verified fact sheet (use only these numbers)

Sources: the Molecular Atlas repository (`CURRICULUM.md`, its search index and routes), read on 6 November 2026.

| Fact | Status | Copy |
|---|---|---|
| 229 lessons in 10 modules | Verified in curriculum | "229 lessons across 10 modules" |
| 702 practice problems | Verified in search index | "more than 700 practice problems" |
| 164 real medicines used as examples (e.g. ibuprofen, imatinib, oseltamivir, atorvastatin) | Verified in search index | "more than 160 real medicines as worked examples" |
| 14 "universal rules" that explain reactivity | Verified in curriculum | "14 core rules that explain why reactions happen" |
| Modules: Foundations, The Universal Rules, Organic Foundations, Mechanisms, Functional Groups, Structure Determination, Synthesis, Medicinal Chemistry, Drug Design, Case Studies | Verified | as listed |
| Table of contents, lesson navigation, practice, spaced review, notebook, search, glossary, knowledge map ("Atlas"), light and dark themes | Built; covered by the book's own automated tests (reported by its agent, not re-run here) | Use after you have clicked through each once |
| Progress saves automatically **in the browser you use** (not across devices) | Built (INTEGRATION.md) | "Saves your progress in your browser" + "use the same device" |
| AI study tutor | Built, **not yet tested end to end** (D6) | Hold until tested |
| Final exam and certificate of completion | Built, **not yet tested** (D5) | Hold until tested |
| Interactive mechanisms and spectra | Built per the book's README | Use after you have tried one |
| A$8.99 per month, one subscription = one workbook, cancel any time in the billing portal | Live on the site | "A$8.99/month · cancel any time" |
| Study time | The curriculum's internal plan budgets 400 hours | **Don't publish**: it is a planning estimate |

---

## 3. Site architecture

| Page | Address | Purpose | Main call to action | Change |
|---|---|---|---|---|
| Home | `/` | Who we are + Molecular Atlas + what's coming | Explore Molecular Atlas | **Rewrite** |
| Start (Instagram link in bio) | `/start` | Fast, mobile-only route from Instagram to the workbook | Start Molecular Atlas | **New** |
| Molecular Atlas | `/molecular-atlas` | The sales page for the only product | Start learning, A$8.99/month | **New** (replaces `/catalogue/molecular-atlas`, which redirects here) |
| Modules | `/modules` | One available card + coming-soon cards | Per card | **Replaces** `/catalogue` (redirects) |
| Coming soon | `/modules/coming-soon` | All in-development modules, honest status | Follow on Instagram | **New** |
| Pricing | `/pricing` | One plan, what's included, billing FAQs | Start Molecular Atlas | **Edit copy** |
| About & mission | `/about` | Founders, why, the vision (clearly labelled) | Explore Molecular Atlas | **Rewrite** |
| How it works | `/how-it-works` | Merge into the Molecular Atlas page and home | – | **Remove** (redirect to `/molecular-atlas#how-it-works`) |
| Support, legal, sign-in, dashboard, account | unchanged | – | – | Small copy edits only |

**Navigation (header):** Molecular Atlas · Modules · Pricing · About · Support | Sign in · **Start learning**
(the button goes to `/molecular-atlas`). On phones the menu shows the same, with **Start learning** at the top.

**Footer groups:** Learn (Molecular Atlas, Coming soon, Pricing) · Alaskova (About & mission, Support, Instagram) ·
Account · Legal.

---

## 4. Homepage copy

**Hero**
- Eyebrow: `ALASKOVA EDUCATION`
- Headline: **Built by a pharmacy student, for pharmacy students.**
- Subheading: We create study resources that connect what you learn in lectures to how medicines are discovered,
  made and used. Our first workbook, Molecular Atlas, teaches organic chemistry through real medicines.
- Primary button: **Explore Molecular Atlas** → `/molecular-atlas`
- Secondary link: See what's coming → `/modules/coming-soon`
- Under the buttons: A$8.99/month · Cancel any time · Secure checkout by Stripe
- Visual: the stacked lion logo or (once D7 is done) a real screenshot of a lesson, labelled "Molecular Atlas".

**Section: Now available**
- Eyebrow: `NOW AVAILABLE`
- Heading: **Molecular Atlas**
- Line: An interactive organic chemistry workbook with a pharmacy context.
- Four facts (icon + number):
  - **229 lessons** across 10 modules, from foundations to drug design
  - **700+ practice problems** to test yourself as you go
  - **160+ real medicines** used as worked examples
  - **14 core rules** that explain why reactions happen
- Button: **See what's inside** → `/molecular-atlas`

**Section: How it works** (three steps)
1. **Create your free account.** Sign up with your email, Google or Microsoft account.
2. **Subscribe to Molecular Atlas.** A$8.99 a month through Stripe. Cancel any time from your account.
3. **Start learning.** Open it from your library. Your progress saves as you go in the browser you study in.

**Section: Why Alaskova**
- Heading: **From lecture theatre to laboratory.**
- Body: Your degree gives you the foundations. We want to show where they lead: how the chemistry you study becomes
  a medicine, how medicines are made to strict standards, and the many careers that make it happen. Everything we
  make is written by a pharmacy student and checked against the literature.
  *(Only keep "checked against the literature" if true: the book's repository has a citation audit, so it is.)*

**Section: Coming soon**
- Heading: **More modules in development**
- Line: We're building modules on the parts of pharmacy that happen beyond the dispensary. They're not available yet.
- Four cards (section 6), each with an **In development** badge and no price.
- Button: **Follow us on Instagram for launch news** → `[@INSTAGRAM_HANDLE]`

**Section: FAQ** (five)
1. *Who is Molecular Atlas for?* Pharmacy students studying organic or medicinal chemistry, and anyone who wants to
   understand the chemistry behind medicines. It isn't affiliated with any university, so check your unit outline for
   what you need to know.
2. *What does it cost?* A$8.99 a month for full access to Molecular Atlas. Cancel any time; you keep access until the
   end of the month you've paid for.
3. *Does my progress save?* Yes, automatically, in the browser you study in. Use the same device and browser to pick
   up where you left off.
4. *Can I use it on my phone?* Yes. It works in your web browser on phones, tablets and computers.
5. *When are the other modules coming?* They're in development. Follow us on Instagram to hear first.

**Final call to action**
- Heading: **Start with Molecular Atlas.**
- Line: Organic chemistry, taught through the medicines you'll meet in practice.
- Button: **Start learning, A$8.99/month** → `/molecular-atlas`

---

## 5. Molecular Atlas page copy (`/molecular-atlas`)

**Hero**
- Eyebrow: `WORKBOOK 01 · AVAILABLE NOW`
- Title: **Molecular Atlas**
- Subtitle: **Organic chemistry, taught through medicines.**
- Body: An interactive workbook that takes you from the foundations of organic chemistry to how medicines are
  designed, using 160+ real drugs as examples along the way.
- Price box: **A$8.99/month** · Cancel any time · Secure checkout by Stripe
- Button: **Start learning** (signed out: create account, then checkout; subscribed: **Open Molecular Atlas**)

**Who it's for**
- Pharmacy students taking organic or medicinal chemistry units
- Students who learn better from worked examples and practice than from slides
- Anyone curious about how a molecule becomes a medicine
- Small print: Not affiliated with or endorsed by any university. Check your own unit outline.

**What you'll learn** (accordion, one line each; lesson counts verified)
1. **Foundations** (18 lessons): atoms, bonding and the language of organic chemistry
2. **The Universal Rules** (22): the 14 rules that explain reactivity
3. **Organic Foundations** (18): structure, shape and naming
4. **Mechanisms** (28): how and why reactions happen, step by step
5. **Functional Groups** (31): the groups that define how molecules behave
6. **Structure Determination** (21): reading spectra to identify molecules
7. **Synthesis** (18): planning how to make a molecule
8. **Medicinal Chemistry** (32): how drugs interact with the body
9. **Drug Design** (26): how medicines are discovered and improved
10. **Case Studies** (15): the chemistry behind real medicines
*(Agent to check each one-line summary against `CURRICULUM.md` before publishing.)*

**How it works** (the reading experience, verified features only, see section 2)
- **Learn in order, or jump in:** a table of contents and lesson-by-lesson navigation
- **Practise as you go:** more than 700 practice problems
- **Review what you've learnt:** spaced review brings back what you're likely to forget
- **Make it yours:** a personal notebook, search and a glossary
- **See the connections:** the Atlas map shows how topics link together
- **Study your way:** light and dark themes, on any device with a modern browser
- **Your progress saves automatically** in the browser you use
- *(After testing, add)* **Stuck? Ask the AI study tutor.** Answers are generated automatically and can be wrong, so
  check them against the lesson.
- *(After testing, add)* **Finish with a final exam** and earn a certificate of completion (not an accredited
  qualification).

**Pricing**
- **A$8.99 per month** · Full access to Molecular Atlas · Cancel any time from your account · You keep access until
  the end of the month you've paid for · Payments by Stripe; we never see your card number

**FAQ:** the five from the homepage, plus: *Can I cancel?* · *What happens to my notes if I cancel?* (They stay in
your browser, but you won't be able to open the workbook until you subscribe again.) · *Is there a free trial?*
(Not at the moment. You can cancel any time.)

**Final call to action:** **Start learning, A$8.99/month**

---

## 6. Course card copy

| Card | Badge | Title | Description | Button |
|---|---|---|---|---|
| Available | **Available now** (gold) | Molecular Atlas | Organic chemistry, taught through medicines. 229 lessons, 700+ practice problems. | **Start learning, A$8.99/mo** |
| Soon | **In development** (grey) | Pharmaceutical Industry Careers | The roles behind medicines, from manufacturing and quality to regulatory affairs and R&D, and the paths into them. | Follow for updates |
| Soon | **In development** | Good Manufacturing Practice (GMP) | How medicines are made safely and consistently: the principles, the quality systems and why they exist. | Follow for updates |
| Soon | **In development** | Pharmaceutical Compounding | The science of preparing medicines: formulation, calculations, stability and quality. | Follow for updates |
| Soon | **In development** | Research & Development Chemist | What medicinal and process chemists do, the skills they use, and how a molecule becomes a medicine. | Follow for updates |
| Open | **Ideas welcome** | More modules to come | Is there a topic you'd like us to cover? Tell us. | Suggest a topic → contact form |

Design rules for coming-soon cards: muted (no gold "buy" styling), no price, no "Subscribe", no release dates, and
the badge is text (not colour alone) so it is clear to screen readers.

---

## 7. Coming-soon page copy (`/modules/coming-soon`)

- Eyebrow: `IN DEVELOPMENT`
- Heading: **What we're building next**
- Intro: Molecular Atlas is our first workbook. These modules are in development and **not available yet**. We'll
  announce each one on Instagram when it's ready, and existing subscribers will hear first.
- The four cards from section 6, each with a short "What it will cover" list written as plans ("will cover", not
  "covers").
  - *Example for GMP:* What it will cover: why GMP exists; quality systems and documentation; how manufacturing is
    inspected; what it means for your career.
- Box: **Have an idea?** Alaskova is student-led, and we'd like to hear what you want to learn. → Suggest a topic
- Button: **Follow `[@INSTAGRAM_HANDLE]` for launch news**
- Small print: Topics, scope and timing may change as modules are developed.

---

## 8. About and mission copy (`/about`)

**Hero**
- Eyebrow: `ABOUT ALASKOVA EDUCATION`
- Heading: **Built by a pharmacy student, for pharmacy students.**
- Intro: Alaskova Education started with a simple idea: the best way to understand pharmacy is to see the science in
  action. We make resources that help students consolidate what they learn and see where it leads.

**Our story** *(owner to write, 80 to 120 words)*: `[FOUNDER NAME(S)]`, `[YEAR AND DEGREE]`. Why you started, what you
wished you'd had as a first-year student, and why chemistry came first.

**Our mission**
We want every pharmacy student to understand not just *what* to learn, but *why it matters*: how medicines are
discovered, made, checked and used, and the many careers that make that happen. We value:
- **Critical thinking:** understanding over memorising.
- **Scientific credibility:** accurate, referenced, and honest about what we don't cover.
- **Industry access:** showing students the roles beyond the dispensary.
- **Student-led innovation:** created by a student, shaped by student feedback.

**What we offer today**
- **Molecular Atlas**, an interactive organic chemistry workbook. → Explore

**What we're working towards** *(label clearly)*
These are plans, not services we offer yet:
- **Mentoring:** connecting students with pharmacists and industry professionals
- **A podcast:** conversations with people across pharmacy and the pharmaceutical industry
- **Workshops:** practical sessions on careers, interviews and innovation
- **More modules:** careers, GMP, compounding and R&D (see what's coming)

Follow `[@INSTAGRAM_HANDLE]` to hear as each one takes shape.

---

## 9. Call-to-action library

| Where | Primary | Secondary |
|---|---|---|
| Header | Start learning | Sign in |
| Home hero | Explore Molecular Atlas | See what's coming |
| Molecular Atlas (signed out / not subscribed) | Start learning, A$8.99/month | See what's inside |
| Molecular Atlas (subscribed) | Open Molecular Atlas | My library |
| Coming soon | Follow `[@INSTAGRAM_HANDLE]` for launch news | Suggest a topic |
| About | Explore Molecular Atlas | Follow us on Instagram |
| `/start` | Start Molecular Atlas | What's inside? |
| Dashboard (no subscription) | Start Molecular Atlas | – |
| Dashboard (subscribed) | Read now | My account |

Rule: one primary button per screen, always showing the price or "cancel any time" next to it.

---

## 10. Instagram → subscription flow

```
Instagram post / story / reel
   │  "Link in bio" (or story link sticker) → /start?src=instagram
   ▼
/start  (mobile, one screen): headline, 3 facts, price, [Start Molecular Atlas]  + "Open in your browser" tip
   ▼
/molecular-atlas  (optional detour for "What's inside?")
   ▼
Create account  (email form first; Microsoft button; Google button hidden inside Instagram, see below)
   ▼  email sign-up only: confirm email (link opens back on the book page, Subscribe ready)
Stripe Checkout (A$8.99/month; card, plus Apple Pay / Google Pay outside Instagram's browser)
   ▼
Dashboard: "You're subscribed" → [Read now] → Molecular Atlas welcome and plan setup
```

**Target:** no more than 3 taps from the bio link to the payment page for someone already signed in, 5 for a new
student.

**Instagram's built-in browser: three real problems to design for**
1. **Google blocks its sign-in inside in-app browsers** like Instagram's. "Continue with Google" would show an error.
   Fix: detect Instagram's browser and show email sign-up first, with a one-line tip: "Using Instagram? Tap ⋯ and
   Open in browser to sign in with Google." Microsoft sign-in may be limited there too; test it before relying on it.
2. **Progress lives in the browser.** If a student studies inside Instagram's browser, their progress stays there and
   won't appear when they later open Safari or Chrome. Fix: before Read now, Instagram visitors see "For the best
   experience and to keep your progress, open this page in your browser."
3. **Apple Pay and Google Pay** usually don't appear inside in-app browsers. Card payment still works; nothing to fix,
   but don't promise wallets on `/start`.

**Friction to remove before the first campaign**
- Render free plan sleeps: an Instagram visitor could wait 30 to 60 seconds. Move both services to paid always-on
  plans first.
- Email confirmation adds a step: keep it on (security), but make sure the confirmation link returns the student to
  the Molecular Atlas page with **Subscribe** ready (custom Supabase email templates, GO-LIVE step 4.4).
- The homepage search bar and "All your textbooks" message suggest a big catalogue; replace with the focused hero.

**Instagram content ideas that match the site (no new claims)**
- "One medicine, one rule": a carousel using a drug from the book (e.g. aspirin) to explain one of the 14 rules, ending
  "Learn all 14 in Molecular Atlas: link in bio".
- A 20-second screen recording of a real lesson and practice problem (D7).
- Coming-soon teasers that say "in development" and ask "What should we cover next?"

---

## 11. UX priorities (ranked)

1. **Always-on hosting** before any Instagram push (cold starts lose visitors).
2. **Instagram browser handling** (section 10): sign-in options, the open-in-browser tip, progress warning.
3. **One clear path:** every page leads to Molecular Atlas; nothing unreleased looks buyable.
4. **Mobile first:** design `/start`, home and `/molecular-atlas` at 360px before desktop; tap targets at least 44px.
5. **Show the real product** (D7): real screenshots beat any illustration. Remove the "demo dashboard" mock-up from the
   homepage once real screenshots exist.
6. **Price and cancellation next to every button.**
7. **Credibility:** real founder names and photo, support email, legal entity and ABN in the footer, finished legal
   pages.
8. **Speed:** keep pages light (the book's agent is already tracking load times).
9. **Accessibility:** keep WCAG 2.2 AA (contrast is already checked for the navy and gold palette).
10. **Measurement:** decide D8 before launch so you can tell whether Instagram works.

---

## 12. Build checklist

**[Owner]** = only you can do it. **[Agent]** = the website agent builds it. **[Book agent]** = the Molecular Atlas
agent.

**Phase 1: before the first Instagram campaign**
- [ ] [Owner] Decide D1 to D8 (section 0).
- [ ] [Owner] Supply: founder name(s), degree and year, short story, photo, Instagram handle.
- [ ] [Owner] Move both Render services to paid always-on plans (owner confirmed: before launch).
- [ ] [Owner] Connect and test the book (`CONNECT-MOLECULAR-ATLAS.md` parts A to C); note which features worked.
- [ ] [Owner] Capture 3 to 5 real screenshots of the book (D7).
- [ ] [Agent] New header and footer navigation (section 3).
- [ ] [Agent] Rewrite the homepage (section 4); remove the catalogue search and the demo dashboard mock-up.
- [ ] [Agent] Build `/molecular-atlas` (section 5); redirect `/catalogue/molecular-atlas` and `/how-it-works`.
- [ ] [Agent] Build `/modules` and `/modules/coming-soon` (sections 6 and 7); redirect `/catalogue`.
- [ ] [Agent] Rewrite `/about` (section 8) with the owner's details.
- [ ] [Agent] Build `/start` (section 10).
- [ ] [Agent] Instagram in-app browser handling: sign-in options, open-in-browser tips.
- [ ] [Agent] After email confirmation, return new students to `/molecular-atlas` with Subscribe ready.
- [ ] [Agent] Update pricing and FAQ copy; keep the AI tutor and certificate lines out until D5 and D6 are tested.
- [ ] [Agent] Update terms and privacy wording ("textbooks" → "textbooks and workbooks"; D8 line if chosen).
- [ ] [Agent] Update `sitemap.xml`, page titles, descriptions and link previews for each new page.
- [ ] [Agent] Run all checks (lint, typecheck, tests, build, smoke test), check every page at 360px and 768px.
- [ ] [Owner] Read every page on your phone, inside Instagram's browser and in Safari or Chrome.

**Phase 2: after launch**
- [ ] [Agent] Add the AI tutor and certificate lines once tested.
- [ ] [Agent] Optional email waitlist for coming-soon modules (D4), with privacy policy update.
- [ ] [Agent] Optional first-party Instagram source flag (D8).
- [ ] [Book agent] Apply the new navy and gold branding to Molecular Atlas (`FOR-MODULE-AGENT.md` item 10).
- [ ] [Owner] Instagram content plan (section 10 ideas).

**Phase 3: as the vision develops**
- [ ] Each new module: its own page from the Molecular Atlas template, moved from "In development" to "Available"
      only when it can be bought and opened.
- [ ] Mentoring, podcast and workshops: a page each when they actually launch; until then they stay under
      "What we're working towards".
