import type { Metadata } from "next";
import Link from "next/link";
import { Fact, LegalPage, SupportEmail } from "@/components/LegalPage";
import { business } from "@/lib/business";
import { formatPrice, plans } from "@/lib/plans";
import { MAX_REWARDED_REFERRALS, REFERRAL_REWARD_MONTHS } from "@/lib/referrals";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms for using Alaskova Education and subscribing to its digital textbooks.",
  alternates: { canonical: "/legal/terms" },
};

/*
 * DRAFT. Written to match how the site actually works (Stripe monthly subscriptions, cancel at period end through the
 * Stripe billing portal, referral credit as Stripe customer balance). A lawyer must review it before launch.
 */
export default function TermsPage() {
  const plan = plans[0];
  return (
    <LegalPage eyebrow="Legal" title="Terms of service">
      <p>
        These terms apply when you create an account with or subscribe through Alaskova Education. Alaskova Education
        is a trading name of <Fact value={business.legalEntity} /> (ABN <Fact value={business.abn} />), of{" "}
        <Fact value={business.address} /> (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or subscribing
        you agree to these terms.
      </p>

      <h2>1. What we provide</h2>
      <p>
        Alaskova Education publishes digital textbooks. A subscription gives you online access to one textbook, read in
        your web browser, for as long as the subscription is active. The first title is Molecular Atlas, an organic
        chemistry textbook. You do not buy a copy of the textbook and cannot download it.
      </p>

      <h2>2. Your account</h2>
      <ul>
        <li>You must give accurate details and keep your password secure. You are responsible for activity on your account.</li>
        <li>Your account and subscription are for you personally. Do not share your sign-in or let others read through your account.</li>
        <li>
          You must be 18 or older, or have the permission of a parent or guardian who agrees to these terms for you.{" "}
          <Fact value="[TO BE CONFIRMED: minimum age policy]" />
        </li>
      </ul>

      <h2>3. Subscriptions, price and billing</h2>
      <ul>
        <li>
          A subscription costs {plan ? formatPrice(plan.priceCents) : "the price shown"} (Australian dollars) per
          month. <Fact value="[TO BE CONFIRMED: GST, e.g. 'The price includes GST.' or 'We are not registered for GST.']" /> The price and currency are shown again on the secure Stripe checkout page before you pay.
        </li>
        <li>
          Payments are processed by Stripe. You are charged when you subscribe and then once a month on the same date
          until you cancel. We never see or store your full card number.
        </li>
        <li>Your access starts once Stripe confirms your payment, usually within seconds.</li>
        <li>
          If a payment fails, Stripe will try your card again over the following days and email you. While a payment is
          overdue your access is paused straight away, and it resumes as soon as the payment succeeds. If the payment
          still cannot be collected, the subscription ends.
        </li>
        <li>
          We may change the price for future billing periods. We will tell you by email at least{" "}
          <Fact value="[TO BE CONFIRMED: notice period, e.g. 30 days]" /> before the change, and you can cancel before
          it takes effect.
        </li>
      </ul>

      <h2>4. Cancelling</h2>
      <p>
        You can cancel at any time from <Link href="/account">My account</Link> using Manage billing. Cancelling stops
        future payments. You keep access until the end of the period you have already paid for. See{" "}
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
        <li>
          If the reader offers an AI study tutor, its answers are generated automatically and can be wrong. Check
          important points against the textbook itself.
        </li>
      </ul>

      <h2>6. Refer a friend</h2>
      <ul>
        <li>
          If someone signs up through your personal referral link and makes their first paid subscription payment, you
          receive account credit equal to {REFERRAL_REWARD_MONTHS} months of your subscription price. Credit is applied
          automatically to your future invoices.
        </li>
        <li>Only people who have never subscribed before count. You cannot refer yourself or your own other accounts.</li>
        <li>You can earn at most {MAX_REWARDED_REFERRALS} rewards. Credit has no cash value and cannot be transferred.</li>
        <li>
          We may withhold or reverse credit that was earned by misuse (for example duplicate accounts or payments that
          are refunded or disputed), and may change or end the program for future referrals with notice on this page.
        </li>
      </ul>

      <h2>7. Your rights under Australian Consumer Law</h2>
      <p>
        Our services come with guarantees that cannot be excluded under the Australian Consumer Law. For major failures
        with the service, you are entitled to cancel your service contract with us and to a refund for the unused
        portion, or to compensation for its reduced value. You are also entitled to be compensated for any other
        reasonably foreseeable loss or damage. If a failure does not amount to a major failure, you are entitled to have
        problems with the service rectified in a reasonable time and, if this is not done, to cancel your contract and
        obtain a refund for the unused portion. Nothing in these terms limits those rights.
      </p>

      <h2>8. Availability and changes to the service</h2>
      <p>
        We work to keep the site and the reader available, but they may sometimes be unavailable for maintenance or for
        reasons outside our control. We may improve or change the textbooks and the reader over time. If we stop offering
        a textbook you subscribe to, we will tell you in advance and you will not be charged for any period after access
        ends.
      </p>

      <h2>9. Liability</h2>
      <p>
        To the extent the law allows, and apart from the guarantees in section 7, our liability to you for any claim
        about the service is limited to supplying the service again or paying the cost of having it supplied again.
        We are not liable for loss that was not reasonably foreseeable.
      </p>

      <h2>10. Ending your account</h2>
      <p>
        You can ask us to close your account at any time from <Link href="/account">My account</Link>. We may suspend or
        close an account that breaches these terms (for example by sharing or copying content), after telling you why
        where it is reasonable to do so.
      </p>

      <h2>11. Changes to these terms</h2>
      <p>
        We may update these terms. If a change materially affects you, we will email you before it takes effect. If you
        do not agree, you can cancel before then.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These terms are governed by the laws of <Fact value={business.governingState} />, Australia.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these terms: <SupportEmail />, or write to <Fact value={business.address} />.
      </p>
    </LegalPage>
  );
}
