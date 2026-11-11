import type { Metadata } from "next";
import Link from "next/link";
import { Fact, LegalPage, SupportEmail } from "@/components/LegalPage";
import { business } from "@/lib/business";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What personal information Alaskova Education collects, why, and your choices.",
  alternates: { canonical: "/legal/privacy" },
};

/*
 * DRAFT. Lists only what the code actually collects (see docs/LAUNCH-AUDIT.md). Update it BEFORE adding analytics,
 * marketing email or cross-device progress sync. A lawyer must review it.
 *
 * The Molecular Atlas AI tutor was removed from the reader on 9 November 2026. Nothing is sent to Anthropic any
 * more, so the paragraph describing it and the Anthropic entry in the disclosure list have been deleted. Do not
 * reinstate either unless the feature itself comes back.
 */
export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy policy">
      <p>
        This policy explains how <Fact value={business.legalEntity} /> (ABN <Fact value={business.abn} />), trading as
        Alaskova Education (&ldquo;we&rdquo;), handles personal information. As a small business, we are not currently
        required to comply with the Privacy Act 1988 (Cth). We have chosen to handle personal information in line with
        the Australian Privacy Principles anyway, and this policy explains how. If the Privacy Act starts to apply to us,
        we will update this policy.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account details:</strong> your name, email address and password. Passwords are stored only in scrambled (hashed) form by our sign-in provider; we cannot see them.</li>
        <li><strong>If you sign in with Google or Microsoft:</strong> the name and email address that service shares with us. We do not receive your Google or Microsoft password.</li>
        <li><strong>Subscription details:</strong> which textbook you subscribe to, the subscription status, renewal and end dates, and the Stripe customer number linked to your account.</li>
        <li><strong>Payment details:</strong> entered directly into Stripe. Stripe stores your card; we only see things like the card brand, the last four digits and your invoices.</li>
        <li><strong>Messages you send us:</strong> what you write in the contact form or by email, with your name and email.</li>
        <li><strong>Technical information:</strong> your IP address and browser details, used to stop abuse (such as repeated sign-in attempts) and recorded in standard logs kept by our hosting and sign-in providers.</li>
      </ul>

      <h2>While you read a textbook</h2>
      <p>
        The textbook reader (Molecular Atlas) runs as a separate part of our service. It receives only a random
        account identifier from us, never your name or email. Your reading progress, answers, notes and notebook are saved in
        your own web browser on your device, not on our servers, so they do not follow you to another device and are lost
        if you clear your browser data.
      </p>

      <h2>Cookies</h2>
      <p>
        We use a small number of cookies. Most are needed for the site to work, and one helps us see which of our links
        bring people to the site:
      </p>
      <ul>
        <li>sign-in cookies that keep you signed in (on this site and in the reader);</li>
        <li>a &ldquo;source&rdquo; cookie, kept for 30 days, if you arrive from one of our links (for example from Instagram). It stores only the name of the source; if you subscribe, that name is saved with your subscription so we can tell which channels work;</li>
        <li>a short-lived cookie in the reader (10 minutes) that remembers which page you were on, so you return to it after your access is checked;</li>
        <li>Stripe&rsquo;s own cookies on its checkout and billing pages, for fraud prevention.</li>
      </ul>
      <p>
        We do not use advertising cookies or third-party analytics tools, and we do not sell or share your information
        for advertising.
      </p>

      <h2>Why we use it</h2>
      <ul>
        <li>to create and secure your account and let you sign in;</li>
        <li>to take payment, unlock the textbook you pay for, and manage your subscription;</li>
        <li>to answer your questions and send you essential emails about your account (confirmation, password reset, billing);</li>
        <li>to prevent fraud and abuse, and to meet our legal and tax obligations.</li>
      </ul>
      <p>
        We don&rsquo;t currently send marketing emails or texts; we share news about new modules on Instagram. If we
        start, we will only send them if you have agreed, and every message will identify us and let you unsubscribe.
      </p>

      <h2>Who we share it with</h2>
      <p>
        We use these service providers to run the service. They handle personal information for us under their own
        privacy and security terms:
      </p>
      <ul>
        <li>
          <strong>Supabase</strong>: accounts, sign-in and our database, including messages sent through our contact
          form. Your account data is stored in <Fact value="[TO BE CONFIRMED: Supabase region, e.g. Sydney, Australia]" />.
        </li>
        <li><strong>Stripe</strong>: payments, invoices and billing emails.</li>
        <li>
          <strong>Render</strong>: hosting for the website and the reader, in{" "}
          <Fact value="[TO BE CONFIRMED: Render region, e.g. Singapore]" />. Render sends all website traffic through
          Cloudflare to protect against attacks, so Cloudflare handles technical information such as your IP address.
        </li>
        <li><strong>Supabase</strong>: sending account emails such as sign-up confirmation and password resets.</li>
        <li><strong>Google or Microsoft</strong>: only if you choose to sign in with them.</li>
      </ul>
      <p>
        This means your information is likely to be stored or processed outside Australia, including in the United
        States<Fact value="[TO BE CONFIRMED: , and any other country from the regions above]" />. We use established
        providers that publish privacy and security commitments, but overseas providers may not be bound by laws
        equivalent to the Australian Privacy Principles. We do not sell your personal information. We may also disclose
        information where the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account information while you have an account. If you close your account we delete it, except for
        billing and tax records, which we must keep for as long as Australian tax and company law requires (generally five to seven years),
        and messages needed to resolve an open dispute.
      </p>

      <h2>Your choices and rights</h2>
      <ul>
        <li>You can see and change your name on <Link href="/account">My account</Link>, and see your invoices through Manage billing.</li>
        <li>You can ask for a copy of the personal information we hold about you, ask us to correct it, or ask us to delete your account, from My account or by email.</li>
        <li>We will respond within 30 days.</li>
        <li>If we can&rsquo;t give you access or make a correction, we will tell you why in writing and how to complain.</li>
      </ul>

      <h2>Security</h2>
      <p>
        Information is sent over encrypted connections, access to our database is restricted, and card details are held
        only by Stripe. If a data breach is likely to cause you serious harm, we will tell you and, where required, the
        Office of the Australian Information Commissioner.
      </p>

      <h2>Questions and complaints</h2>
      <p>
        Contact <SupportEmail />. We aim to respond to privacy questions and complaints within 30 days. Because we are a
        small business that isn&rsquo;t currently covered by the Privacy Act, the Office of the Australian Information
        Commissioner (<a href="https://www.oaic.gov.au" rel="noopener noreferrer">oaic.gov.au</a>) may not be able to
        investigate a complaint about us. If you are not satisfied with our response, you can also contact NSW Fair
        Trading or the consumer protection agency in your state or territory.
      </p>

      <h2>Changes</h2>
      <p>If we change this policy in a way that matters, we will update the date at the top and email account holders.</p>
    </LegalPage>
  );
}
