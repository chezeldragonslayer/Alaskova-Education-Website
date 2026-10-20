import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { AuthCard } from "../AuthCard";
import { NewPasswordForm } from "../PasswordForms";

export const metadata: Metadata = {
  title: "Choose a new password",
  robots: { index: false, follow: false },
};

/** Reached from the reset email (via /auth/callback or /auth/confirm), which signs the person in first. */
async function Inner() {
  const user = await getUser().catch(() => null);
  if (!user) {
    return (
      <div className="space-y-4">
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800 ring-1 ring-red-200">
          This reset link has expired or has already been used.
        </p>
        <Link href="/forgot-password" className="font-semibold text-ocean underline underline-offset-4">Send a new link</Link>
      </div>
    );
  }
  return <NewPasswordForm />;
}

export default function ResetPasswordPage() {
  return (
    <AuthCard title="Choose a new password" intro="You’ll stay signed in after saving it.">
      <Suspense fallback={<div className="skeleton h-64" aria-busy="true" />}>
        <Inner />
      </Suspense>
    </AuthCard>
  );
}
