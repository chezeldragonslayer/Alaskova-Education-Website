import type { ReactNode } from "react";
import { LogoSymbol } from "@/components/Logo";

/** The centred white card used by the sign-in and password pages. */
export function AuthCard({ title, intro, children }: { title: string; intro: ReactNode; children: ReactNode }) {
  return (
    <section className="relative isolate grid min-h-[calc(100dvh-4.5rem)] place-items-center overflow-hidden px-5 py-12">
      <div aria-hidden className="aurora absolute inset-0 -z-10" />
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div className="w-full max-w-md rounded-[1.75rem] bg-white p-7 shadow-lift ring-1 ring-line sm:p-9">
        <LogoSymbol size={56} />
        <h1 className="h3 mt-5 !text-[1.75rem]">{title}</h1>
        <p className="mt-1.5 mb-7 text-muted">{intro}</p>
        {children}
      </div>
    </section>
  );
}
