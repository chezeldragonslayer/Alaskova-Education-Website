import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseCookieOptions } from "@/lib/supabase/cookies";

/**
 * 1. Refreshes the Supabase session cookie on every request.
 * 2. Redirects signed-out visitors away from private pages.
 *
 * This is a convenience layer only. Every private page, route handler and API
 * re-verifies the user and subscription on the server — never trust this alone.
 */
const PRIVATE_PREFIXES = ["/dashboard", "/read", "/account"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let response = NextResponse.next({ request });
  let signedIn = false;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookieOptions: supabaseCookieOptions(),
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    const { data } = await supabase.auth.getUser();
    signedIn = Boolean(data.user);
  }

  if (isPrivate && !signedIn) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(login);
  }

  if (signedIn && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Private pages must never be cached by shared caches or indexed.
  if (isPrivate) {
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|brand/|icon.png|robots.txt|sitemap.xml|api/stripe/webhook|.well-known).*)",
  ],
};
