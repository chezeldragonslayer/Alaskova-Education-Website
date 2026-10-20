import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import type { ContactInput } from "@/lib/support";

export async function saveContactMessage(input: ContactInput, userId: string | null) {
  const { error } = await createSupabaseAdmin().from("support_requests").insert({
    kind: "contact",
    topic: input.topic,
    user_id: userId,
    name: input.name,
    email: input.email,
    message: input.message,
  });
  if (error) throw error;
}

/** Records a deletion request once; returns false if an open one already exists. */
export async function requestAccountDeletion(user: { id: string; email?: string | null; name: string }) {
  const db = createSupabaseAdmin();
  const { data: open, error: readErr } = await db
    .from("support_requests")
    .select("id")
    .eq("user_id", user.id)
    .eq("kind", "account_deletion")
    .eq("status", "open")
    .limit(1);
  if (readErr) throw readErr;
  if (open?.length) return false;
  const { error } = await db.from("support_requests").insert({
    kind: "account_deletion",
    topic: "privacy",
    user_id: user.id,
    name: user.name || "(no name)",
    email: user.email ?? "(no email)",
    message: "Account deletion requested from My account.",
  });
  if (error) throw error;
  return true;
}
