import type { Metadata } from "next";
import { Check, Lock, RefreshCw, XCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SubscribeButton } from "@/components/SubscribeButton";
import { Faq } from "@/components/Faq";
import { Reveal } from "@/components/Reveal";
import { BookCover } from "@/components/BookCover";
import { getBook } from "@/lib/catalogue";
import { formatPrice, plans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple pricing: one monthly subscription per textbook.",
  alternates: { canonical: "/pricing" },
};

const faqs = [
  { q: "What does one subscription include?", a: "A subscription gives you online access to one textbook through the Alaskova Education reader for as long as your subscription is active." },
  { q: "When am I billed?", a: "You are billed monthly from the day you subscribe, and your subscription renews each month until you cancel." },
  { q: "How do I cancel?", a: "Cancel any time from your account using the secure billing portal. No emails or phone calls required." },
  { q: "Is payment secure?", a: "Payments are processed by Stripe. Alaskova Education never sees or stores your card details." },
  { q: "When do I get access?", a: "Access is activated as soon as your payment is confirmed by Stripe." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title={<>One textbook. <span className="gradient-text">One simple price.</span></>}>
        Subscribe to the textbook you need. Cancel any time.
      </PageHero>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid gap-8">
          {plans.map((plan) => {
            const book = getBook(plan.bookSlug)!;
            return (
              <Reveal key={plan.id}>
                <div className="grid overflow-hidden rounded-[1.75rem] bg-white shadow-lift ring-1 ring-line md:grid-cols-[1fr_1.1fr]">
                  <div className="relative bg-gradient-to-br from-deep via-steel to-ocean p-8 text-white sm:p-10">
                    <p className="text-sm font-semibold text-white/80">Subscription</p>
                    <h2 className="mt-1 font-display text-3xl font-bold tracking-tight">{book.title}</h2>
                    <p className="mt-6 font-display text-5xl font-bold tracking-tight">
                      {formatPrice(plan.priceCents)}
                      <span className="text-lg font-medium text-white/75"> / month</span>
                    </p>
                    <p className="mt-2 text-sm text-white/75">Billed monthly. Renews until cancelled.</p>
                    <BookCover book={{ title: book.title, subject: book.subjects[0], tone: book.tone }} className="mt-8 w-28 ring-1 ring-white/20" />
                  </div>
                  <div className="p-8 sm:p-10">
                    <h3 className="font-display text-lg font-semibold">What’s included</h3>
                    <ul className="mt-4 space-y-3">
                      {["Online access to Molecular Atlas", "Read in the Alaskova Education reader on any device", "Bookmarks and reading progress", "Manage your subscription from your account"].map((t) => (
                        <li key={t} className="flex gap-3"><Check size={18} className="mt-0.5 shrink-0 text-ocean" aria-hidden />{t}</li>
                      ))}
                    </ul>
                    <SubscribeButton slug={book.slug} className="mt-8 w-full">Subscribe</SubscribeButton>
                    <p className="mt-4 text-center text-xs text-muted">Secure checkout by Stripe</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { i: RefreshCw, t: "Transparent renewal", d: "Billed monthly and renewing until you cancel." },
            { i: XCircle, t: "Cancel any time", d: "Use the billing portal in your account." },
            { i: Lock, t: "Secure payments", d: "Handled by Stripe — Alaskova Education never stores card details." },
          ].map(({ i: Icon, t, d }) => (
            <li key={t} className="rounded-2xl bg-mist p-6 ring-1 ring-line">
              <Icon className="text-ocean" size={22} aria-hidden />
              <h3 className="mt-4 font-display font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-mist py-16 lg:py-24" aria-labelledby="pf">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 id="pf" className="h2 text-center">Billing questions</h2>
          <div className="mt-10"><Faq items={faqs} /></div>
        </div>
      </section>
    </>
  );
}
