import { z } from "zod";

/** Validation for the contact form. Pure, so it can be unit tested. */
export const SUPPORT_TOPICS = ["account", "billing", "access", "technical", "privacy", "other"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(100, "Use at most 100 characters for your name."),
  email: z.string().trim().toLowerCase().email("Enter a valid email address.").max(254),
  topic: z.enum(SUPPORT_TOPICS, { message: "Choose a topic." }),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters).")
    .max(5000, "Keep your message under 5,000 characters."),
});
export type ContactInput = z.infer<typeof contactSchema>;

/** Hidden "website" field that people never see or fill in; simple form-filling bots usually do. */
export const isLikelyBot = (honeypot: unknown) => typeof honeypot === "string" && honeypot.trim().length > 0;

/** Display name from Supabase user metadata (email sign-up stores full_name; Google/Microsoft store name). */
export function displayName(meta: Record<string, unknown> | undefined | null): string {
  const n = meta?.full_name ?? meta?.name;
  return typeof n === "string" ? n.trim() : "";
}
