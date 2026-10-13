import { NextResponse, type NextRequest } from "next/server";
import { authConfigured, siteUrl } from "@/lib/env";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isSameOrigin } from "@/lib/security";

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request, siteUrl())) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (authConfigured()) {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(`${siteUrl()}/`, { status: 303 });
}
