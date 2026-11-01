import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

/**
 * Official artwork only (logo pack revision 4), never recreated in CSS or type.
 * The PNGs have OPAQUE backgrounds: the colour and navy logos are on pure white, the reversed logo on navy #0F1E3D.
 * So place colour/navy logos only on white surfaces, and the reversed logo only on bg-navy.
 */
const HORIZONTAL_RATIO = 667 / 1600; // height / width of the horizontal files

export function LogoEmblem({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/alaskova-emblem.png"
      alt=""
      width={size}
      height={size}
      sizes={`${size}px`}
      className={className}
      priority
    />
  );
}

export function LogoHorizontal({
  width = 180,
  variant = "colour",
  className,
  priority = false,
}: {
  width?: number;
  /** colour: navy + gold on white. reversed: white on navy. navy: single-colour navy on white. */
  variant?: "colour" | "reversed" | "navy";
  className?: string;
  priority?: boolean;
}) {
  const src = {
    colour: "/brand/alaskova-horizontal.png",
    reversed: "/brand/alaskova-horizontal-reversed.png",
    navy: "/brand/alaskova-horizontal-navy.png",
  }[variant];
  return (
    <Image
      src={src}
      alt="Alaskova Education"
      width={width}
      height={Math.round(width * HORIZONTAL_RATIO)}
      sizes={`${width}px`}
      className={clsx("h-auto", className)}
      style={{ width }}
      priority={priority}
    />
  );
}

export function LogoStacked({ width = 220, className }: { width?: number; className?: string }) {
  return (
    <Image
      src="/brand/alaskova-stacked.png"
      alt="Alaskova Education"
      width={width}
      height={width}
      sizes={`${width}px`}
      className={className}
    />
  );
}

export function HomeLink({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="Alaskova Education — home" className={clsx("flex items-center", className)}>
      <LogoHorizontal width={150} priority className="w-[124px] sm:w-[150px]" />
    </Link>
  );
}
