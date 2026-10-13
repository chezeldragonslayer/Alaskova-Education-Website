"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authConfigured, siteUrl } from "@/lib/env";
import { createSupabaseServer } from "@/lib/supabase/server";
import { rateLimit, safeNext } from "@/lib/security";

export type FormState = { error?: string; message?: string };

const credentials = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Use at least 8 characters.").max(128),
});

async function clientKey(scope: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  return `${scope}:${ip}`;
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
