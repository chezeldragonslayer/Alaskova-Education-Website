"use client";

import { keepValues } from "@/components/keepValues";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { requestDeletion, updateName, type AccountState } from "./actions";

const field =
  "mt-1.5 h-12 w-full rounded-xl bg-white px-4 text-base ring-1 ring-line focus:outline-none focus:ring-2 focus:ring-bright";

function Status({ state, id }: { state: AccountState; id: string }) {
  return (
    <div aria-live="polite" className="min-h-5 text-sm">
      {state.error && <p role="alert" id={id} className="font-medium text-red-700">{state.error}</p>}
      {state.message && <p className="font-medium text-steel">{state.message}</p>}
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
      <button disabled={pending} className="inline-flex h-11 items-center gap-2 rounded-xl bg-ocean px-5 text-sm font-semibold text-white transition-colors hover:bg-steel disabled:opacity-60">
        {pending && <Loader2 className="animate-spin" size={16} aria-hidden />} Save name
      </button>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action, pending] = useActionState<AccountState, FormData>(requestDeletion, {});
  if (state.message) return <p role="status" className="font-medium text-steel">{state.message}</p>;
  return (
    <form action={action} onSubmit={keepValues(action)} className="space-y-3">
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" name="confirm" className="mt-1 size-4 accent-ocean" />
        <span>I want my Alaskova Education account and its personal information deleted. I understand this can’t be undone.</span>
      </label>
      <Status state={state} id="delete-error" />
      <button disabled={pending} className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-red-700 ring-1 ring-red-300 transition-colors hover:bg-red-50 disabled:opacity-60">
        {pending && <Loader2 className="animate-spin" size={16} aria-hidden />} Request account deletion
      </button>
    </form>
  );
}
