import type { ReactNode } from "react";
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
        <div className="legal">{children}</div>
      </section>
    </>
  );
}
