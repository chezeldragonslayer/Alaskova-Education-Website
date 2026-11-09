"use client";

import { useSyncExternalStore } from "react";
import { Info } from "lucide-react";

/** Instagram and Facebook open links in their own built-in browser. */
export function isInAppBrowser(userAgent: string): boolean {
  return /Instagram|FBAN|FBAV|FB_IAB/i.test(userAgent);
}

const subscribe = () => () => {};
export function useInAppBrowser(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isInAppBrowser(navigator.userAgent),
    () => false, // server render: assume a normal browser
  );
}

const copy = {
  signin:
    "You’re in Instagram’s built-in browser, where Google sign-in doesn’t work. Sign up with your email below, or tap ⋯ and choose “Open in browser”.",
  reading:
    "You’re in Instagram’s built-in browser. Your progress in Molecular Atlas is saved in the browser you use, so for the best experience tap ⋯ and choose “Open in browser” before you start reading.",
};

/** Shows nothing in a normal browser. */
export function InAppBrowserNotice({ variant }: { variant: keyof typeof copy }) {
  const inApp = useInAppBrowser();
  if (!inApp) return null;
  return (
    <p role="note" className="mb-5 flex gap-3 rounded-xl bg-gold-soft px-4 py-3 text-sm text-navy ring-1 ring-gold/40">
      <Info size={18} className="mt-0.5 shrink-0 text-gold-ink" aria-hidden />
      <span>{copy[variant]}</span>
    </p>
  );
}
