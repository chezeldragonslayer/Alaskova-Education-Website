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
      src="/brand/alaskova-symbol.png"
      alt=""
      width={size}
      height={Math.round(size * (617 / 814))}
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
      src="/brand/alaskova-logo-master.png"
      alt="Alaskova Education"
      width={w}
      height={Math.round(w * (1054 / 1405))}
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
      aria-label="Alaskova Education — home"
      className={clsx("flex items-center gap-2.5", className)}
    >
      <LogoSymbol size={56} />
    </Link>
  );
}
