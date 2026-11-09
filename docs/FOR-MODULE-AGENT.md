# Notes for the Molecular Atlas agent (ready to paste)

The Alaskova Education website agent audited the integration against `INTEGRATION.md` in the Molecular Atlas
repository on 21 October 2026. It did **not** change the Molecular Atlas repository. The token contract matches
exactly; nothing in the module needs to change for launch. Paste the block below to the Molecular Atlas agent.

---

> Integration check from the Alaskova Education website (no action required for the token itself):
>
> 1. **Token contract confirmed.** The main site signs EdDSA (Ed25519) with `kid` `alaskova-module-1`, `iss`
>    `alaskova-education`, `aud` and `book` `molecular-atlas`, `sub` = opaque Supabase user id (UUID, no email),
>    `iat`, `exp = iat + 60`, `jti` = UUID, a fresh token per launch, full-page 307 redirect to `/launch?token=...`
>    with `Referrer-Policy: no-referrer` and `Cache-Control: private, no-store`. JWKS at
>    `https://<main-site>/.well-known/jwks.json` (Ed25519 OKP key with `kid`, `alg`, `use: sig`; cached 5 minutes).
> 2. **Key rotation.** Before launch the owner will generate a new key with a **new `kid`** (for example
>    `alaskova-module-2`), because the test key was shared in a chat. Please make sure production uses
>    `ALASKOVA_JWKS_URL` rather than a pasted `ALASKOVA_PUBLIC_KEY`, so the new `kid` is picked up automatically by the
>    refetch-on-unknown-`kid` logic. If you keep a PEM option, document that it must be replaced at the same moment.
> 3. **Library link.** Your `.env.example` and `render.yaml` use `https://www.example.com/library` as the example
>    `ALASKOVA_LIBRARY_URL`. The main site's library page is `/dashboard`; it now also redirects `/library` to
>    `/dashboard`, so either works, but please change the example to `/dashboard` to avoid confusion.
> 4. **Return URL.** `ALASKOVA_RETURN_URL` must be exactly `https://<main-site>/read/molecular-atlas`. That route now
>    sends the learner to the main dashboard with a friendly message (instead of a server error) if the subscription
>    database or the signing key is unavailable, and to the book's subscribe page if access has ended.
> 5. **Progress endpoint.** Not built on the main site yet (optional per INTEGRATION.md). Learner progress stays in the
>    browser for launch. The main site's draft privacy policy says so. Please do not set `ALASKOVA_PROGRESS_URL` until
>    the main site announces the endpoint.
> 6. **AI tutor — removed.** This item asked the module to confirm what its tutor sent to Anthropic. The owner had
>    the AI tutor removed from Molecular Atlas entirely on 9 November 2026, before it had ever run against a live
>    API: the route, the panel, the `src/lib/tutor` modules, the `tutorConversations` store and the
>    `ANTHROPIC_API_KEY` and `TUTOR_MODEL` settings are all gone, and Dexie version 7 drops the store. Nothing is
>    sent to Anthropic. This site's privacy policy, GO-LIVE, OWNER-CHECKLIST, LAUNCH-AUDIT, REPOSITIONING-PLAN and
>    CONNECT-MOLECULAR-ATLAS have been updated to match. Do not set an Anthropic key on either service.
> 7. **Feature claims.** The main site now advertises only: table of contents and lesson navigation, progress tracking
>    saved in the browser, light and dark themes, practice and review, and a personal notebook. It no longer mentions
>    bookmarks or adjustable text size, because the module does not have them yet. If you add either, tell the owner so
>    the main site's copy can be updated.
> 8. **Wording.** Update (7 November 2026): the owner has withdrawn the earlier "never describe it as
>    pharmaceutical" rule. Molecular Atlas may be called a pharmaceutical textbook, and your README's "organic and
>    medicinal chemistry" is fine.
> 9. **Single instance.** Both services keep state in memory (your used `jti`s and `/launch` rate limit; the main
>    site's rate limits), so both must run as exactly one instance on an always-on plan.
> 10. **New brand (revision 4).** The owner has a new logo: a crowned navy lion with a gold staff and serpent. The main
>     site now uses navy `#0F1E3D` as the main colour, gold `#C69732` for decoration (and as text only on navy), a darker
>     gold `#85621A` for gold text on light backgrounds, warm off-white surfaces (`#FAF8F3`), Noto Serif bold condensed
>     headings and Inter body text. The old blues (`#032048`, `#176BC0`, `#1D7DD9` and so on) are retired. Please ask the
>     owner for the logo pack (`alaskova-education-logo-pack-v4.zip`) before changing the book's branding, and use the
>     supplied files unchanged. The PNGs have opaque backgrounds (white, or navy `#0F1E3D` for the reversed version).
