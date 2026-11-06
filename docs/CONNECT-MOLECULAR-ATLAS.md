# When Molecular Atlas is finished: connect it, test it, launch

Do the parts in order. Parts A to C use the current test addresses (`onrender.com`) and the Stripe **sandbox**, so no
real money moves. Part D is launch day. Paste secrets only into Render's Environment screen, never into a chat.

Website address used below: `https://alaskova-education-website.onrender.com` (call it **SITE**).
Book address: whatever Render gives the book's service, e.g. `https://molecular-atlas.onrender.com` (call it **BOOK**).

## Part A. Put the book online (Render)

1. Ask the Molecular Atlas agent to confirm it is finished: its tests pass, `render.yaml` is up to date, and it has
   read `docs/FOR-MODULE-AGENT.md` from this repository (paste that file's block to it if you haven't).
2. Render > **New > Blueprint** > choose the Molecular-Atlas GitHub repository. Render reads `render.yaml` and creates
   the service. Check: plan **Starter** (or higher, not Free), **1 instance**, health check path **`/healthz`**.
3. When Render asks for the settings marked "sync: false", enter:

   | Setting | Value |
   |---|---|
   | `ALASKOVA_JWKS_URL` | `SITE/.well-known/jwks.json` |
   | `ALASKOVA_PUBLIC_KEY` | leave **empty** |
   | `ALASKOVA_RETURN_URL` | `SITE/read/molecular-atlas` |
   | `ALASKOVA_ORIGIN` | `SITE` |
   | `ALASKOVA_LIBRARY_URL` | `SITE/dashboard` |
   | `ANTHROPIC_API_KEY` | your Anthropic API key (set a monthly spending limit in the Anthropic console first) |
   | `TUTOR_MODEL` | leave empty (the book picks its default) |
   | `ALASKOVA_PROGRESS_URL`, `MODULE_SIGNING_KEY` | leave **both empty** (progress stays in the learner's browser) |

   `NODE_ENV`, `ALASKOVA_ISSUER`, `MODULE_AUDIENCE`, `SESSION_SECRET` and `SESSION_MINUTES` are filled in by the
   blueprint. Do **not** add any setting that starts with `ALASKOVA_DEV_`: the book refuses to start in production
   if one exists.
4. Wait until the deploy shows **Live**. Copy the service's address (**BOOK**).
5. Check: open `BOOK/healthz` in a browser. It should show just the word `ok`. Then open `BOOK` itself in a private window:
   it should bounce to the Alaskova Education sign-in page, never show book content.

## Part B. Point the website at the book

6. Render > the **website** service > Environment: set `MODULE_URL_MOLECULAR_ATLAS` to **BOOK** (no `/launch`, no
   slash at the end). Save; wait for **Live**.
7. Tell the agent "book connected". It will check from outside that the website now sends subscribers to the book,
   that the book's pages are locked without a pass, and that both health checks answer.

## Part C. Test the whole journey (Stripe sandbox)

| # | Do this | You should see |
|---|---|---|
| 8 | Signed in with a sandbox subscription: Dashboard > **Read now** | The book opens. The address bar shows BOOK, with **no** `token=` in it. |
| 9 | In the book: **Back to my library** | The Alaskova Education dashboard. |
| 10 | Open the AI tutor in a lesson and ask a question | An answer appears. |
| 11 | In the book, click around for a while, then come back after the session time (45 minutes by default) and click a link | A brief flash, then the same page of the book. No sign-in needed. |
| 12 | Sign in as a second person with **no** subscription and open `SITE/read/molecular-atlas` and then `BOOK` directly | Both end on the "You need an active subscription" page. |
| 13 | Signed out, in a private window, open `BOOK` | Ends on the Alaskova Education sign-in page. |
| 14 | With person 1: refund their sandbox payment in full in Stripe, then (within 45 minutes) click in the book | At the next session check they land on the subscribe page; the dashboard says **Ended**. |
| 15 | On a phone: sign in, Read now, read a page, use the tutor | Everything fits the screen; nothing cut off. |

If anything differs, send the agent a screenshot of that step. Book-side problems (pages, tutor, layout) go to the
Molecular Atlas agent; anything before the book opens goes to the website agent.

## Part D. Launch day

Follow `docs/GO-LIVE.md`; this is the order that avoids broken links.

16. **Everything in `docs/OWNER-CHECKLIST.md` sections A, B and D is done**: GST wording, business details, lawyer
    review (drafts banner removed), Resend email, Supabase Pro, paid Render plans.
17. **Domain**: add `alaskovaeducation.com` to the website service and `atlas.alaskovaeducation.com` to the book's service in Render
    (Settings > Custom Domains), add the DNS records, wait for "Certificate issued" on both.
18. **Website settings** (Render > website > Environment): `NEXT_PUBLIC_SITE_URL=https://alaskovaeducation.com`,
    `MODULE_URL_MOLECULAR_ATLAS=https://atlas.alaskovaeducation.com`.
19. **New signing key** (the current one was shared in a chat): on your computer, in this repository, run
    `node scripts/generate-module-keys.mjs`. Put the private key into `ALASKOVA_MODULE_PRIVATE_KEY` and set
    `ALASKOVA_MODULE_KID=alaskova-module-2` on the website. Save; wait for Live.
20. **Book settings** (Render > book > Environment): change the four addresses from part A step 3 to
    `https://alaskovaeducation.com/...` (`ALASKOVA_JWKS_URL`, `ALASKOVA_RETURN_URL`, `ALASKOVA_ORIGIN`, `ALASKOVA_LIBRARY_URL`).
    Save; wait for Live.
21. **Supabase**: Site URL `https://alaskovaeducation.com`, redirect URL `https://alaskovaeducation.com/**`; Google and Microsoft
    sign-in updated to the new domain (GO-LIVE step 4).
22. **Stripe live mode** (GO-LIVE step 2): activate the account; create the live product (A$8.99 monthly); copy the
    live secret key and price id into Render; add the live webhook to `https://alaskovaeducation.com/api/stripe/webhook` with
    the same **10 events** (including `charge.refunded` and `charge.dispute.created`) and put its signing secret into Render; set up the customer
    portal (cancel at end of billing period).
23. **Clear the sandbox records** in Supabase (SQL editor), exactly as you did when moving to the sandbox, so sandbox
    customers and subscriptions don't block real ones. Only do this before any real customer has paid.
24. Tell the agent "live". It runs the smoke test against `https://alaskovaeducation.com` (every line must pass).
25. **Real purchase**: subscribe with your own card, open the book, use the tutor, then refund yourself in full in
    Stripe and confirm access ends.
26. **Monitoring**: an uptime monitor on `https://alaskovaeducation.com/healthz` and `https://atlas.alaskovaeducation.com/healthz`.
    From now on, check Supabase > `support_requests` every business day.
