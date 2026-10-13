import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div aria-hidden className="aurora absolute inset-0 -z-10" />
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 lg:pb-20 lg:pt-20">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h1 mt-4 max-w-3xl">{title}</h1>
        {children && <div className="lead mt-5 max-w-2xl">{children}</div>}
      </div>
    </section>
  );
}
