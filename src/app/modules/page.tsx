import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { BookCover } from "@/components/BookCover";
import { ButtonLink } from "@/components/ui/Button";
import { ComingSoonGrid } from "@/components/ComingSoon";
import { formatPrice, planForBook } from "@/lib/plans";
import { atlasFacts } from "@/lib/molecular-atlas";
import { instagramUrl } from "@/lib/business";

export const metadata: Metadata = {
  title: "Modules",
  description:
    "Molecular Atlas is available now. Planned Alaskova Education modules cover industry careers, GMP, formulation, R&D, quality, regulatory affairs and more.",
  alternates: { canonical: "/modules" },
};

export default function ModulesPage() {
  const plan = planForBook("molecular-atlas")!;
  return (
    <>
      <PageHero eyebrow="Modules" title={<>Learn what’s <span className="gradient-text">behind the medicine.</span></>}>
        One module is available today. More are being planned, each designed to take pharmacy students beyond the
        curriculum.
      </PageHero>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20" aria-labelledby="available">
        <p className="eyebrow">Available now</p>
        <h2 id="available" className="h2 mt-3">Molecular Atlas</h2>
        <article className="mt-8 grid items-center gap-8 rounded-[1.75rem] bg-white p-6 shadow-card ring-1 ring-gold/40 sm:p-10 md:grid-cols-[12rem_1fr]">
          <BookCover book={{ title: "Molecular Atlas", subject: "Pharmaceutical organic chemistry", tone: 0 }} className="mx-auto w-44 md:w-full" />
          <div>
            <span className="inline-flex rounded-full bg-navy px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gold">
              Available now
            </span>
            <p className="mt-4 font-display text-2xl font-bold text-navy">Organic chemistry, taught through medicines.</p>
            <p className="mt-2 text-muted">
              An interactive pharmaceutical organic chemistry textbook and workbook: {atlasFacts.lessons} lessons,{" "}
              {atlasFacts.practiceProblems} practice problems and {atlasFacts.medicines} real medicines as worked examples.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <ButtonLink href="/molecular-atlas" size="lg">
                Explore Molecular Atlas <ArrowRight size={18} aria-hidden />
              </ButtonLink>
              <span className="text-sm text-muted">{formatPrice(plan.priceCents)}/month incl. GST · Cancel any time</span>
            </div>
          </div>
        </article>
      </section>

      <section id="coming-soon" className="scroll-mt-24 bg-paper py-14 lg:py-20" aria-labelledby="planned">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="eyebrow">Coming soon · Beyond the curriculum</p>
          <h2 id="planned" className="h2 mt-3">What we’re building next</h2>
          <p className="lead mt-4 max-w-3xl">
            These modules are in planning and not available yet.
          </p>
          <div className="mt-10"><ComingSoonGrid /></div>
          <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-white p-6 ring-1 ring-line sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-navy">Hear first when a module is released</h3>
              <p className="text-sm text-muted">
                Release updates go out on Instagram. Have a topic you’d like covered?{" "}
                <Link href="/support?topic=suggestion#contact" className="font-semibold text-gold-ink underline underline-offset-4">Tell us</Link>.
              </p>
            </div>
            <ButtonLink href={instagramUrl}>
              Follow @alaskova on Instagram
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
