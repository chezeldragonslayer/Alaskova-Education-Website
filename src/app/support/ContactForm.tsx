"use client";

import { keepValues } from "@/components/keepValues";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { sendContactMessage, type ContactState } from "./actions";

const field =
  "mt-1.5 w-full rounded-xl bg-white px-4 text-base text-midnight ring-1 ring-line placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-bright";

const topics: [string, string][] = [
  ["account", "My account or signing in"],
  ["billing", "Billing, cancelling or refunds"],
  ["access", "I can’t open my textbook"],
  ["technical", "Something isn’t working"],
  ["privacy", "Privacy or my personal information"],
  ["other", "Something else"],
];

export function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContactMessage, {});
  if (state.done) {
    return <p role="status" className="rounded-xl bg-white/10 px-4 py-3 font-medium text-white ring-1 ring-white/30">{state.message}</p>;
  }
  const err = state.error ? "contact-error" : undefined;
  return (
    <form action={action} onSubmit={keepValues(action)} className="grid gap-4 sm:grid-cols-2" noValidate>
      <div>
        <label htmlFor="c-name" className="text-sm font-medium">Your name</label>
        <input id="c-name" name="name" autoComplete="name" required maxLength={100} className={`${field} h-12`} aria-describedby={err} />
      </div>
      <div>
        <label htmlFor="c-email" className="text-sm font-medium">Email (we’ll reply here)</label>
        <input id="c-email" name="email" type="email" autoComplete="email" required maxLength={254} className={`${field} h-12`} aria-describedby={err} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-topic" className="text-sm font-medium">Topic</label>
        <select id="c-topic" name="topic" required defaultValue="" className={`${field} h-12`} aria-describedby={err}>
          <option value="" disabled>Choose a topic</option>
          {topics.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="text-sm font-medium">Message</label>
        <textarea id="c-message" name="message" required minLength={10} maxLength={5000} rows={6} className={`${field} py-3`} aria-describedby={err} />
      </div>
      {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
      <div aria-hidden className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="c-website">Leave this empty</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div aria-live="polite" className="min-h-5 text-sm sm:col-span-2">
        {state.error && <p role="alert" id="contact-error" className="rounded-lg bg-white px-3 py-2 font-medium text-red-700">{state.error}</p>}
      </div>
      <div className="sm:col-span-2">
        <button disabled={pending} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-base font-semibold text-midnight shadow-card transition-all hover:-translate-y-0.5 disabled:opacity-60">
          {pending && <Loader2 className="animate-spin" size={18} aria-hidden />}
          Send message
        </button>
      </div>
    </form>
  );
}
