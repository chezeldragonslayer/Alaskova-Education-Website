"use client"; // Error boundaries must be Client Components

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // In production the message is generic; the digest matches the server log entry.
    console.error(error.digest ?? error.message);
  }, [error]);

  return (
    <section className="grid min-h-[60vh] place-items-center px-5 py-20 text-center">
      <div>
        <p className="eyebrow">Something went wrong</p>
        <h1 className="h2 mt-3">This page didn’t load properly.</h1>
        <p className="lead mx-auto mt-4 max-w-md">
          It’s usually temporary. Try again, and if it keeps happening, let us know.
          {error.digest && <span className="mt-2 block text-sm">Reference: {error.digest}</span>}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button onClick={() => retry()} className="inline-flex h-11 items-center rounded-xl bg-ocean px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-steel">
            Try again
          </button>
          <Link href="/support#contact" className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-[0.9375rem] font-semibold text-midnight ring-1 ring-line">
            Contact support
          </Link>
        </div>
      </div>
    </section>
  );
}
