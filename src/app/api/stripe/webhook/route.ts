import { NextResponse, type NextRequest } from "next/server";
import { billingConfigured, env } from "@/lib/env";
import { getStripe } from "@/lib/stripe/client";
import { realSyncDeps } from "@/lib/stripe/db";
import { processStripeEvent } from "@/lib/stripe/sync";


/**
 * Stripe -> Apex. Authenticated ONLY by the Stripe signature (no cookies/CORS).
 * Needs the raw request body, so we read text() and never parse it first.
 */
export async function POST(request: NextRequest) {
  if (!billingConfigured()) return new NextResponse("Billing not configured", { status: 503 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing signature", { status: 400 });

  const body = await request.text();
  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, env.stripeWebhookSecret());
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    const result = await processStripeEvent(event, realSyncDeps());
    return NextResponse.json({ received: true, result });
  } catch (err) {
    console.error("stripe webhook failed", event.id, event.type, err instanceof Error ? err.message : err);
    // 500 => Stripe retries with backoff; the idempotency ledger makes retries safe.
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
