import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, SupportEmail } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cancellation & refunds",
  description: "How to cancel an Alaskova Education subscription, and when refunds apply.",
  alternates: { canonical: "/legal/refunds" },
};

/*
 * In force from 11 November 2026. Matches the Stripe set-up the site relies on: the Customer Portal cancels at the END of the billing period
 * (Stripe Dashboard > Settings > Billing > Customer portal > "Cancel at end of billing period"). If the owner changes that
 * setting, this page must change too. Updated 11 November 2026 from the legal pages implementation brief (B1–B3).
 */
export default function RefundsPage() {
  return (
    <LegalPage eyebrow="Legal" title="Cancellation & refunds">
      <h2>Cancelling your subscription</h2>
      <ol>
        <li>Sign in and open <Link href="/account">My account</Link>.</li>
        <li>Choose <strong>Manage billing</strong>. This opens the secure Stripe billing portal.</li>
        <li>Choose <strong>Cancel subscription</strong> and confirm.</li>
      </ol>
      <p>
        You can cancel at any time, with no fee and no need to contact us. Cancelling stops all future payments. You keep
        access to the textbook until the end of the month you have already paid for, and the subscription then ends.
        Until that date you can also undo the cancellation from the same portal.
      </p>

      <h2>Refunds</h2>
      <h3>Your rights under the Australian Consumer Law</h3>
      <p>
        Our services come with guarantees that cannot be excluded under the Australian Consumer Law. These rights apply
        whether or not you have already used the textbook, and nothing on this page or in our{" "}
        <Link href="/legal/terms">Terms of service</Link> limits them.
      </p>
      <ul>
        <li>
          If there is a major failure with the service, you can cancel and get a refund for the unused part of the period
          you paid for, or keep your subscription and get compensation for its drop in value. A major failure includes a
          problem that would have stopped a reasonable person subscribing if they had known about it, or one that makes
          the service substantially unfit for its normal purpose and that we can&rsquo;t fix easily and within a
          reasonable time.
        </li>
        <li>
          If the problem is not a major failure, you can ask us to fix it. If we don&rsquo;t fix it within a reasonable
          time, you can cancel and get a refund for the unused part of the period you paid for.
        </li>
        <li>You may also be entitled to compensation for other reasonably foreseeable loss or damage caused by the problem.</li>
      </ul>
      <p>
        To use these rights, contact us as described under <a href="#how-to-ask">&ldquo;How to ask for a refund&rdquo;</a>.
      </p>

      <h3>Change of mind</h3>
      <p>
        You can cancel at any time and keep access until the end of the month you have paid for. Because of this, we
        don&rsquo;t refund the rest of the month if you simply change your mind. This doesn&rsquo;t affect your rights
        under the Australian Consumer Law.
      </p>

      <h3>Charges made in error</h3>
      <p>
        If you were charged by mistake (for example, twice for the same month, or after your cancellation took effect),
        contact us and we will refund the incorrect charge in full. As with any refund, your subscription is then
        cancelled at the end of the period you have paid for. You can subscribe again at any time.
      </p>

      <h3>What a refund means for your subscription</h3>
      <p>
        When we refund a payment, for any of the reasons above, your subscription is cancelled. You keep access until
        the end of the period you have paid for, you won&rsquo;t be charged again, and you can subscribe again at any
        time.
      </p>

      <h2>Failed payments</h2>
      <p>
        If a monthly payment fails, Stripe emails you and tries your card again over the following days. Your access is
        paused while the payment is overdue and returns as soon as it succeeds. You can update your card at any time from Manage billing.
      </p>

      <h2 id="how-to-ask" className="scroll-mt-24">How to ask for a refund</h2>
      <p>
        Email <SupportEmail /> (or use the <Link href="/support#contact">contact form</Link>) from the address you
        subscribed with, and tell us the date of the charge. We aim to reply within{" "}
        2 business days. Approved refunds go back to the card you
        paid with and usually appear within 5 to 10 business days. If that card has been cancelled or has expired, tell
        us and we will arrange another way to refund you.
      </p>
      <p>
        Please contact us before disputing a charge with your bank; we can usually fix billing problems faster. If you
        dispute a charge, we may pause your access while the dispute is open. If the dispute is decided in your favour,
        the subscription that charge paid for ends. If it is withdrawn or decided in our favour, your access is restored.
      </p>
    </LegalPage>
  );
}
