import type { Metadata } from "next";
import Link from "next/link";
import { Fact, LegalPage, SupportEmail } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Cancellation & refunds",
  description: "How to cancel an Alaskova Education subscription, and when refunds apply.",
  alternates: { canonical: "/legal/refunds" },
};

/*
 * DRAFT. Matches the Stripe set-up the site relies on: the Customer Portal cancels at the END of the billing period
 * (Stripe Dashboard > Settings > Billing > Customer portal > "Cancel at end of billing period"). If the owner changes that
 * setting, this page must change too. A lawyer must review it before launch.
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
      <ul>
        <li>
          Because you keep access for the rest of the paid month after cancelling, we do not normally refund part-months
          when you change your mind. <Fact value="[TO BE CONFIRMED: change-of-mind policy, e.g. a full refund if requested within 7 days of the first payment]" />
        </li>
        <li>
          If you were charged by mistake (for example twice for the same textbook, or after you cancelled), contact us and
          we will refund the incorrect charge.
        </li>
        <li>
          If the service has a problem we cannot fix, you have rights under the Australian Consumer Law, including a
          refund in the case of a major failure. These rights are not affected by anything on this page.
        </li>
        <li>
          If we refund a payment in full, the subscription it paid for is cancelled and your access to the textbook ends
          straight away. You are not charged again. You can subscribe again at any time.
        </li>
      </ul>

      <h2>Failed payments</h2>
      <p>
        If a monthly payment fails, Stripe emails you and tries your card again over the following days. Your access is
        paused while the payment is overdue and returns as soon as it succeeds. You can update your card at any time from Manage billing.
      </p>

      <h2>How to ask for a refund</h2>
      <p>
        Email <SupportEmail /> (or use the <Link href="/support#contact">contact form</Link>) from the address you
        subscribed with, and tell us the date of the charge. We aim to reply within{" "}
        <Fact value="[TO BE CONFIRMED: response time, e.g. 2 business days]" />. Approved refunds go back to the card you
        paid with and usually appear within 5 to 10 business days.
      </p>
      <p>
        Please contact us before disputing a charge with your bank; we can usually fix billing problems faster.
      </p>
    </LegalPage>
  );
}
