import { connection, NextResponse, type NextRequest } from "next/server";
import { siteUrl } from "@/lib/env";
import { REFERRAL_COOKIE, REFERRAL_COOKIE_MAX_AGE, normaliseReferralCode } from "@/lib/referrals";

/**
 * A friend's referral link: /r/ABCD2345. Remembers the code for 30 days, then sends the visitor to sign up.
 * The code is only validated for shape here; whether it counts is decided at checkout (see attachReferral).
 */
export async function GET(_request: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  await connection();
  const site = siteUrl();
  const code = normaliseReferralCode((await ctx.params).code);
  const res = NextResponse.redirect(`${site}${code ? "/register" : "/"}`, { status: 303 });
  if (code) {
    res.cookies.set(REFERRAL_COOKIE, code, {
      httpOnly: true,
      sameSite: "lax",
      secure: site.startsWith("https://"),
      path: "/",
      maxAge: REFERRAL_COOKIE_MAX_AGE,
    });
  }
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Referrer-Policy", "no-referrer");
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}
