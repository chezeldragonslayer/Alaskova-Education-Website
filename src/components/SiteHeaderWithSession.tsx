import { cookies } from "next/headers";
import { SiteHeader } from "./SiteHeader";

/**
 * The header, told whether a visitor is signed in, so it can offer "My account" instead of "Sign in".
 * Only checks that a Supabase session cookie is present (no network call): it is a label, not access control.
 * Pages that need a real check (account, dashboard, reader) still verify the session with Supabase, and an
 * expired session simply lands on the sign-in page.
 */
export async function SiteHeaderWithSession() {
  const signedIn = (await cookies())
    .getAll()
    .some(({ name }) => name.startsWith("sb-") && /-auth-token(\.\d+)?$/.test(name));
  return <SiteHeader signedIn={signedIn} />;
}
