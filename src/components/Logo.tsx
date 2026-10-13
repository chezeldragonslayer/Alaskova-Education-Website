import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

/**
 * Official artwork only — never recreated in CSS/type.
 * The source PNGs have an opaque white background (not transparent),
 * so the full logo is always placed on a white surface with clear space.
 */
export function LogoSymbol({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/apex-symbol.png"
      alt=""
      width={size}
      height={Math.round(size * (356 / 442))}
      className={clsx("h-auto", className)}
      style={{ width: size }}
      priority
    />
  );
}

export function LogoFull({
  width = 200,
  className,
}: {
  width?: number;
  className?: string;
}) {
  // Guideline: min 160px wide for the stacked logo.
  const w = Math.max(width, 160);
  return (
    <Image
      src="/brand/apex-logo-master.png"
      alt="Apex Education"
      width={w}
      height={w}
      sizes={`${w}px`}
      className={clsx("h-auto", className)}
      style={{ width: w }}
    />
  );
}

export function HomeLink({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Apex Education — home"
      className={clsx("flex items-center gap-2.5", className)}
    >
      <LogoSymbol size={46} />
    </Link>
  );
}
