"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authConfigured, siteUrl } from "@/lib/env";
import { createSupabaseServer } from "@/lib/supabase/server";
import { clientIp, rateLimit, safeNext } from "@/lib/security";

export type FormState = { error?: string; message?: string };

const credentials = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters.").max(128),
});

async function clientKey(scope: string) {
  return `${scope}:${clientIp(await headers())}`;
}

const NOT_CONFIGURED: FormState = {
  error: "Sign-in isn't configured yet. The site owner needs to connect Supabase.",
};

export async function signIn(_: FormState, formData: FormData): Promise<FormState> {
  if (!authConfigured()) return NOT_CONFIGURED;
  if (!rateLimit(await clientKey("signin"), 10, 60_000)) {
    return { error: "Too many attempts. Please wait a minute and try again." };
  }
  const parsed = credentials.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  // Generic message: never reveal whether an account exists.
  if (error) return { error: "Incorrect email or password." };
  redirect(safeNext(String(formData.get("next") ?? "")));
}

export async function signUp(_: FormState, formData: FormData): Promise<FormState> {
  if (!authConfigured()) return NOT_CONFIGURED;
  if (!rateLimit(await clientKey("signup"), 5, 60_000)) {
    return { error: "Too many attempts. Please wait a minute and try again." };
  }
  const parsed = credentials
    .extend({ fullName: z.string().trim().min(1, "Enter your name.").max(100) })
    .safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
      fullName: formData.get("fullName"),
    });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const next = safeNext(String(formData.get("next") ?? ""));
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: "We couldn't create that account. Try a different email or sign in." };
  if (data.session) redirect(next);
  // Email confirmation required (or the address already exists): same message either way.
  return { message: "Check your email to confirm your account, then sign in." };
}

export async function signInWithProvider(formData: FormData) {
  const provider = formData.get("provider");
  if (provider !== "google" && provider !== "azure") redirect("/login");
  if (!authConfigured()) redirect("/login?error=not-configured");
  const next = safeNext(String(formData.get("next") ?? ""));
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent(next)}`,
      ...(provider === "azure" ? { scopes: "email" } : {}),
    },
  });
  if (error || !data.url) redirect("/login?error=oauth");
  redirect(data.url);
}

const emailOnly = z.object({ email: z.string().trim().toLowerCase().email("Enter a valid email address.") });

/** Step 1 of password reset: email a reset link. Always gives the same answer, so it never reveals who has an account. */
export async function requestPasswordReset(_: FormState, formData: FormData): Promise<FormState> {
  if (!authConfigured()) return NOT_CONFIGURED;
  const parsed = emailOnly.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  if (
    !rateLimit(await clientKey("reset"), 5, 60_000) ||
    !rateLimit(`reset-email:${parsed.data.email}`, 3, 60 * 60_000)
  ) {
    return { error: "Too many attempts. Please wait a while and try again." };
  }
  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteUrl()}/auth/callback?next=${encodeURIComponent("/reset-password")}`,
  });
  if (error) console.error("password reset request failed", error.message);
  return { message: "If an account exists for that email, we’ve sent a link to reset your password. It expires in one hour." };
}

const newPassword = z
  .object({
    password: z.string().min(8, "Use at least 8 characters.").max(128),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "The two passwords don’t match.", path: ["confirm"] });

/** Step 2 of password reset (or a signed-in password change): set a new password for the current session. */
export async function updatePassword(_: FormState, formData: FormData): Promise<FormState> {
  if (!authConfigured()) return NOT_CONFIGURED;
  if (!rateLimit(await clientKey("update-password"), 10, 60_000)) {
    return { error: "Too many attempts. Please wait a minute and try again." };
  }
  const parsed = newPassword.safeParse({ password: formData.get("password"), confirm: formData.get("confirm") });
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const supabase = await createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: "Your reset link has expired. Please request a new one." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    return {
      error:
        error.code === "same_password"
          ? "Choose a password different from your old one."
          : "We couldn’t update your password. Please request a new reset link.",
    };
  }
  redirect("/account?password=updated");
}
