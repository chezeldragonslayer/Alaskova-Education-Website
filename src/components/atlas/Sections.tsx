import Image from "next/image";
import {
  Atom,
  BookOpenCheck,
  FileSearch,
  FlaskConical,
  GraduationCap,
  Pill,
  Scale,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { atlasFacts, atlasModules, atlasQuestions, atlasScreenshots, atlasTools } from "@/lib/molecular-atlas";
import { formatPrice, planForBook } from "@/lib/plans";
import { AtlasAccess } from "@/components/AtlasAccess";
import Link from "next/link";

/** Four verified numbers. */
export function AtlasFacts({ dark = false }: { dark?: boolean }) {
  const items = [
    [String(atlasFacts.lessons), "lessons across 10 modules"],
    [atlasFacts.practiceProblems, "practice problems"],
    [atlasFacts.medicines, "real medicines as worked examples"],
    [String(atlasFacts.rules), "core rules that explain reactivity"],
  ];
  return (
    <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {items.map(([n, label]) => (
        <div
          key={label}
          className={dark ? "rounded-2xl bg-white/5 p-4 ring-1 ring-white/15" : "rounded-2xl bg-white p-4 ring-1 ring-line"}
        >
          <dt className={dark ? "text-xs text-white/75" : "text-xs text-muted"}>{label}</dt>
          <dd className={dark ? "order-first font-display text-3xl font-bold text-gold" : "order-first font-display text-3xl font-bold text-navy"}>
            {n}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** What the product emphasises (each point is backed by the book's content). */
export function AtlasHighlights() {
  const points = [
    { icon: Pill, t: "Chemistry with a pharmaceutical purpose", d: "Medicinal chemistry, drug design and case studies of real medicines, not chemistry for its own sake." },
    { icon: Atom, t: "Drug action and selectivity", d: "How a molecule's shape and charge decide what it binds to, and why one drug favours one target over another." },
    { icon: FileSearch, t: "Adverse reactions and interactions", d: "Reactive metabolites, structural alerts and metabolic soft spots, including where chemistry explains a reaction and where it can’t." },
    { icon: FlaskConical, t: "Interactive molecules", d: "Step through mechanisms, rotate molecules in 3D, read spectra and test reactions on a virtual bench." },
    { icon: BookOpenCheck, t: "Self-paced and assessed", d: "Practice problems, spaced review, module checkpoints, a final exam and your own notebook." },
    { icon: GraduationCap, t: "Built for pharmacy students", d: "Organic chemistry applied to the medicines you’ll meet in your degree and beyond it." },
  ];
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {points.map(({ icon: Icon, t, d }) => (
        <li key={t} className="rounded-2xl bg-white p-6 ring-1 ring-line">
          <span className="grid size-11 place-items-center rounded-xl bg-navy text-gold">
            <Icon size={20} aria-hidden />
          </span>
          <h3 className="mt-4 font-display text-lg font-bold text-navy">{t}</h3>
          <p className="mt-1.5 text-sm text-muted">{d}</p>
        </li>
      ))}
    </ul>
  );
}

/** Questions the book really works through. */
export function AtlasQuestions() {
  return (
    <ul className="grid gap-5 lg:grid-cols-3">
      {atlasQuestions.map((x) => (
        <li key={x.q} className="flex flex-col rounded-2xl bg-white p-6 shadow-card ring-1 ring-line">
          <p className="font-display text-xl font-bold leading-snug text-navy">“{x.q}”</p>
          <p className="mt-3 text-sm text-muted">{x.a}</p>
          <p className="mt-auto pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-gold-ink">Explored in: {x.where}</p>
        </li>
      ))}
    </ul>
  );
}

/** How it differs from ordinary organic chemistry teaching. */
export function AtlasDifference() {
  const items = [
    { icon: Waypoints, t: "Rules, not rote learning", d: `Every mechanism is derived from ${atlasFacts.rules} core rules before it is named, so you can reason through reactions you haven’t memorised.` },
    { icon: Pill, t: "Taught through medicines", d: `More than ${atlasFacts.medicines.replace("+", "")} real drugs are used as worked examples, from aspirin to modern kinase inhibitors.` },
    { icon: Scale, t: "Honest about the evidence", d: "Claims are referenced, and the book marks what is established and what is still debated." },
  ];
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {items.map(({ icon: Icon, t, d }) => (
        <li key={t}>
          <Icon className="text-gold" size={26} aria-hidden />
          <h3 className="mt-3 font-display text-xl font-bold text-white">{t}</h3>
          <p className="mt-2 text-white/80">{d}</p>
        </li>
      ))}
    </ul>
  );
}

export function AtlasTools() {
  return (
    <ul className="flex flex-wrap gap-2">
      {atlasTools.map((t) => (
        <li key={t} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-navy ring-1 ring-line">
          <Sparkles size={13} className="text-gold-ink" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

export function AtlasCurriculum() {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {atlasModules.map((m) => (
        <li key={m.n} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-line">
          <span className="font-display text-2xl font-bold text-gold-ink" aria-hidden>
            {String(m.n).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-navy">
              <span className="sr-only">Module {m.n}: </span>
              {m.title}
            </h3>
            <p className="text-xs font-semibold text-navy-soft">{m.lessons} lessons</p>
            <p className="mt-1 text-sm text-muted">{m.summary}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Real screenshots of the book, once the owner supplies them (see atlasScreenshots). Renders nothing until then. */
export function AtlasScreenshots() {
  if (atlasScreenshots.length === 0) return null;
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {atlasScreenshots.map((s) => (
        <li key={s.src} className="overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line">
          <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(min-width: 1024px) 380px, 100vw" className="h-auto w-full" />
          <p className="px-4 py-3 text-sm text-muted">{s.caption}</p>
        </li>
      ))}
    </ul>
  );
}

export function AtlasSteps() {
  const steps = [
    ["Create your account", "Sign up with your email, Google or Microsoft. It takes under a minute."],
    ["Subscribe to Molecular Atlas", "Pay securely through Stripe. Cancel any time from your account."],
    ["Start learning", "Open it from your library and work at your own pace. Your progress saves as you go in the browser you study in."],
  ];
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {steps.map(([t, d], i) => (
        <li key={t} className="rounded-2xl bg-white p-6 ring-1 ring-line">
          <span className="font-display text-3xl font-bold text-gold-ink" aria-hidden>{i + 1}</span>
          <h3 className="mt-2 font-display text-lg font-bold text-navy">{t}</h3>
          <p className="mt-1.5 text-sm text-muted">{d}</p>
        </li>
      ))}
    </ol>
  );
}

/** Price card with the live subscribe/open button. */
export function AtlasPricing({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const plan = planForBook("molecular-atlas");
  return (
    <div className="on-dark mx-auto max-w-lg rounded-[1.75rem] bg-navy p-8 text-white shadow-lift ring-1 ring-gold/40 sm:p-10">
      <p className="eyebrow !text-gold">Molecular Atlas</p>
      <p className="mt-3 font-display text-5xl font-bold">
        {plan ? formatPrice(plan.priceCents) : ""}
        <span className="text-lg font-medium text-white/75"> / month</span>
      </p>
      <p className="mt-2 text-sm text-white/80">Includes GST. Cancel any time.</p>
      <ul className="mt-6 space-y-2.5 text-[0.9375rem] text-white/90">
        {[
          "Full access to all 229 lessons and 10 modules",
          "Practice problems, checkpoints and a final exam",
          "Learn at your own pace, on phone, tablet or computer",
          "Cancel from your account; keep access until the end of the month you’ve paid for",
          "Subscribe again whenever you need it, for example over the university holidays",
        ].map((t) => (
          <li key={t} className="flex gap-3">
            <span aria-hidden className="text-gold">✓</span>
            {t}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <AtlasAccess searchParams={searchParams} label="Subscribe to Molecular Atlas" />
      </div>
      <p className="mt-4 text-center text-xs text-white/70">
        Secure payment by Stripe. See the{" "}
        <Link href="/legal/terms" className="underline underline-offset-2">terms</Link> and{" "}
        <Link href="/legal/refunds" className="underline underline-offset-2">cancellation policy</Link>.
      </p>
    </div>
  );
}
