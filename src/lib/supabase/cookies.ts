/**
 * Options for the Supabase session cookies. The site only ever reads the session on the server, so the cookies are
 * HttpOnly (no page script can read them) and Secure whenever the site runs on https.
 * If a browser-side Supabase client is ever added, it will NOT see the session: keep auth on the server.
 */
export const supabaseCookieOptions = () => ({
  httpOnly: true,
  secure: (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https://"),
  sameSite: "lax" as const,
  path: "/",
});
