import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[60vh] place-items-center overflow-hidden px-5 py-20 text-center">
      <div aria-hidden className="aurora absolute inset-0 -z-10" />
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="h2 mt-3">We couldn’t find that page.</h1>
        <p className="lead mx-auto mt-4 max-w-md">The link may be old or mistyped. These will get you back on track:</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Home</ButtonLink>
          <ButtonLink href="/dashboard" variant="secondary" prefetch={false}>My library</ButtonLink>
          <ButtonLink href="/support" variant="secondary">Support</ButtonLink>
        </div>
      </div>
    </section>
  );
}
