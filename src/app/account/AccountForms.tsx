"use client";

import { keepValues } from "@/components/keepValues";
import { useActionState, useRef } from "react";
import { Loader2 } from "lucide-react";
import { closeMyAccount, updateName, type AccountState } from "./actions";

const field =
  "mt-1.5 h-12 w-full rounded-xl bg-white px-4 text-base ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-gold-ink";

function Status({ state, id }: { state: AccountState; id: string }) {
  return (
    <div aria-live="polite" className="min-h-5 text-sm">
      {state.error && <p role="alert" id={id} className="font-medium text-red-700">{state.error}</p>}
      {state.message && <p className="font-medium text-navy-soft">{state.message}</p>}
    </div>
  );
}

export function NameForm({ name }: { name: string }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(updateName, {});
  return (
    <form action={action} onSubmit={keepValues(action)} className="space-y-3">
      <div>
        <label htmlFor="fullName" className="text-sm font-medium">Name</label>
        <input id="fullName" name="fullName" defaultValue={name} autoComplete="name" required maxLength={100}
          className={field} aria-describedby={state.error ? "name-error" : undefined} />
      </div>
      <Status state={state} id="name-error" />
      <button disabled={pending} className="inline-flex h-11 items-center gap-2 rounded-xl bg-navy px-5 text-sm font-semibold text-white transition-colors hover:bg-navy-2 disabled:opacity-60">
        {pending && <Loader2 className="animate-spin" size={16} aria-hidden />} Save name
      </button>
    </form>
  );
}

/** Close-account button with a confirmation dialog (legal brief D5). `endsAt` is set when a subscription still gives access. */
export function CloseAccountForm({ endsAt, scheduled }: { endsAt: string | null; scheduled: boolean }) {
  const [state, action, pending] = useActionState<AccountState, FormData>(closeMyAccount, {});
  const dialog = useRef<HTMLDialogElement>(null);
  if (scheduled || state.message) {
    return (
      <p role="status" className="font-medium text-navy-soft">
        {state.message ??
          `Your account is set to close. You keep access until ${endsAt ?? "the end of your paid period"}, and then your account will be deleted.`}
      </p>
    );
  }
  return (
    <div>
      <Status state={state} id="close-error" />
      <button type="button" onClick={() => dialog.current?.showModal()}
        className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-red-700 ring-1 ring-red-300 transition-colors hover:bg-red-50">
        Close my account
      </button>
      <dialog ref={dialog} aria-labelledby="close-title"
        className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-2xl bg-white p-6 text-navy shadow-card backdrop:bg-navy/60">
        <h3 id="close-title" className="font-display text-xl font-semibold tracking-tight">Close your account?</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {endsAt
            ? `Closing your account cancels your Molecular Atlas subscription. You won't be charged again. You'll keep access until ${endsAt}, and then your account will be deleted. Notes and progress saved in your browser aren't deleted by us; clear your browser data to remove them.`
            : "Your account will be deleted straight away. This can't be undone."}
        </p>
        <form action={action} onSubmit={() => dialog.current?.close()} className="mt-6 flex flex-wrap gap-3">
          <input type="hidden" name="confirm" value="close" />
          <button disabled={pending}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-red-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-60">
            {pending && <Loader2 className="animate-spin" size={16} aria-hidden />} Close my account
          </button>
          <button type="button" autoFocus onClick={() => dialog.current?.close()}
            className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-navy ring-1 ring-line hover:bg-paper">
            Keep my account
          </button>
        </form>
      </dialog>
    </div>
  );
}
