"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { billingConfigured } from "@/lib/env";
import { createSupabaseServer, getUser } from "@/lib/supabase/server";
import { clientIp, rateLimit } from "@/lib/security";
import { displayName } from "@/lib/support";
import { closeAccount } from "@/lib/account-closure";

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

/**
 * Close the account (legal brief D5). With a subscription that still gives access: cancel at the end of the paid
 * period and delete the account automatically then. Otherwise: delete straight away and sign out.
 */
export async function closeMyAccount(_: AccountState, formData: FormData): Promise<AccountState> {
  const user = await getUser();
  if (!user) return { error: "Please sign in again." };
  if (formData.get("confirm") !== "close") return { error: "Please confirm that you want to close your account." };
  if (!rateLimit(`close:${user.id}:${clientIp(await headers())}`, 3, 60 * 60_000)) {
    return { error: "Too many attempts. Please try again later." };
  }
  if (!billingConfigured()) return { error: "This isn’t available yet. Please email support instead." };
  let result: Awaited<ReturnType<typeof closeAccount>>;
  try {
    result = await closeAccount({ id: user.id, email: user.email, name: displayName(user.user_metadata) });
  } catch (err) {
    console.error("account closure failed", err instanceof Error ? err.message : err);
    return { error: "We couldn’t close your account. Please try again, or email support." };
  }
  if (result.mode === "scheduled") {
    return { message: "Your subscription is cancelled and you won’t be charged again. Your account will be deleted when your access ends." };
  }
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
  redirect("/login?notice=closed");
}
