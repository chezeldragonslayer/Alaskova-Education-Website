import "server-only";
import type { User } from "@supabase/supabase-js";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import { TERMS_VERSION } from "@/lib/legal";

/**
 * Legal brief D1: record that the person accepted the Terms when they created their account.
 * Email sign-ups carry the time they pressed "Create account" in their user metadata; Google/Microsoft sign-ups
 * accept by pressing "Continue with…" under the same notice, so the time is when they first come back signed in.
 * Only fills an empty record, and never blocks sign-in if it fails (the error is logged).
 */
export async function recordSignupConsent(user: Pick<User, "id" | "user_metadata">): Promise<void> {
  try {
    const meta = user.user_metadata ?? {};
    const acceptedAt = typeof meta.terms_accepted_at === "string" ? meta.terms_accepted_at : new Date().toISOString();
    const version = typeof meta.terms_version === "string" ? meta.terms_version : TERMS_VERSION;
    const { error } = await createSupabaseAdmin()
      .from("profiles")
      .update({ terms_accepted_at: acceptedAt, terms_version: version })
      .eq("id", user.id)
      .is("terms_accepted_at", null);
    if (error) console.error("could not record sign-up terms consent", error.message);
  } catch (err) {
    console.error("could not record sign-up terms consent", err instanceof Error ? err.message : err);
  }
}
