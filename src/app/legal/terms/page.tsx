import type { Metadata } from "next";
import Link from "next/link";
import { Fact, LegalPage, SupportEmail } from "@/components/LegalPage";
import { business } from "@/lib/business";
import { formatPrice, plans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms for using Alaskova Education and subscribing to its digital textbooks.",
  alternates: { canonical: "/legal/terms" },
};

/*
 * DRAFT. Written to match how the site actually works (Stripe monthly subscriptions, cancel at period end through the
 * Stripe billing portal). Updated 11 November 2026 from the owner's legal pages implementation brief (items A1–A11).
 * Keep the checkout key-terms text (src/lib/legal.ts) consistent with sections 3, 4 and 8.
 */
export default function TermsPage() {
  const plan = plans[0];
  return (
    <LegalPage eyebrow="Legal" title="Terms of service">
      <p>
        These terms apply when you create an account with or subscribe through Alaskova Education. Alaskova Education
        is a trading name of <Fact value={business.legalEntity} /> (ABN <Fact value={business.abn} />)
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or subscribing
        you agree to these terms. Our <Link href="/legal/privacy">Privacy policy</Link> explains how we handle your
        personal information.
      </p>

      <h2>1. What we provide</h2>
      <p>
        Alaskova Education publishes digital textbooks. A subscription gives you online access to one textbook, read in
        your web browser, for as long as the subscription is active. The first title is Molecular Atlas, an organic
        chemistry textbook. You do not buy a copy of the textbook and cannot download it.
      </p>
      <p>
        Your reading progress, answers, notes and notebook are saved only in the web browser you study in. They
        don&rsquo;t move to another device or browser, and they are deleted if you clear that browser&rsquo;s data. We
        can&rsquo;t recover them.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>
          You must give accurate details and keep your password secure. You are responsible for activity on your account
          that you carry out or allow. Tell us straight away at <SupportEmail /> if you think someone else has used your
          account.
        </li>
        <li>Your account and subscription are for you personally. Do not share your sign-in or let others read through your account.</li>
      </ul>

      <h2>3. Subscriptions, price and billing</h2>
      <ul>
        <li>
          A subscription costs {plan ? formatPrice(plan.priceCents) : "the price shown"} (Australian dollars) per
          month. The price includes GST. The price and currency are shown again on the secure Stripe checkout page before you pay.
        </li>
        <li>
          Payments are processed by Stripe. You are charged when you subscribe and then once a month on the same date (or
          the last day of the month, if a month has no such date) until you cancel. We never see or store your full card
          number.
        </li>
        <li>Your access starts once Stripe confirms your payment, usually within seconds.</li>
        <li>
          If a payment fails, Stripe will try your card again over the following days and email you. While a payment is
          overdue your access is paused straight away, and it resumes as soon as the payment succeeds. If the payment
          still cannot be collected, the subscription ends.
        </li>
        <li>
          We may change the price for future billing periods. We will tell you by email at least{" "}
          30 days before the change, and you can cancel before
          it takes effect.
        </li>
      </ul>

      <h2>4. Cancelling</h2>
      <p>
        You can cancel at any time from <Link href="/account">My account</Link> using Manage billing. Cancelling stops
        future payments. You keep access until the end of the period you have already paid for. If we refund your
        current period because you end the subscription under the Australian Consumer Law, or at your request, the
        subscription ends and your access stops when the refund is made. Refunding a duplicate or incorrect charge does
        not end your subscription. If you dispute a payment with your bank, we may pause your access while the dispute
        is open, and if the payment is reversed, the subscription it paid for ends. See{" "}
        <Link href="/legal/refunds">Cancellation and refunds</Link> for details.
      </p>

      <h2>5. Using the textbooks</h2>
      <ul>
        <li>All textbook content is protected by copyright and belongs to us or our licensors.</li>
        <li>
          You may read it for your own personal study. You must not copy, record, scrape, download, republish, sell,
          share or otherwise distribute it, or use it to train software, except as Australian copyright law allows.
        </li>
        <li>
          The textbooks are educational material. They are not professional, safety or medical advice. Do not carry out
          chemistry experiments described in the textbooks without proper supervision, training and safety equipment.
        </li>
      </ul>

      <h2>6. Your rights under Australian Consumer Law</h2>
      <p>
        Our services come with guarantees that cannot be excluded under the Australian Consumer Law. For major failures
        with the service, you are entitled to cancel your service contract with us and to a refund for the unused
        portion, or to compensation for its reduced value. You are also entitled to be compensated for any other
        reasonably foreseeable loss or damage. If a failure does not amount to a major failure, you are entitled to have
        problems with the service rectified in a reasonable time and, if this is not done, to cancel your contract and
        obtain a refund for the unused portion. Nothing in these terms limits those rights.
      </p>

      <h2>7. Availability and changes to the service</h2>
      <p>
        We aim to keep the site and the reader available, but they may sometimes be unavailable for short periods for
        maintenance or because of events outside our reasonable control.
      </p>
      <p>
        We may update the textbooks and the reader, for example to correct errors, add content or improve how they work.
        We will not make a change that materially reduces what your subscription includes unless we email you at least
        30 days before it takes effect. If you don&rsquo;t want to continue after such a change, you can cancel before it
        takes effect and we will refund the unused part of any period you have already paid for.
      </p>
      <p>
        If we stop offering a textbook you subscribe to, we will email you at least 30 days in advance where we can. We
        will stop billing you, and if your access ends before the end of a period you have paid for, we will refund the
        unused part of that period.
      </p>

      <h2>8. Liability</h2>
      <p>
        Nothing in these terms excludes, restricts or changes any right or remedy you have under the Australian Consumer
        Law, or any other right the law says cannot be excluded.
      </p>
      <p>Subject to that:</p>
      <ul>
        <li>we are not responsible for loss that was not reasonably foreseeable when you subscribed; and</li>
        <li>
          we are not responsible for losing reading progress, answers or notes saved in your browser (see section 1),
          unless the loss was caused by our service failing to meet the consumer guarantees.
        </li>
      </ul>

      <h2>9. Ending your account</h2>
      <p>
        You can close your account at any time from <Link href="/account">My account</Link>. Closing your account
        cancels your subscription. You keep access until the end of the period you have already paid for, and your
        account is then deleted as described in our <Link href="/legal/privacy">Privacy policy</Link>.
      </p>
      <p>
        We may suspend or close your account if you seriously breach these terms, or keep breaching them after we ask you
        to stop, for example by sharing your sign-in or copying and distributing textbook content. Before we act, we will
        tell you what the breach is and give you a reasonable chance to fix it, unless the breach is so serious that this
        would not be reasonable (for example, publishing a textbook online). If we close your account because of a
        breach, we will tell you why.
      </p>
      <p>
        If we suspend or close your account for any other reason, we will refund the unused part of any period you have
        already paid for. Nothing in this section affects your rights under the Australian Consumer Law.
      </p>

      <h2>10. Changes to these terms</h2>
      <p>
        We may update these terms, for example because the law or our service changes. If a change could disadvantage
        you, we will email you at least 30 days before it takes effect, and it will apply from your first billing date
        after that. If you don&rsquo;t agree, you can cancel before then and you won&rsquo;t be charged under the new
        terms. Changes that only benefit you, or that the law requires us to make sooner, can take effect straight away.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These terms are governed by the laws of <Fact value={business.governingState} />, Australia. This doesn&rsquo;t
        take away any rights you have under the consumer laws of the state or territory where you live, and you can bring
        a claim in a court or tribunal there.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these terms, and any legal notices: <SupportEmail />.
      </p>
      <p>
        If you have a complaint, please email us first and we will try to resolve it. If we can&rsquo;t, you can contact
        NSW Fair Trading or the consumer protection agency in your state or territory.
      </p>
    </LegalPage>
  );
}
