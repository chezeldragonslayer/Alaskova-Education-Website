"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Search } from "lucide-react";

/** Hands the query to /catalogue, which searches titles and subjects. */
export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.trim()) p.set("q", q.trim());
    const qs = p.toString();
    router.push(qs ? `/catalogue?${qs}` : "/catalogue");
  };

  return (
    <form onSubmit={submit} role="search" aria-label="Search textbooks" className="w-full max-w-xl">
      <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lift ring-1 ring-line transition-shadow focus-within:ring-2 focus-within:ring-bright">
        <Search className="ml-3 shrink-0 text-steel" size={20} aria-hidden />
        <label htmlFor="hero-q" className="sr-only">
          Search by title or subject
        </label>
        <input
          id="hero-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title or subject"
          className="h-11 min-w-0 flex-1 bg-transparent text-base text-midnight placeholder:text-muted/80 focus:outline-none"
          autoComplete="off"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-ocean px-4 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-steel"
        >
          <span className="hidden sm:inline">Find textbooks</span>
          <span className="sm:hidden">Search</span>
          <ArrowRight size={16} aria-hidden />
        </button>
      </div>
    </form>
  );
}
