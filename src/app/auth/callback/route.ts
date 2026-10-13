import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { authConfigured, siteUrl } from "@/lib/env";
import { safeNext } from "@/lib/security";

/** OAuth + email-confirmation return point: exchanges the code for a session. */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  const base = siteUrl();
  if (!authConfigured() || !code) return NextResponse.redirect(`${base}/login?error=callback`);

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(`${base}/login?error=callback`);
  return NextResponse.redirect(`${base}${next}`);
}
