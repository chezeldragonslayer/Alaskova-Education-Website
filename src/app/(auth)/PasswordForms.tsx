"use client";

import { keepValues } from "@/components/keepValues";
import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { requestPasswordReset, updatePassword, type FormState } from "./actions";

const field =
  "mt-1.5 h-12 w-full rounded-xl bg-white px-4 text-base ring-1 ring-line placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-bright";
const submit =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-ocean text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgb(23_107_192/0.8)] transition-colors hover:bg-steel disabled:opacity-60";

function Status({ state }: { state: FormState }) {
  return (
    <div aria-live="polite" className="min-h-5 text-sm">
      {state.error && <p role="alert" id="form-error" className="font-medium text-red-700">{state.error}</p>}
      {state.message && <p className="font-medium text-steel">{state.message}</p>}
    </div>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(requestPasswordReset, {});
  return (
    <form action={action} onSubmit={keepValues(action)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className={field}
          aria-invalid={state.error ? true : undefined} aria-describedby={state.error ? "form-error" : undefined} />
      </div>
      <Status state={state} />
      <button disabled={pending} className={submit}>
        {pending && <Loader2 className="animate-spin" size={18} aria-hidden />}
        Email me a reset link
      </button>
      <p className="text-center text-sm text-muted">
        Remembered it? <Link href="/login" className="font-semibold text-ocean underline underline-offset-4">Sign in</Link>
      </p>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(updatePassword, {});
  const invalid = state.error ? true : undefined;
  return (
    <form action={action} onSubmit={keepValues(action)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="password" className="text-sm font-medium">New password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required
          className={field} aria-invalid={invalid} aria-describedby="pw-hint" />
        <p id="pw-hint" className="mt-1.5 text-xs text-muted">At least 8 characters.</p>
      </div>
      <div>
        <label htmlFor="confirm" className="text-sm font-medium">Confirm new password</label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required className={field}
          aria-invalid={invalid} aria-describedby={state.error ? "form-error" : undefined} />
      </div>
      <Status state={state} />
      <button disabled={pending} className={submit}>
        {pending && <Loader2 className="animate-spin" size={18} aria-hidden />}
        Save new password
      </button>
    </form>
  );
}
