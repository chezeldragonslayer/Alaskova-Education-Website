import Image from "next/image";
import { ArrowRight, Compass, Lightbulb, Microscope, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/Reveal";
import { Faq } from "@/components/Faq";
import { BookCover } from "@/components/BookCover";
import { ComingSoonGrid } from "@/components/ComingSoon";
import {
  AtlasDifference,
  AtlasFacts,
  AtlasHighlights,
  AtlasPricing,
  AtlasQuestions,
  AtlasScreenshots,
  AtlasTools,
} from "@/components/atlas/Sections";
import { atlasFaqs } from "@/lib/faqs";
import { formatPrice, planForBook } from "@/lib/plans";
import { atlasQuestions, atlasScreenshots } from "@/lib/molecular-atlas";
import { instagramUrl } from "@/lib/business";

const plan = planForBook("molecular-atlas")!;
const price = formatPrice(plan.priceCents);

const pillars = [
  { icon: Microscope, t: "Deep scientific understanding", d: "Reasoning from first principles, not memorising lists." },
  { icon: Compass, t: "Industry-relevant education", d: "Connecting what you study to how medicines are discovered, made and regulated." },
  { icon: Lightbulb, t: "Curiosity and critical thinking", d: "Asking why a medicine looks and behaves the way it does." },
  { icon: Users, t: "Student empowerment", d: "Built by a pharmacy student, shaped by what students tell us they need." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO: who we are, the product, the price, one main action */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="aurora absolute inset-0 -z-10" />
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:pb-24 lg:pt-16">
          <div className="min-w-0">
            <Reveal>
              <p className="eyebrow">Alaskova Education</p>
              <span className="gold-rule mt-3" aria-hidden />
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="h1 mt-5 text-navy">Built by a pharmacy student, for pharmacy students.</h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 font-display text-xl font-bold text-navy-2 sm:text-2xl">
                Understand the science behind medicines. Go beyond the pharmacy curriculum.
              </p>
              <p className="lead mt-4 max-w-xl">
                Discover interactive pharmaceutical education that connects molecular chemistry to real medicines,
                strengthens your scientific understanding, and prepares you to think beyond traditional pharmacy practice.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/molecular-atlas" size="lg">
                  Explore Molecular Atlas <ArrowRight size={18} aria-hidden />
                </ButtonLink>
                <ButtonLink href="/modules#coming-soon" variant="secondary" size="lg">
                  See what’s coming
                </ButtonLink>
              </div>
              <p className="mt-4 text-sm text-muted">
                Molecular Atlas: {price}/month including GST · Cancel any time · Secure checkout by Stripe
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="relative mx-auto w-full max-w-sm">
            <BookCover
              book={{ title: "Molecular Atlas", subject: "Pharmaceutical organic chemistry", tone: 0 }}
              className="mx-auto w-56 sm:w-64"
            />
            <div className="relative -mt-10 ml-auto w-[88%] rounded-2xl bg-white p-5 shadow-lift ring-1 ring-line">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">A question you’ll work through</p>
              <p className="mt-2 font-display text-lg font-bold leading-snug text-navy">“{atlasQuestions[1].q}”</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MOLECULAR ATLAS: what it is */}
      <section className="bg-paper py-16 lg:py-24" aria-labelledby="atlas">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <p className="eyebrow">Available now</p>
            <h2 id="atlas" className="h2 mt-3">Molecular Atlas</h2>
            <p className="lead mt-4">
              An interactive digital organic chemistry textbook and workbook, designed for pharmacy students. Learn the
              chemistry behind how medicines work, why they are selective, and how their structure shapes the way they
              behave in the body.
            </p>
          </Reveal>
          <div className="mt-10"><AtlasFacts /></div>
          <div className="mt-10"><AtlasHighlights /></div>
          <div className="mt-10">
            <ButtonLink href="/molecular-atlas" size="lg">
              See what’s inside <ArrowRight size={18} aria-hidden />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* WHY IT MATTERS: real questions */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="questions">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Why it matters to a pharmacy student</p>
          <h2 id="questions" className="h2 mt-3">Questions you’ll learn to answer</h2>
          <p className="lead mt-4">
            Chemistry explains a great deal about medicines, though not everything. Molecular Atlas shows you how far the
            chemistry goes, and where pharmacology and clinical judgement take over.
          </p>
        </Reveal>
        <div className="mt-10"><AtlasQuestions /></div>
      </section>

      {/* HOW IT'S DIFFERENT */}
      <section className="on-dark bg-navy py-16 text-white lg:py-24" aria-labelledby="different">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="eyebrow !text-gold">How it’s different</p>
          <h2 id="different" className="h2 mt-3 text-white">Not another organic chemistry textbook.</h2>
          <div className="mt-10"><AtlasDifference /></div>
          <div className="mt-12">
            <h3 className="font-display text-lg font-bold text-white">Interactive tools inside the book</h3>
            <div className="mt-4 [&_li]:bg-white/5 [&_li]:text-white [&_li]:ring-white/20 [&_svg]:text-gold"><AtlasTools /></div>
          </div>
        </div>
      </section>

      {atlasScreenshots.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="inside">
          <h2 id="inside" className="h2">Inside Molecular Atlas</h2>
          <div className="mt-8"><AtlasScreenshots /></div>
        </section>
      )}

      {/* PRICE */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="price">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Simple pricing</p>
          <h2 id="price" className="h2 mt-3">One book. One monthly price.</h2>
          <p className="lead mt-4">Learn at your own pace. Cancel any time, and subscribe again whenever you need it.</p>
        </Reveal>
        <div className="mt-10"><AtlasPricing /></div>
      </section>

      {/* WHY ALASKOVA EXISTS */}
      <section className="bg-paper py-16 lg:py-24" aria-labelledby="why">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">Why Alaskova exists</p>
            <h2 id="why" className="h2 mt-3">Pharmacy education should inspire more than memorisation.</h2>
            <p className="lead mt-4">
              Alaskova connects foundational science with the pharmaceutical industry, research, and the possibilities of
              creating better medicines.
            </p>
            <ButtonLink href="/about" variant="secondary" className="mt-6">Read our mission</ButtonLink>
          </Reveal>
          <ul className="grid gap-4 sm:grid-cols-2">
            {pillars.map(({ icon: Icon, t, d }) => (
              <li key={t} className="rounded-2xl bg-white p-5 ring-1 ring-line">
                <Icon className="text-gold-ink" size={22} aria-hidden />
                <h3 className="mt-3 font-display text-lg font-bold text-navy">{t}</h3>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* COMING SOON (clearly not for sale) */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="coming">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">Beyond the curriculum</p>
          <h2 id="coming" className="h2 mt-3">What we’re building next</h2>
          <p className="lead mt-4">
            Future modules on the parts of pharmacy that happen beyond the dispensary. They’re in planning and not available
            yet.
          </p>
        </Reveal>
        <div className="mt-10"><ComingSoonGrid limit={3} showAll={false} /></div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/modules#coming-soon" variant="secondary">See all planned modules</ButtonLink>
          <ButtonLink href={instagramUrl} variant="ghost">Follow @alaskova for release updates</ButtonLink>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="bg-paper py-16 lg:py-20" aria-labelledby="founder">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 px-5 text-center sm:px-8 md:flex-row md:text-left">
          <Image
            src="/about/chelsea.jpg"
            alt="Chelsea, founder of Alaskova Education"
            width={160}
            height={160}
            sizes="160px"
            className="size-36 shrink-0 rounded-full object-cover object-[55%_25%] ring-4 ring-white shadow-card"
          />
          <div>
            <h2 id="founder" className="sr-only">From the founder</h2>
            <p className="font-display text-2xl font-bold leading-snug text-navy">
              “I want my ambition to give other people permission to be ambitious.”
            </p>
            <p className="mt-3 text-sm font-medium text-navy-soft">Chelsea · Intern Pharmacist · Founder of Alaskova Education</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.6fr] lg:py-24" aria-labelledby="faq">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2 id="faq" className="h2 mt-3">Questions, answered.</h2>
          <ButtonLink href="/support" variant="secondary" className="mt-6">Visit support</ButtonLink>
        </div>
        <Faq items={atlasFaqs} />
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-20 sm:px-8 lg:pb-28">
        <div className="on-dark relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy via-navy-2 to-navy px-6 py-14 text-center text-white shadow-lift sm:px-12 lg:py-20">
          <h2 className="h2 mx-auto max-w-2xl text-white">Start with Molecular Atlas.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
            Organic chemistry, taught through the medicines you’ll meet in practice.
          </p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/molecular-atlas" variant="inverse" size="lg">
              Explore Molecular Atlas <ArrowRight size={18} aria-hidden />
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-white/75">{price}/month including GST · Cancel any time</p>
        </div>
      </section>
    </>
  );
}
