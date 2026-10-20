import type { ReactNode } from "react";
import { TriangleAlert } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { business, isConfirmed } from "@/lib/business";

/** Shows an owner-supplied business fact, highlighted while it is still a placeholder. */
export function Fact({ value }: { value: string }) {
  return isConfirmed(value) ? <>{value}</> : <span className="placeholder">{value}</span>;
}

export function SupportEmail() {
  return isConfirmed(business.supportEmail) ? (
    <a href={`mailto:${business.supportEmail}`}>{business.supportEmail}</a>
  ) : (
    <Fact value={business.supportEmail} />
  );
}

export function LegalPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title}>
        Last updated: <Fact value={business.legalUpdated} />
      </PageHero>
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        {/* OWNER: remove this banner only after a lawyer has reviewed the page and the placeholders are filled in. */}
        <div role="note" className="flex max-w-[72ch] gap-3 rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-950 ring-1 ring-amber-300">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" aria-hidden />
          <p>
            <strong>Draft for legal review.</strong> This page has not yet been reviewed by a lawyer and is not yet in
            force. Highlighted text still needs to be filled in.
          </p>
        </div>
        <div className="legal mt-8">{children}</div>
      </section>
    </>
  );
}
