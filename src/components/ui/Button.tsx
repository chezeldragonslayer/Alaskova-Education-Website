import Link from "next/link";
import clsx from "clsx";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap select-none transition-all duration-300 ease-[var(--ease-alaskova)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-ocean text-white shadow-[0_1px_0_rgb(255_255_255/0.25)_inset,0_8px_20px_-8px_rgb(23_107_192/0.8)] hover:bg-steel hover:shadow-glow hover:-translate-y-0.5",
  secondary:
    "bg-white text-midnight ring-1 ring-line shadow-card hover:ring-ocean/40 hover:-translate-y-0.5",
  ghost: "text-steel hover:bg-mist-2",
  inverse:
    "bg-white text-midnight shadow-card hover:-translate-y-0.5 hover:shadow-lift",
};

type Common = { variant?: Variant; size?: Size; className?: string };

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Common & ComponentProps<typeof Link>) {
  return (
    <Link
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Common & ComponentProps<"button">) {
  return (
    <button
      className={clsx(base, sizes[size], variants[variant], className)}
      {...props}
    />
  );
}
