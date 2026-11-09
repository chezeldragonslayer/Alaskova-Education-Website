import clsx from "clsx";

/**
 * The Molecular Atlas logo mark (designed November 2026): a benzene ring, the most recognisable shape in organic
 * chemistry, drawn with its alternating double bonds, and a four-point compass star at its centre for "Atlas".
 * A standalone copy with the wordmark is in public/atlas/molecular-atlas-logo.svg.
 */
export function MolecularAtlasMark({
  onDark = false,
  className,
  title,
}: {
  /** On navy: white ring. On light backgrounds: navy ring. Bonds and star are gold either way. */
  onDark?: boolean;
  className?: string;
  /** Give a title when the mark stands alone; leave empty when the words "Molecular Atlas" are next to it. */
  title?: string;
}) {
  const ring = onDark ? "#ffffff" : "#0f1e3d";
  const gold = onDark ? "#c69732" : "#85621a";
  return (
    <svg
      viewBox="0 0 100 100"
      className={clsx("block", className)}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="none"
    >
      <path
        d="M50 16 L79.44 33 L79.44 67 L50 84 L20.56 67 L20.56 33 Z"
        stroke={ring}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <g stroke={gold} strokeWidth="4" strokeLinecap="round">
        <path d="M53.05 26.6 L68.74 35.66" />
        <path d="M68.74 64.34 L53.05 73.4" />
        <path d="M28.21 59.06 L28.21 40.94" />
      </g>
      <path
        d="M50 37 L53.4 46.6 L63 50 L53.4 53.4 L50 63 L46.6 53.4 L37 50 L46.6 46.6 Z"
        fill={gold}
      />
    </svg>
  );
}

/**
 * The Molecular Atlas "front page": navy cover with gold rules, the mark, title and subtitle.
 * Sizes use container units (cqw), so the layout stays balanced at any cover width.
 */
export function AtlasCover({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      role="img"
      aria-label="Molecular Atlas cover"
      className={clsx(
        "@container relative aspect-[3/4] overflow-hidden rounded-lg bg-gradient-to-br from-navy-2 via-navy to-navy text-white shadow-[0_10px_24px_-10px_rgb(15_30_61/0.55)]",
        className,
      )}
    >
      <div className="absolute inset-0 flex flex-col items-center px-[9cqw] pb-[11cqw] pt-[16cqw] text-center">
        <MolecularAtlasMark onDark className={compact ? "w-[52cqw]" : "w-[40cqw]"} />
        <p
          className={clsx("font-display font-bold leading-[1.02]", compact ? "mt-[7cqw] text-[13cqw]" : "mt-[8cqw] text-[12.5cqw]")}
          style={{ fontStretch: "87.5%" }}
        >
          Molecular
          <br />
          Atlas
        </p>
        {!compact && (
          <p className="mt-[5cqw] text-[3.6cqw] font-semibold uppercase leading-snug tracking-[0.18em] text-gold">
            Pharmaceutical
            <br />
            organic chemistry
          </p>
        )}
        {!compact && (
          <p className="mt-auto text-[3.2cqw] font-semibold uppercase tracking-[0.28em] text-white/70">Alaskova Education</p>
        )}
      </div>
      <div aria-hidden className="absolute inset-y-0 left-0 w-[6%] bg-gradient-to-r from-black/30 to-transparent" />
      <div aria-hidden className="absolute inset-x-[9%] top-[5%] h-px bg-gold/80" />
      <div aria-hidden className="absolute inset-x-[9%] top-[6.5%] h-px bg-gold/40" />
      <div aria-hidden className="absolute inset-x-[9%] bottom-[6.5%] h-px bg-gold/40" />
      <div aria-hidden className="absolute inset-x-[9%] bottom-[5%] h-px bg-gold/80" />
    </div>
  );
}
