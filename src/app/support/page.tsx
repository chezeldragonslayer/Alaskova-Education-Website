import type { Metadata } from "next";
import { CreditCard, Cog, KeyRound, LifeBuoy, Mail, BookOpen } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Faq } from "@/components/Faq";
import { business, isConfirmed } from "@/lib/business";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Support centre",
  description: "Help with your account, subscription, billing and reading your textbook.",
  alternates: { canonical: "/support" },
};

const topics = [
  { icon: KeyRound, title: "Account", body: "Signing in, resetting your password (use “Forgot your password?” on the sign-in page) and updating your details." },
  { icon: CreditCard, title: "Subscription & billing", body: "Renewals, receipts, changing or cancelling your subscription." },
  { icon: BookOpen, title: "Accessing your textbook", body: "Can’t see your book? Access is unlocked once payment is confirmed." },
  { icon: Cog, title: "Technical help", body: "Browser, device and reader troubleshooting." },
];

const faqs = [
  { q: "I paid but can’t see my textbook.", a: "Access is activated after Stripe confirms your payment, which is usually immediate. Refresh your library after a minute. If it is still missing, contact support with the email you used to subscribe." },
  { q: "How do I cancel my subscription?", a: "Sign in, open My account (or your dashboard) and choose Manage billing. This opens the secure Stripe billing portal." },
  { q: "How do I update my payment method?", a: "Use the same billing portal: My account → Manage billing." },
  { q: "The reader isn’t loading.", a: "Try a current version of Chrome, Safari, Edge or Firefox, then refresh. If it persists, contact support with your browser and device." },
];

export default function SupportPage() {
  return (
    <>
      <PageHero eyebrow="Support centre" title={<>How can we <span className="gradient-text">help?</span></>}>
        Answers to common questions about your account, subscription and reading.
      </PageHero>
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:py-24">
        <ul className="grid gap-5 sm:grid-cols-2">
          {topics.map((t) => (
            <li key={t.title} className="flex gap-4 rounded-2xl bg-white p-6 shadow-card ring-1 ring-line">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-mist-2 text-ocean"><t.icon size={20} aria-hidden /></span>
              <div><h2 className="font-display text-lg font-semibold tracking-tight">{t.title}</h2><p className="mt-1 text-sm text-muted">{t.body}</p></div>
            </li>
          ))}
        </ul>

        <h2 className="h2 mt-16">Common questions</h2>
        <div className="mt-8"><Faq items={faqs} /></div>

        <div id="contact" className="mt-16 scroll-mt-24 rounded-2xl bg-gradient-to-br from-deep to-steel p-8 text-white sm:p-10">
          <LifeBuoy aria-hidden size={28} className="text-white/80" />
          <h2 className="mt-4 font-display text-2xl font-semibold">Still need help?</h2>
          {/* OWNER: set supportEmail in src/lib/business.ts. */}
          <p className="mt-2 flex flex-wrap items-center gap-2 text-white/85">
            <Mail size={16} aria-hidden /> Email{" "}
            {isConfirmed(business.supportEmail) ? (
              <a href={`mailto:${business.supportEmail}`} className="font-semibold text-white underline underline-offset-4">{business.supportEmail}</a>
            ) : (
              <span className="rounded bg-white/15 px-1.5 font-semibold">{business.supportEmail}</span>
            )}{" "}
            or send us a message below. Include the email you subscribed with.
          </p>
          <div className="mt-6 max-w-2xl"><ContactForm /></div>
        </div>
      </section>
    </>
  );
}
