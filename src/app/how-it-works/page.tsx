import type { Metadata } from "next";
import { BookOpenCheck, CreditCard, Library, Search, UserPlus } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "How it works",
  description: "Create an account, find your textbook, subscribe and start reading online.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  { icon: UserPlus, title: "Create an account", body: "Sign up with email, or continue with Google or Microsoft. It takes less than a minute." },
  { icon: Search, title: "Find your textbook", body: "Browse the catalogue by subject and open a title to see what it covers and what a subscription includes." },
  { icon: CreditCard, title: "Subscribe", body: "Pay securely through Stripe. Your price, renewal and cancellation terms are shown before you confirm." },
  { icon: BookOpenCheck, title: "Start reading", body: "Once payment is confirmed your textbook unlocks in your library, ready to read online." },
  { icon: Library, title: "Manage your library", body: "Pick up where you left off, track your progress, and manage or cancel your subscription any time." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero eyebrow="How it works" title={<>From sign-up to reading in <span className="gradient-text">minutes.</span></>}>
        Five simple steps between you and your textbook.
      </PageHero>
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 lg:py-24">
        <ol className="relative space-y-6 before:absolute before:bottom-6 before:left-[1.65rem] before:top-6 before:w-px before:bg-gradient-to-b before:from-ocean/50 before:to-ocean/0">
          {steps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={0.04 * i}>
                <div className="relative flex gap-5 rounded-2xl bg-white p-5 shadow-card ring-1 ring-line sm:p-6">
                  <span className="relative z-10 grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-ocean to-deep text-white shadow-glow">
                    <s.icon size={24} aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-ocean">Step {i + 1}</p>
                    <h2 className="mt-1 font-display text-xl font-semibold tracking-tight">{s.title}</h2>
                    <p className="mt-1.5 text-muted">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/register" size="lg">Get started</ButtonLink>
          <ButtonLink href="/catalogue" variant="secondary" size="lg">Browse the catalogue</ButtonLink>
        </div>
      </section>
    </>
  );
}
