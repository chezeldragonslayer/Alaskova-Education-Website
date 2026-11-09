import clsx from "clsx";
import { AtlasCover } from "@/components/MolecularAtlasMark";

/**
 * Cover design built from brand colours (not a photo of a printed book). Real covers (permitted uploads)
 * replace this in Phase 2 via Supabase Storage.
 */
const tones = [
  "from-navy-2 via-navy to-navy",
  "from-navy via-navy-2 to-navy",
  "from-navy-soft via-navy-2 to-navy",
  "from-navy-2 via-navy-soft to-navy-2",
  "from-navy via-navy to-navy-2",
];

export function BookCover({
  book,
  className,
  compact = false,
}: {
  book: { title: string; subject: string; tone: 0 | 1 | 2 | 3 | 4 };
  className?: string;
  /** Small thumbnails: drop the subject line and tighten the title. */
  compact?: boolean;
}) {
  // Molecular Atlas has its own designed front cover (logo mark, title, subtitle).
  if (book.title === "Molecular Atlas") return <AtlasCover className={className} compact={compact} />;
  return (
    <div
      role="img"
      aria-label={`Cover of ${book.title}`}
      className={clsx(
        "relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br text-white shadow-[0_10px_24px_-10px_rgb(15_30_61/0.55)]",
        compact ? "p-[8%]" : "p-[10%]",
        tones[book.tone],
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[7%] bg-gradient-to-r from-black/25 to-transparent"
      />
      <div
        aria-hidden
        className="absolute -right-1/4 -top-1/4 size-3/4 rounded-full bg-gold/15 blur-xl"
      />
      {/* Gold rules, like a cloth-bound textbook. */}
      <div aria-hidden className="absolute inset-x-[10%] top-[6%] h-px bg-gold/70" />
      <div aria-hidden className="absolute inset-x-[10%] bottom-[6%] h-px bg-gold/70" />
      <div className="relative flex h-full flex-col justify-between">
        <span className={clsx("font-semibold uppercase tracking-[0.2em] text-gold", compact ? "sr-only" : "text-[0.55rem]")}>
          {book.subject}
        </span>
        <span className={clsx("mt-auto font-display font-bold leading-tight tracking-tight", compact ? "line-clamp-4 text-[0.55rem] sm:text-[0.6rem]" : "text-[0.8rem] sm:text-sm")}>
          {book.title}
        </span>
      </div>
    </div>
  );
}
