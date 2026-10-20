import {
  ArrowRight,
  BookOpenCheck,
  CreditCard,
  Library,
  MonitorSmartphone,
  Search,
  Sparkles,
  UserRound,
  GraduationCap,
  LayoutGrid,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/Reveal";
import { DashboardMock } from "@/components/DashboardMock";
import { HeroSearch } from "@/components/HeroSearch";
import { BookCover } from "@/components/BookCover";
import { DemoBadge } from "@/components/DemoBadge";
import { Faq } from "@/components/Faq";
import { faqs } from "@/lib/demo";
import { catalogue } from "@/lib/catalogue";
import { formatPrice, planForBook } from "@/lib/plans";

const featured = catalogue[0];
const plan = planForBook(featured.slug)!;

const steps = [
  {
    icon: Search,
    title: "Find your textbooks",
    body: "Search by title or subject and see straight away what is included in your subscription.",
  },
  {
    icon: CreditCard,
    title: "Choose a subscription",
    body: "Pick the plan that fits your studies. Billing, renewal and cancellation terms are clear before you pay.",
  },
  {
    icon: Library,
    title: "Access your digital library",
    body: "Open your textbooks in one place, read online, and pick up where you left off.",
  },
];

const benefits = [
  { icon: MonitorSmartphone, title: "Convenient digital access", body: "Read on the devices you already use, without carrying a stack of books." },
  { icon: LayoutGrid, title: "One centralised library", body: "Every textbook you can access, organised in a single, searchable place." },
  { icon: CreditCard, title: "Simple subscription management", body: "Update your card, see your invoices or cancel from your account through a secure billing portal." },
  { icon: Search, title: "A searchable catalogue", body: "Browse by subject, or search for a title straight away." },
  { icon: BookOpenCheck, title: "Online reading", body: "Lesson-by-lesson navigation, practice and review, and light or dark themes." },
  { icon: GraduationCap, title: "Built around students", body: "A calm, fast interface designed for studying, not for browsing a store." },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="aurora absolute inset-0 -z-10" />
        <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:pb-28 lg:pt-16">
          <div className="min-w-0">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-[0.8125rem] font-medium text-steel ring-1 ring-line shadow-card">
                <Sparkles size={14} className="text-bright" aria-hidden />
                Digital textbook subscriptions
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="h1 mt-6 text-midnight">
                All Your Textbooks.{" "}
                <span className="gradient-text">One Smarter Way to Study.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead mt-6 max-w-xl">
                Discover a simpler way to access your course textbooks. Explore
                digital learning resources, organise your studies, and take your
                education further with Alaskova Education.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8">
                <HeroSearch />
              </div>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/catalogue" size="lg">
                  Explore Textbooks <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </ButtonLink>
                <ButtonLink href="/how-it-works" variant="secondary" size="lg">
                  How It Works
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} y={32} className="relative min-w-0">
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-bright/25 via-ocean/10 to-transparent blur-2xl" />
            <DashboardMock className="lg:[transform:perspective(1800px)_rotateY(-6deg)_rotateX(2deg)] lg:origin-left" />
            <p className="mt-3 text-center text-xs text-muted">
              Interactive preview of the student dashboard · demonstration content
            </p>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="how">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">How Alaskova Education works</p>
          <h2 id="how" className="h2 mt-3">From search to reading in three steps.</h2>
          <p className="lead mt-4">Find the resources you need, build your digital library, and focus on what matters most — learning.</p>
        </Reveal>
        <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
          <div aria-hidden className="absolute left-[16%] right-[16%] top-9 hidden h-px bg-gradient-to-r from-transparent via-ocean/40 to-transparent md:block" />
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.1} className="h-full">
                <div className="relative h-full rounded-2xl bg-white p-7 shadow-card ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-ocean to-deep text-white shadow-glow">
                      <s.icon size={22} aria-hidden />
                    </span>
                    <span className="font-display text-4xl font-bold text-mist-2" aria-hidden>0{i + 1}</span>
                  </div>
                  <h3 className="h3 mt-6 !text-xl">{s.title}</h3>
                  <p className="mt-2 text-muted">{s.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      {/* FEATURED */}
      <section className="bg-mist py-20 lg:py-28" aria-labelledby="featured">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Featured textbook</p>
            <h2 id="featured" className="h2 mt-3">Written by Alaskova Education. Read anywhere.</h2>
            <p className="lead mt-4">Alaskova Education publishes its own digital textbooks, so you can see exactly what each title covers and what is included in your subscription.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="mt-12 grid items-center gap-8 rounded-[1.75rem] bg-white p-6 shadow-card ring-1 ring-line sm:p-10 md:grid-cols-[15rem_1fr] lg:grid-cols-[18rem_1fr] lg:gap-14">
              <div className="mx-auto w-48 md:w-full">
                <BookCover book={{ title: featured.title, subject: featured.subjects[0], tone: featured.tone }} className="transition-transform duration-500 hover:-rotate-1 hover:scale-[1.03]" />
              </div>
              <div>
                <ul className="flex flex-wrap gap-2" aria-label="Subjects">
                  {featured.subjects.map((s) => (
                    <li key={s} className="rounded-full bg-ocean/10 px-3 py-1 text-[0.8125rem] font-semibold text-steel ring-1 ring-ocean/25">{s}</li>
                  ))}
                </ul>
                <h3 className="h3 mt-5 !text-3xl">{featured.title}</h3>
                <p className="lead mt-3 max-w-xl">A textbook for organic chemistry, published by {featured.publisher}.</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <ButtonLink href={`/catalogue/${featured.slug}`} size="lg">
                    View textbook <ArrowRight size={18} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                  </ButtonLink>
                  <ButtonLink href="/catalogue" variant="secondary" size="lg">Browse catalogue</ButtonLink>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* WHY ALASKOVA */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="why">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Why Alaskova Education?</p>
          <h2 id="why" className="h2 mt-3">A technology platform that happens to provide textbooks.</h2>
          <p className="lead mt-4">Not another online bookstore — a better student experience, from discovery to the last page.</p>
        </Reveal>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={(i % 3) * 0.08} className="h-full">
                <div className="group h-full rounded-2xl p-6 ring-1 ring-line transition-all duration-300 hover:bg-mist hover:ring-ocean/30">
                  <span className="grid size-11 place-items-center rounded-xl bg-mist-2 text-ocean transition-colors group-hover:bg-ocean group-hover:text-white">
                    <b.icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">{b.title}</h3>
                  <p className="mt-2 text-muted">{b.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* DIGITAL EXPERIENCE */}
      <section className="relative overflow-hidden bg-midnight py-20 text-white lg:py-28" aria-labelledby="experience">
        <div aria-hidden className="absolute -left-32 top-0 size-[32rem] rounded-full bg-ocean/30 blur-3xl" />
        <div aria-hidden className="absolute -right-32 bottom-0 size-[28rem] rounded-full bg-bright/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow !text-bright">The Alaskova Education digital experience</p>
            <h2 id="experience" className="h2 mt-3">Read the way you study.</h2>
            <p className="mt-4 max-w-lg text-lg text-white/75">
              A focused reader with lesson navigation, practice questions, a personal notebook and light or dark themes. Your progress is saved in your browser, so you can pick up where you left off on that device.
            </p>
            <ul className="mt-8 space-y-3 text-white/85">
              {["Table of contents and lesson navigation", "Progress tracking, saved in your browser", "Light and dark reading themes", "Practice, review and a personal notebook"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid size-5 place-items-center rounded-full bg-bright/20 text-bright">✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/60">Reader preview shown with demonstration content.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="float-slow rounded-2xl bg-white p-6 text-midnight shadow-lift sm:p-8" role="img" aria-label="Preview of the Alaskova Education reader layout (demonstration content)">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="font-medium text-steel">Sample textbook · Chapter 4</span>
                <DemoBadge>Demo</DemoBadge>
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight">Sample chapter heading</h3>
              <div className="mt-4 space-y-3" aria-hidden>
                {[100, 94, 98, 70].map((w, i) => (<div key={i} className="skeleton h-3" style={{ width: `${w}%` }} />))}
              </div>
              <div className="mt-6 flex items-center gap-3 text-xs text-muted" aria-hidden>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist-2"><div className="h-full w-[62%] rounded-full bg-gradient-to-r from-ocean to-bright" /></div>
                62%
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PLANS */}
      <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="plans">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Simple pricing</p>
          <h2 id="plans" className="h2 mt-3">One textbook. One simple price.</h2>
          <p className="lead mt-4">Subscribe to the textbook you need and cancel any time.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 max-w-md rounded-[1.75rem] bg-gradient-to-b from-deep to-midnight p-8 text-white shadow-lift ring-1 ring-ocean/50 sm:p-10">
            <p className="text-sm font-semibold text-bright">{featured.title}</p>
            <p className="mt-3 font-display text-5xl font-bold tracking-tight">
              {formatPrice(plan.priceCents)}<span className="text-lg font-medium text-white/70"> / month</span>
            </p>
            <p className="mt-2 text-sm text-white/70">Billed monthly. Renews until cancelled.</p>
            <ul className="mt-7 space-y-3 text-[0.9375rem]">
              {["Online access to the full textbook", "Progress tracking on your device", "Manage or cancel from your account"].map((pt) => (
                <li key={pt} className="flex gap-3"><span aria-hidden className="text-bright">✓</span>{pt}</li>
              ))}
            </ul>
            <ButtonLink href="/pricing" variant="inverse" size="lg" className="mt-8 w-full">See pricing details</ButtonLink>
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="bg-mist py-20 lg:py-28" aria-labelledby="faq">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <p className="eyebrow">FAQ</p>
            <h2 id="faq" className="h2 mt-3">Questions, answered.</h2>
            <p className="lead mt-4">Can’t find what you’re looking for? Our support centre is here to help.</p>
            <div className="mt-6"><ButtonLink href="/support" variant="secondary">Visit support</ButtonLink></div>
          </Reveal>
          <Reveal delay={0.1}><Faq items={faqs} /></Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <Reveal>
          <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-deep via-steel to-ocean px-6 py-16 text-center text-white shadow-lift sm:px-12 lg:py-24">
            <div aria-hidden className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(circle_at_20%_20%,rgb(255_255_255/0.25),transparent_45%),radial-gradient(circle_at_85%_90%,rgb(29_125_217/0.6),transparent_50%)]" />
            <UserRound aria-hidden className="mx-auto text-white/70" size={28} />
            <h2 className="h2 mx-auto mt-4 max-w-2xl">Your education. Elevated.</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">Find your textbooks, build your digital library and start studying smarter.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/register" variant="inverse" size="lg">Get Started</ButtonLink>
              <ButtonLink href="/catalogue" size="lg" className="!bg-white/10 !text-white ring-1 ring-white/30 hover:!bg-white/20 !shadow-none">Explore the Library</ButtonLink>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
