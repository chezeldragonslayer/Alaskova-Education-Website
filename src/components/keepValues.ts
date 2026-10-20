"use client";

import { startTransition, type FormEvent } from "react";

/**
 * React resets a form after its action runs, which wipes what the person typed when the server answers with an error
 * ("Incorrect email or password", "message too short"). Submitting through this handler runs the same action without
 * that reset. Keep `action={action}` on the form as well, so the form still works if JavaScript hasn't loaded.
 */
export function keepValues(action: (formData: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };
}
