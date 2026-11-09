import type { Metadata } from "next";
import { Check } from "lucide-react";
import { BookCover } from "@/components/BookCover";
import { Faq } from "@/components/Faq";
import { AtlasAccess } from "@/components/AtlasAccess";
import {
  AtlasCurriculum,
  AtlasDifference,
  AtlasFacts,
  AtlasHighlights,
  AtlasPricing,
  AtlasQuestions,
  AtlasScreenshots,
  AtlasSteps,
  AtlasTools,
} from "@/components/atlas/Sections";
import { atlasFaqs } from "@/lib/faqs";
import { atlasScreenshots } from "@/lib/molecular-atlas";
import { formatPrice, planForBook } from "@/lib/plans";
import { getBook } from "@/lib/catalogue";

const book = getBook("molecular-atlas")!;
const plan = planForBook("molecular-atlas")!;
const price = formatPrice(plan.priceCents);

export const metadata: Metadata = {
  title: "Molecular Atlas: pharmaceutical organic chemistry",
  description: `An interactive pharmaceutical organic chemistry textbook for pharmacy students: 229 lessons, 700+ practice problems and 160+ real medicines. ${price}/month incl. GST, cancel any time.`,
  alternates: { canonical: "/molecular-atlas" },
  openGraph: {
    title: "Molecular Atlas · Alaskova Education",
    description: "Organic chemistry, taught through medicines. Built by a pharmacy student, for pharmacy students.",
  },
};

type SP = Promise<Record<string, string | undefined>>;

export default function MolecularAtlasPage({ searchParams }: { searchParams: SP }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    description: book.description,
    publisher: { "@type": "Organization", name: book.publisher },
    offers: { "@type": "Offer", price: (plan.priceCents / 100).toFixed(2), priceCurrency: "AUD" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      {/* HERO: answer what / who / price / how to start in one screen on a phone */}
      <section className="relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="aurora absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 pb-12 pt-6 sm:gap-10 sm:px-8 sm:pt-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16 lg:pb-20 lg:pt-16">
          <div className="min-w-0">
            <p className="eyebrow">Workbook 01 · Available now</p>
            <h1 className="h1 mt-3">Molecular Atlas</h1>
            <p className="mt-3 font-display text-xl font-bold text-navy-2 sm:text-2xl">Organic chemistry, taught through medicines.</p>
            <p className="mt-3 max-w-xl text-navy-soft">
              An interactive pharmaceutical organic chemistry textbook for pharmacy students: 229 lessons, 700+ practice
              problems and 160+ real medicines.
            </p>
            <ul className="mt-6 hidden gap-2 text-[0.9375rem] text-navy sm:grid sm:grid-cols-2">
              {["Designed for pharmacy students", "Interactive molecules and mechanisms", "Practice, checkpoints and a final exam", "Learn at your own pace"].map((t) => (
                <li key={t} className="flex gap-2"><Check size={18} className="mt-0.5 shrink-0 text-gold-ink" aria-hidden />{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.75rem] bg-white p-5 shadow-lift ring-1 ring-line sm:p-8">
            <div className="flex items-center gap-5">
              <BookCover book={{ title: "Molecular Atlas", subject: "Pharmaceutical organic chemistry", tone: 0 }} compact className="w-20 shrink-0" />
              <div>
                <p className="font-display text-4xl font-bold text-navy">
                  {price}<span className="text-base font-medium text-muted"> / month</span>
                </p>
                <p className="text-sm text-muted">Includes GST · Cancel any time</p>
              </div>
            </div>
            <div className="mt-5"><AtlasAccess searchParams={searchParams} /></div>
            <p className="mt-3 text-center text-xs text-muted">New here? You’ll create a free account first, then pay securely with Stripe.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20">
        <p className="lead max-w-3xl">{book.description}</p>
        <div className="mt-8"><AtlasFacts /></div>
      </section>

      {atlasScreenshots.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8" aria-labelledby="inside">
          <h2 id="inside" className="h2">Inside Molecular Atlas</h2>
          <div className="mt-8"><AtlasScreenshots /></div>
        </section>
      )}

      <section className="bg-paper py-14 lg:py-20" aria-labelledby="why-care">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="eyebrow">Why pharmacy students use it</p>
          <h2 id="why-care" className="h2 mt-3 max-w-3xl">The chemistry behind the medicines you’ll dispense, counsel on and one day improve.</h2>
          <div className="mt-10"><AtlasHighlights /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20" aria-labelledby="questions">
        <p className="eyebrow">Real questions</p>
        <h2 id="questions" className="h2 mt-3">Questions you’ll work through</h2>
        <div className="mt-10"><AtlasQuestions /></div>
      </section>

      <section className="on-dark bg-navy py-14 text-white lg:py-20" aria-labelledby="different">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="eyebrow !text-gold">How it’s different</p>
          <h2 id="different" className="h2 mt-3 text-white">Understand it, don’t just memorise it.</h2>
          <div className="mt-10"><AtlasDifference /></div>
          <div className="mt-12">
            <h3 className="font-display text-lg font-bold text-white">Interactive tools inside the book</h3>
            <div className="mt-4 [&_li]:bg-white/5 [&_li]:text-white [&_li]:ring-white/20 [&_svg]:text-gold"><AtlasTools /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20" aria-labelledby="curriculum">
        <p className="eyebrow">What you’ll learn</p>
        <h2 id="curriculum" className="h2 mt-3">10 modules, from foundations to drug design</h2>
        <div className="mt-10"><AtlasCurriculum /></div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 bg-paper py-14 lg:py-20" aria-labelledby="how">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="eyebrow">How it works</p>
          <h2 id="how" className="h2 mt-3">From Instagram to your first lesson in minutes</h2>
          <div className="mt-10"><AtlasSteps /></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20" aria-labelledby="pricing">
        <h2 id="pricing" className="sr-only">Pricing</h2>
        <AtlasPricing />
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:pb-28" aria-labelledby="faq">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq" className="h2 mt-3">Before you subscribe</h2>
        </div>
        <Faq items={atlasFaqs} />
      </section>
    </>
  );
}
