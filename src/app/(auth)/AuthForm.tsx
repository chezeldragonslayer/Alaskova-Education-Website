"use client";

import { keepValues } from "@/components/keepValues";
import { InAppBrowserNotice, useInAppBrowser } from "@/components/InAppBrowserNotice";
import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signIn, signUp, signInWithProvider, type FormState } from "./actions";

const field =
  "mt-1.5 h-12 w-full rounded-xl bg-white px-4 text-base ring-1 ring-line placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-gold-ink";

export function AuthForm({ mode, next }: { mode: "login" | "register"; next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(
    mode === "login" ? signIn : signUp,
    {},
  );
  const isLogin = mode === "login";

  // Google refuses to sign people in from inside Instagram's built-in browser, so don't offer it there.
  const inApp = useInAppBrowser();
  const providers = ([
    ["google", "Continue with Google"],
    ["azure", "Continue with Microsoft"],
  ] as const).filter(([p]) => !(inApp && p === "google"));

  return (
    <div>
      <InAppBrowserNotice variant="signin" />
      <p className="mb-5 text-sm leading-relaxed text-muted">
        By continuing, you agree to our{" "}
        <Link href="/legal/terms" className="font-medium text-gold-ink underline underline-offset-4">Terms of service</Link>{" "}
        and confirm you&rsquo;ve read our{" "}
        <Link href="/legal/privacy" className="font-medium text-gold-ink underline underline-offset-4">Privacy policy</Link>.
        To run your account we share your details with service providers such as Supabase, Render and Stripe, some of
        which store information outside Australia.
      </p>
      <div className="grid gap-3">
        {providers.map(([p, label]) => (
          <form key={p} action={signInWithProvider}>
            <input type="hidden" name="provider" value={p} />
            <input type="hidden" name="next" value={next} />
            <button className="h-12 w-full rounded-xl bg-white text-[0.9375rem] font-semibold text-navy shadow-card ring-1 ring-line transition-all hover:-translate-y-0.5 hover:ring-gold/40">
              {label}
            </button>
          </form>
        ))}
      </div>

      <div className="my-6 flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-muted" aria-hidden>
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>

      <form action={action} onSubmit={keepValues(action)} className="space-y-4" noValidate>
        <input type="hidden" name="next" value={next} />
        {!isLogin && (
          <div>
            <label htmlFor="fullName" className="text-sm font-medium">Full name</label>
            <input id="fullName" name="fullName" autoComplete="name" required className={field} />
          </div>
        )}
        <div>
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            minLength={8}
            required
            className={field}
          />
          {!isLogin && <p className="mt-1.5 text-xs text-muted">At least 8 characters.</p>}
          {isLogin && (
            <p className="mt-1.5 text-right text-sm">
              <Link href="/forgot-password" className="font-medium text-gold-ink underline underline-offset-4">Forgot your password?</Link>
            </p>
          )}
        </div>

        <div aria-live="polite" className="min-h-5 text-sm">
          {state.error && <p role="alert" className="font-medium text-red-700">{state.error}</p>}
          {state.message && <p className="font-medium text-navy-soft">{state.message}</p>}
        </div>

        <button
          disabled={pending}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgb(15_30_61/0.8)] transition-colors hover:bg-navy-2 disabled:opacity-60"
        >
          {pending && <Loader2 className="animate-spin" size={18} aria-hidden />}
          {isLogin ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        {isLogin ? "New to Alaskova Education?" : "Already have an account?"}{" "}
        <Link
          href={`${isLogin ? "/register" : "/login"}?next=${encodeURIComponent(next)}`}
          className="font-semibold text-gold-ink underline underline-offset-4"
        >
          {isLogin ? "Create an account" : "Sign in"}
        </Link>
      </p>
    </div>
  );
}
