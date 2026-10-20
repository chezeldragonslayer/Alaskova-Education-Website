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
> 6. **AI tutor.** The owner has decided the AI tutor will be **on** in production. The main site's privacy policy now
>    says the tutor sends what the learner types, and the current lesson, to Anthropic, never a name or email, and that
>    conversations stay in the browser. The main-site agent read `src/app/api/tutor/route.ts` (read-only) and the policy
>    lists what it sends: the conversation, the lesson or current problem, mastery and recent errors, and the optional
>    `displayName` from the reader's settings. Note that sending `displayName` to Anthropic sits awkwardly with the brief's
>    "do not collect names" rule; consider labelling that setting "What should the tutor call you? (optional, shared with
>    the AI tutor)". Please confirm the route logs no learner text, and tell the owner if anything else is sent.
> 7. **Feature claims.** The main site now advertises only: table of contents and lesson navigation, progress tracking
>    saved in the browser, light and dark themes, practice and review, and a personal notebook. It no longer mentions
>    bookmarks or adjustable text size, because the module does not have them yet. If you add either, tell the owner so
>    the main site's copy can be updated.
> 8. **Wording.** The owner's instruction for the main site is that Molecular Atlas is an *organic chemistry* textbook
>    and must never be described as pharmaceutical. Your README says "organic and medicinal chemistry". Please check
>    that wording with the owner.
> 9. **Single instance.** Both services keep state in memory (your used `jti`s and `/launch` rate limit; the main
>    site's rate limits), so both must run as exactly one instance on an always-on plan.
