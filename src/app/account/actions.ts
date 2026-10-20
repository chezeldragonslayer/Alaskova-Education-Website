"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { billingConfigured } from "@/lib/env";
import { createSupabaseServer, getUser } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/security";
import { displayName } from "@/lib/support";
import { requestAccountDeletion } from "@/lib/support-db";

export type AccountState = { error?: string; message?: string };

const nameSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your name.").max(100, "Use at most 100 characters."),
});

export async function updateName(_: AccountState, formData: FormData): Promise<AccountState> {
  const user = await getUser();
  if (!user) return { error: "Please sign in again." };
  if (!rateLimit(`name:${user.id}`, 10, 60_000)) return { error: "Too many changes. Please wait a minute." };
  const parsed = nameSchema.safeParse({ fullName: formData.get("fullName") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createSupabaseServer();
  // Profiles row (RLS lets a user change only their own full_name) and the sign-in metadata the dashboard greets with.
  const [{ error: profileErr }, { error: metaErr }] = await Promise.all([
    supabase.from("profiles").update({ full_name: parsed.data.fullName }).eq("id", user.id),
    supabase.auth.updateUser({ data: { full_name: parsed.data.fullName } }),
  ]);
  if (profileErr || metaErr) {
    console.error("name update failed", profileErr?.message ?? metaErr?.message);
    return { error: "We couldn’t save your name. Please try again." };
  }
  return { message: "Saved." };
}

export async function requestDeletion(_: AccountState, formData: FormData): Promise<AccountState> {
  const user = await getUser();
  if (!user) return { error: "Please sign in again." };
  if (formData.get("confirm") !== "on") return { error: "Tick the box to confirm you want your account deleted." };
  if (!rateLimit(`delete:${user.id}:${clientIp(await headers())}`, 3, 60 * 60_000)) {
    return { error: "Too many attempts. Please try again later." };
  }
  if (!billingConfigured()) return { error: "This isn’t available yet. Please email support instead." };
  try {
    const created = await requestAccountDeletion({ id: user.id, email: user.email, name: displayName(user.user_metadata) });
    return {
      message: created
        ? "Request received. We’ll delete your account within 30 days and email you when it’s done."
        : "We already have your deletion request and are working on it.",
    };
  } catch (err) {
    console.error("deletion request failed", err instanceof Error ? err.message : err);
    return { error: "We couldn’t record your request. Please try again, or email support." };
  }
}
