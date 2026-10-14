"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** Copies text to the clipboard and confirms to screen readers. Falls back to selecting nothing if blocked. */
export function CopyButton({ text, label = "Copy link" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {
          /* clipboard blocked: the link is still visible to copy by hand */
        }
      }}
      className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-midnight shadow-card ring-1 ring-line transition-all hover:-translate-y-0.5"
    >
      {done ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
      {done ? "Copied" : label}
      <span className="sr-only" role="status">{done ? "Link copied to clipboard" : ""}</span>
    </button>
  );
}
