import type { Metadata } from "next";
import { Lock, RefreshCw, XCircle } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Faq } from "@/components/Faq";
import { AtlasPricing } from "@/components/atlas/Sections";
import { formatPrice, planForBook } from "@/lib/plans";

const price = formatPrice(planForBook("molecular-atlas")!.priceCents);

export const metadata: Metadata = {
  title: "Pricing",
  description: `Molecular Atlas: ${price} per month including GST. Cancel any time.`,
  alternates: { canonical: "/pricing" },
};

const faqs = [
  { q: "What does the subscription include?", a: "Full online access to Molecular Atlas: every lesson, practice problem and interactive tool, for as long as your subscription is active." },
  { q: "When am I billed?", a: `${price} (including GST) when you subscribe, then on the same date each month until you cancel.` },
  { q: "How do I cancel?", a: "From My account, choose Manage billing and cancel in the secure Stripe portal. No emails or phone calls needed. You keep access until the end of the month you’ve paid for." },
  { q: "Can I pause over the holidays?", a: "There’s no pause button, but you can cancel any time and subscribe again whenever you need it." },
  { q: "Is there a free trial?", a: "Not at the moment. You can cancel any time." },
  { q: "Do other modules cost extra?", a: "Molecular Atlas is the only module available today. Future modules aren’t on sale yet." },
  { q: "Is payment secure?", a: "Payments are processed by Stripe. Alaskova Education never sees or stores your card details." },
];

export default function PricingPage() {
  return (
    <>
      <PageHero eyebrow="Pricing" title={<>One book. <span className="gradient-text">One monthly price.</span></>}>
        Molecular Atlas is {price} a month including GST. Learn at your own pace and cancel any time.
      </PageHero>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
        <AtlasPricing />
        <ul className="mt-12 grid gap-5 sm:grid-cols-3">
          {[
            { i: RefreshCw, t: "Transparent renewal", d: "Billed monthly and renewing until you cancel." },
            { i: XCircle, t: "Cancel any time", d: "In your account, through the Stripe billing portal." },
            { i: Lock, t: "Secure payments", d: "Handled by Stripe. We never store card details." },
          ].map(({ i: Icon, t, d }) => (
            <li key={t} className="rounded-2xl bg-paper p-6 ring-1 ring-line">
              <Icon className="text-gold-ink" size={22} aria-hidden />
              <h2 className="mt-4 font-display text-lg font-bold">{t}</h2>
              <p className="mt-1 text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-paper py-16 lg:py-24" aria-labelledby="pf">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 id="pf" className="h2 text-center">Billing questions</h2>
          <div className="mt-10"><Faq items={faqs} /></div>
        </div>
      </section>
    </>
  );
}
