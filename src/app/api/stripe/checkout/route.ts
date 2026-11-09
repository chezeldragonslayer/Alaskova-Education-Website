import { NextResponse, type NextRequest } from "next/server";
import { billingConfigured, env, siteUrl } from "@/lib/env";
import { bookPath, getBook } from "@/lib/catalogue";
import { planForBook } from "@/lib/plans";
import { getUser } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { getSubscriptions } from "@/lib/access";
import { ensureStripeCustomer } from "@/lib/stripe/customer";
import { SOURCE_COOKIE, sourceFromCookie } from "@/lib/attribution";
import { blocksNewCheckout, grantsAccess, isSameOrigin, rateLimit } from "@/lib/security";


const redirect303 = (url: string) => NextResponse.redirect(url, { status: 303 });

export async function POST(request: NextRequest) {
  const site = siteUrl();
  // Refused (cross-site request, or the site's address setting doesn't match the address in use): no checkout is
  // created. Send the visitor back to the page on the same address with a message rather than a blank error.
  if (!isSameOrigin(request, site)) {
    return NextResponse.redirect(new URL("/molecular-atlas?checkout=blocked", request.url), { status: 303 });
  }

  const form = await request.formData();
  const slug = String(form.get("book") ?? "");
  const book = getBook(slug);
  if (!book || !planForBook(slug)) return redirect303(`${site}/modules`);

  const user = await getUser();
  if (!user) {
    return redirect303(`${site}/login?next=${encodeURIComponent(bookPath(slug))}`);
  }
  if (!rateLimit(`checkout:${user.id}`, 10, 60_000)) {
    return new NextResponse("Too many requests", { status: 429 });
  }
  if (!billingConfigured()) {
    return redirect303(`${site}${bookPath(slug)}?checkout=unavailable`);
  }

  try {
    // Already subscribed (including a failed, paused or still-processing subscription)? Don't charge twice.
    const existing = (await getSubscriptions(user.id)).filter((s) => s.book_slug === slug);
    if (existing.some((s) => grantsAccess(s.status, s.current_period_end))) {
      return redirect303(`${site}/dashboard?already=1`);
    }
    if (blocksNewCheckout(existing.map((s) => s.status))) return redirect303(`${site}/dashboard?billing=fix`);

    const stripe = getStripe();

    // Find or create the Stripe customer for this user.
    const customerId = await ensureStripeCustomer(user.id, user.email);

    // Our database only learns about a new subscription when Stripe's webhook arrives (usually seconds later).
    // Ask Stripe directly too, so a second click in that gap can't start a second subscription.
    const inStripe = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 100 });
    const stripeStatuses = inStripe.data.filter((s) => s.metadata?.book_slug === slug).map((s) => s.status);
    if (blocksNewCheckout(stripeStatuses)) {
      return redirect303(
        `${site}/dashboard?${stripeStatuses.some((st) => st === "active" || st === "trialing") ? "already=1" : "billing=fix"}`,
      );
    }

    // source: which channel sent the student ("instagram" or "direct"); lets you count subscriptions by source in Stripe.
    const metadata = { user_id: user.id, book_slug: slug, source: sourceFromCookie(request.cookies.get(SOURCE_COOKIE)?.value) };
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: user.id,
      // With STRIPE_TAX_RATE_GST set (an inclusive 10% rate), invoices show the GST included in the price.
      line_items: [
        {
          price: env.stripePriceForBook(slug),
          quantity: 1,
          ...(env.gstTaxRateId() ? { tax_rates: [env.gstTaxRateId()!] } : {}),
        },
      ],
      subscription_data: { metadata },
      metadata,
      // Redirect is for UX only. Access is granted by the verified webhook, not by this URL.
      success_url: `${site}/dashboard?checkout=success`,
      cancel_url: `${site}${bookPath(slug)}?checkout=cancelled`,
    });
    if (!session.url) throw new Error("Stripe returned no checkout URL");
    return redirect303(session.url);
  } catch (err) {
    console.error("checkout failed", err instanceof Error ? err.message : err);
    return redirect303(`${site}${bookPath(slug)}?checkout=error`);
  }
}
