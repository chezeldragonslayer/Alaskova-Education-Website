import clsx from "clsx";
import type { DemoBook } from "@/lib/demo";

/**
 * Placeholder cover built from brand colours. Real covers (permitted uploads)
 * replace this in Phase 2 via Supabase Storage.
 */
const tones = [
  "from-deep via-steel to-ocean",
  "from-midnight via-deep to-steel",
  "from-ocean via-bright to-ocean",
  "from-steel via-ocean to-bright",
  "from-midnight via-steel to-deep",
];

export function BookCover({
  book,
  className,
  compact = false,
}: {
  book: Pick<DemoBook, "title" | "subject" | "tone">;
  className?: string;
  /** Small thumbnails: drop the subject line and tighten the title. */
  compact?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={`Demonstration cover for ${book.title}`}
      className={clsx(
        "relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br text-white shadow-[0_10px_24px_-10px_rgb(3_32_72/0.55)]",
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
        className="absolute -right-1/4 -top-1/4 size-3/4 rounded-full bg-white/10 blur-xl"
      />
      <div className="relative flex h-full flex-col justify-between">
        <span className={clsx("font-semibold uppercase tracking-[0.18em] text-white/75", compact ? "sr-only" : "text-[0.55rem]")}>
          {book.subject}
        </span>
        <span className={clsx("mt-auto font-display font-bold leading-tight tracking-tight", compact ? "line-clamp-4 text-[0.55rem] sm:text-[0.6rem]" : "text-[0.8rem] sm:text-sm")}>
          {book.title}
        </span>
      </div>
    </div>
  );
}
