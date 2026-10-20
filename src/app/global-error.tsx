"use client"; // Replaces the root layout when the layout itself fails, so it carries its own document and styles.

import "./globals.css";

export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en-AU">
      <body className="grid min-h-screen place-items-center bg-white px-5 text-center text-midnight">
        <title>Something went wrong · Alaskova Education</title>
        <main>
          <p className="eyebrow">Alaskova Education</p>
          <h1 className="h2 mt-3">Something went wrong.</h1>
          <p className="lead mx-auto mt-4 max-w-md">
            Please try again in a moment.
            {error.digest && <span className="mt-2 block text-sm">Reference: {error.digest}</span>}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => retry()} className="inline-flex h-11 items-center rounded-xl bg-ocean px-5 font-semibold text-white">
              Try again
            </button>
            {/* A plain <a>: the app's router may be what failed. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="inline-flex h-11 items-center rounded-xl px-5 font-semibold text-midnight ring-1 ring-line">Home</a>
          </div>
        </main>
      </body>
    </html>
  );
}
