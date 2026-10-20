import { NextResponse, type NextRequest } from "next/server";
import { billingConfigured, env, siteUrl } from "@/lib/env";
import { getBook } from "@/lib/catalogue";
import { planForBook } from "@/lib/plans";
import { getUser } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { getSubscriptions } from "@/lib/access";
import { ensureStripeCustomer } from "@/lib/stripe/customer";
import { attachReferral } from "@/lib/referrals-db";
import { REFERRAL_COOKIE } from "@/lib/referrals";
import { blocksNewCheckout, grantsAccess, isSameOrigin, rateLimit } from "@/lib/security";


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
    // Already subscribed (including a failed, paused or still-processing subscription)? Don't charge twice.
    const existing = (await getSubscriptions(user.id)).filter((s) => s.book_slug === slug);
    if (existing.some((s) => grantsAccess(s.status, s.current_period_end))) {
      return redirect303(`${site}/dashboard?already=1`);
    }
    if (blocksNewCheckout(existing.map((s) => s.status))) return redirect303(`${site}/dashboard?billing=fix`);

    const stripe = getStripe();

    // If they arrived through a friend's referral link, record it (rules are enforced in attachReferral).
    // A referral problem must never stop someone subscribing, so it's logged and ignored on failure.
    const refCode = request.cookies.get(REFERRAL_COOKIE)?.value;
    if (refCode) {
      try {
        await attachReferral(user.id, refCode);
      } catch (err) {
        console.error("referral attach failed", err instanceof Error ? err.message : err);
      }
    }

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
