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
    subjects: ["Organic Chemistry", "Medicinal Chemistry"],
    publisher: "Alaskova Education",
    description:
      "An interactive pharmaceutical organic chemistry textbook. Across 229 lessons in ten modules, Molecular Atlas takes you from the foundations of organic chemistry through mechanisms, functional groups and spectroscopy to medicinal chemistry and drug design, using more than 160 real medicines as worked examples. It is built around 14 core rules that explain why reactions happen, with more than 700 practice problems to test yourself as you go.",
    tone: 1,
  },
];

export const allSubjects = Array.from(
  new Set(catalogue.flatMap((b) => b.subjects)),
).sort();

/** Where a book's sales page lives. */
export const bookPath = (slug: string) => (slug === "molecular-atlas" ? "/molecular-atlas" : "/modules");

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
