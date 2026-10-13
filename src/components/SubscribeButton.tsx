import clsx from "clsx";
import type { ReactNode } from "react";

/** Plain HTML form → POST /api/stripe/checkout (works without JavaScript). */
export function SubscribeButton({
  slug,
  children = "Subscribe",
  className,
}: {
  slug: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <form action="/api/stripe/checkout" method="post">
      <input type="hidden" name="book" value={slug} />
      <button
        className={clsx(
          "inline-flex h-13 w-full items-center justify-center rounded-xl bg-ocean px-7 text-base font-semibold text-white shadow-[0_8px_20px_-8px_rgb(23_107_192/0.8)] transition-all hover:-translate-y-0.5 hover:bg-steel active:scale-[0.98]",
          className,
        )}
      >
        {children}
      </button>
    </form>
  );
}
