import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BookCover } from "./BookCover";
import { formatPrice, planForBook } from "@/lib/plans";
import type { CatalogueBook } from "@/lib/catalogue";

export function BookCard({ book }: { book: CatalogueBook }) {
  const plan = planForBook(book.slug);
  return (
    <article className="group relative flex flex-col rounded-2xl bg-white p-5 shadow-card ring-1 ring-line transition-all duration-300 focus-within:ring-2 focus-within:ring-bright hover:-translate-y-1.5 hover:shadow-lift">
      <BookCover
        book={{ title: book.title, subject: book.subjects[0], tone: book.tone }}
        className="transition-transform duration-500 group-hover:scale-[1.03]"
      />
      <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Subjects">
        {book.subjects.map((s) => (
          <li key={s} className="rounded-full bg-mist-2 px-2.5 py-0.5 text-xs font-medium text-steel">
            {s}
          </li>
        ))}
      </ul>
      <h2 className="mt-3 font-display text-lg font-semibold tracking-tight">
        <Link href={`/catalogue/${book.slug}`} className="after:absolute after:inset-0 focus:outline-none">
          {book.title}
        </Link>
      </h2>
      <p className="mt-1 text-sm text-muted">{book.publisher}</p>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-sm">
        <span className="font-semibold text-midnight">
          {plan ? `${formatPrice(plan.priceCents)}/month` : "Coming soon"}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-ocean">
          View details <ArrowUpRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
}
