import { NextResponse, type NextRequest } from "next/server";
import { billingConfigured, siteUrl } from "@/lib/env";
import { createSupabaseAdmin, getUser } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { isSameOrigin, rateLimit } from "@/lib/security";


const redirect303 = (url: string) => NextResponse.redirect(url, { status: 303 });

/** Sends the signed-in user to the Stripe Customer Portal (cancel, update card, invoices). */
export async function POST(request: NextRequest) {
  const site = siteUrl();
  if (!isSameOrigin(request, site)) return new NextResponse("Forbidden", { status: 403 });

  const user = await getUser();
  if (!user) return redirect303(`${site}/login?next=/dashboard`);
  if (!rateLimit(`portal:${user.id}`, 10, 60_000)) return new NextResponse("Too many requests", { status: 429 });
  if (!billingConfigured()) return redirect303(`${site}/dashboard?billing=unavailable`);

  try {
    const { data } = await createSupabaseAdmin()
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!data) return redirect303(`${site}/dashboard?billing=none`);

    const session = await getStripe().billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${site}/dashboard`,
    });
    return redirect303(session.url);
  } catch (err) {
    console.error("portal failed", err instanceof Error ? err.message : err);
    return redirect303(`${site}/dashboard?billing=error`);
  }
}
