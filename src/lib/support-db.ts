import "server-only";
import { createSupabaseAdmin } from "@/lib/supabase/server";
import type { ContactInput } from "@/lib/support";

export async function saveContactMessage(input: ContactInput, userId: string | null) {
  const { error } = await createSupabaseAdmin().from("support_requests").insert({
    kind: "contact",
    // The database allows the original six topics; a suggestion is stored as "other" and labelled in the message.
    topic: input.topic === "suggestion" ? "other" : input.topic,
    user_id: userId,
    name: input.name,
    email: input.email,
    message: input.topic === "suggestion" ? `Suggestion: ${input.message}` : input.message,
  });
  if (error) throw error;
}

