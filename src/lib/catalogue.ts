/**
 * REAL catalogue entries (supplied by the owner). Replaced by database rows in
 * Phase 2 (editable in the admin area); keep field names aligned with the
 * future `textbooks` table. Only facts the owner has confirmed belong here —
 * no invented authors, editions, ISBNs or publication years.
 */
export type CatalogueBook = {
  slug: string;
  title: string;
  subjects: string[];
  publisher: string;
  /** Short blurb — owner will edit this later (admin CMS). */
  description: string;
  tone: 0 | 1 | 2 | 3 | 4;
  /** Optional metadata: render only when present. */
  author?: string;
  isbn?: string;
  edition?: string;
  publicationYear?: number;
};

export const catalogue: CatalogueBook[] = [
  {
    slug: "molecular-atlas",
    title: "Molecular Atlas",
    subjects: ["Organic Chemistry", "Pharmaceutical Chemistry"],
    publisher: "Alaskova Education",
    description:
      "A textbook covering organic and pharmaceutical chemistry. (Placeholder description — to be replaced with the final text.)",
    tone: 1,
  },
];

export const allSubjects = Array.from(
  new Set(catalogue.flatMap((b) => b.subjects)),
).sort();

export function getBook(slug: string) {
  return catalogue.find((b) => b.slug === slug);
}

export function searchCatalogue(q?: string, subject?: string) {
  const term = (q ?? "").trim().toLowerCase();
  return catalogue.filter((b) => {
    if (subject && !b.subjects.includes(subject)) return false;
    if (!term) return true;
    const hay = [b.title, b.description, b.author, b.isbn, ...b.subjects]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return term.split(/\s+/).every((t) => hay.includes(t));
  });
}
