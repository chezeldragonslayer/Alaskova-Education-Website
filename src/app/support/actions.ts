"use server";

import { headers } from "next/headers";
import { authConfigured, billingConfigured } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/security";
import { contactSchema, isLikelyBot } from "@/lib/support";
import { saveContactMessage } from "@/lib/support-db";

export type ContactState = { error?: string; message?: string; done?: boolean };

const THANKS = "Thanks, we’ve got your message and will reply by email.";

export async function sendContactMessage(_: ContactState, formData: FormData): Promise<ContactState> {
  // Bots that fill the hidden field get the normal thank-you, so they learn nothing, but nothing is stored.
  if (isLikelyBot(formData.get("website"))) return { message: THANKS, done: true };

  const ip = clientIp(await headers());
  if (!rateLimit(`contact:${ip}`, 3, 10 * 60_000) || !rateLimit("contact:all", 60, 60 * 60_000)) {
    return { error: "You’ve sent several messages in a short time. Please wait a few minutes and try again." };
  }
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // The form needs the database (service role). Until it is connected, say so plainly.
  if (!billingConfigured()) return { error: "The contact form isn’t connected yet. Please email us instead." };

  try {
    const user = authConfigured() ? await getUser().catch(() => null) : null;
    await saveContactMessage(parsed.data, user?.id ?? null);
    return { message: THANKS, done: true };
  } catch (err) {
    console.error("contact form save failed", err instanceof Error ? err.message : err);
    return { error: "We couldn’t send your message just now. Please try again, or email us." };
  }
}
