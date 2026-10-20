import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseServer } from "@/lib/supabase/server";
import { authConfigured, siteUrl } from "@/lib/env";
import { safeNext } from "@/lib/security";

const TYPES: EmailOtpType[] = ["signup", "email", "recovery", "email_change", "invite", "magiclink"];

/**
 * Email-link return point using Supabase's token-hash flow. Unlike /auth/callback (PKCE code flow), this works even
 * when the email is opened in a different browser or device from the one the person signed up in.
 * Supabase email templates should link here, e.g.
 *   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password
 */
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const tokenHash = sp.get("token_hash");
  const type = sp.get("type") as EmailOtpType | null;
  const base = siteUrl();
  const fallback = type === "recovery" ? "/reset-password" : "/dashboard";
  const next = safeNext(sp.get("next"), fallback);
  const noStore = { headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } };

  if (!authConfigured() || !tokenHash || !type || !TYPES.includes(type)) {
    return NextResponse.redirect(`${base}/login?error=callback`, noStore);
  }
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
  if (error) {
    return NextResponse.redirect(type === "recovery" ? `${base}/reset-password` : `${base}/login?error=callback`, noStore);
  }
  return NextResponse.redirect(`${base}${next}`, noStore);
}
