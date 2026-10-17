import "server-only";
import Stripe from "stripe";
import { env } from "@/lib/env";

let stripe: Stripe | undefined;
export function getStripe() {
  stripe ??= new Stripe(env.stripeSecretKey(), {
    appInfo: { name: "Alaskova Education" },
    maxNetworkRetries: 2,
  });
  return stripe;
}
