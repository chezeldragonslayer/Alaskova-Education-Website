import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import clsx from "clsx";
import { Search, SearchX } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { BookCard } from "@/components/BookCard";
import { allSubjects, searchCatalogue } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Textbook catalogue",
  description: "Browse Apex Education's digital textbooks by subject and read them online with a subscription.",
  alternates: { canonical: "/catalogue" },
};

type SP = { q?: string; subject?: string };

function ResultsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16" aria-busy="true" aria-label="Loading textbooks">
      <div className="skeleton h-[3.75rem] max-w-2xl rounded-2xl" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="skeleton h-96 rounded-2xl" />
      </div>
    </div>
  );
}

export default function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  return (
    <>
      <PageHero eyebrow="Textbook catalogue" title={<>Find your <span className="gradient-text">textbook.</span></>}>
        Search by title or subject and see what’s included before you subscribe.
      </PageHero>
      <Suspense fallback={<ResultsSkeleton />}>
        <CatalogueResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function CatalogueResults({ searchParams }: { searchParams: Promise<SP> }) {
  const { q = "", subject = "" } = await searchParams;
  const results = searchCatalogue(q, subject || undefined);
  const href = (s: string) => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (s) p.set("subject", s);
    const qs = p.toString();
    return qs ? `/catalogue?${qs}` : "/catalogue";
  };

  return (
    <>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <form action="/catalogue" role="search" className="flex max-w-2xl items-center gap-2 rounded-2xl bg-white p-2 shadow-card ring-1 ring-line focus-within:ring-2 focus-within:ring-bright">
          <Search className="ml-3 shrink-0 text-steel" size={20} aria-hidden />
          <label htmlFor="cat-q" className="sr-only">Search textbooks</label>
          <input id="cat-q" name="q" defaultValue={q} placeholder="Search by title or subject" className="h-11 min-w-0 flex-1 bg-transparent text-base placeholder:text-muted/80 focus:outline-none" autoComplete="off" />
          {subject && <input type="hidden" name="subject" value={subject} />}
          <button className="h-11 rounded-xl bg-ocean px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-steel">Search</button>
        </form>

        <nav aria-label="Filter by subject" className="mt-5 flex flex-wrap gap-2">
          {["", ...allSubjects].map((s) => (
            <Link
              key={s || "all"}
              href={href(s)}
              aria-current={subject === s ? "true" : undefined}
              className={clsx(
                "rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium ring-1 transition-colors",
                subject === s ? "bg-midnight text-white ring-midnight" : "bg-white text-steel ring-line hover:ring-ocean/50",
              )}
            >
              {s || "All subjects"}
            </Link>
          ))}
        </nav>

        <p className="mt-8 text-sm text-muted" aria-live="polite">
          {results.length} {results.length === 1 ? "textbook" : "textbooks"}
          {q && <> matching “{q}”</>}
          {subject && <> in {subject}</>}
        </p>

        {results.length ? (
          <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {results.map((b) => (
              <li key={b.slug}><BookCard book={b} /></li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 grid place-items-center rounded-2xl bg-mist px-6 py-16 text-center ring-1 ring-line">
            <SearchX className="text-steel" size={32} aria-hidden />
            <h2 className="h3 mt-4">No textbooks found</h2>
            <p className="mt-2 max-w-sm text-muted">Try a different title or subject, or clear your filters.</p>
            <Link href="/catalogue" className="mt-5 font-semibold text-ocean underline underline-offset-4">Clear search</Link>
          </div>
        )}
      </section>
    </>
  );
}
