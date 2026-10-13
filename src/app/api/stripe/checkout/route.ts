import { NextResponse, type NextRequest } from "next/server";
import { billingConfigured, env, siteUrl } from "@/lib/env";
import { getBook } from "@/lib/catalogue";
import { planForBook } from "@/lib/plans";
import { getUser, createSupabaseAdmin } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { hasAccess } from "@/lib/access";
import { isSameOrigin, rateLimit } from "@/lib/security";


const redirect303 = (url: string) => NextResponse.redirect(url, { status: 303 });

export async function POST(request: NextRequest) {
  const site = siteUrl();
  if (!isSameOrigin(request, site)) return new NextResponse("Forbidden", { status: 403 });

  const form = await request.formData();
  const slug = String(form.get("book") ?? "");
  const book = getBook(slug);
  if (!book || !planForBook(slug)) return redirect303(`${site}/catalogue`);

  const user = await getUser();
  if (!user) {
    return redirect303(`${site}/login?next=${encodeURIComponent(`/catalogue/${slug}`)}`);
  }
  if (!rateLimit(`checkout:${user.id}`, 10, 60_000)) {
    return new NextResponse("Too many requests", { status: 429 });
  }
  if (!billingConfigured()) {
    return redirect303(`${site}/catalogue/${slug}?checkout=unavailable`);
  }

  try {
    // Already subscribed? Don't charge twice.
    if (await hasAccess(user.id, slug)) return redirect303(`${site}/dashboard?already=1`);

    const stripe = getStripe();
    const admin = createSupabaseAdmin();

    // Find or create the Stripe customer for this user.
    const { data: existing } = await admin
      .from("stripe_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();
    let customerId = existing?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create(
        { email: user.email, metadata: { user_id: user.id } },
        { idempotencyKey: `customer-${user.id}` },
      );
      customerId = customer.id;
      const { error } = await admin
        .from("stripe_customers")
        .upsert({ user_id: user.id, stripe_customer_id: customerId }, { onConflict: "user_id" });
      if (error) throw error;
    }

    const metadata = { user_id: user.id, book_slug: slug };
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: env.stripePriceForBook(slug), quantity: 1 }],
      subscription_data: { metadata },
      metadata,
      // Redirect is for UX only. Access is granted by the verified webhook, not by this URL.
      success_url: `${site}/dashboard?checkout=success`,
      cancel_url: `${site}/catalogue/${slug}?checkout=cancelled`,
    });
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return redirect303(session.url);
  } catch (err) {
    console.error("checkout failed", err instanceof Error ? err.message : err);
    return redirect303(`${site}/catalogue/${slug}?checkout=error`);
  }
}
