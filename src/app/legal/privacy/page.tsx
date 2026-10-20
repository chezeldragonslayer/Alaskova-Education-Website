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
 * marketing email, cross-device progress sync, or switching on the Molecular Atlas AI tutor. A lawyer must review it.
 */
export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Legal" title="Privacy policy">
      <p>
        This policy explains how <Fact value={business.legalEntity} />, trading as Alaskova Education (&ldquo;we&rdquo;),
        handles personal information. We follow the Australian Privacy Principles.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Account details:</strong> your name, email address and password. Passwords are stored only in scrambled (hashed) form by our sign-in provider; we cannot see them.</li>
        <li><strong>If you sign in with Google or Microsoft:</strong> the name and email address that service shares with us. We do not receive your Google or Microsoft password.</li>
        <li><strong>Subscription details:</strong> which textbook you subscribe to, the subscription status, renewal and end dates, and the Stripe customer number linked to your account.</li>
        <li><strong>Payment details:</strong> entered directly into Stripe. Stripe stores your card; we only see things like the card brand, the last four digits and your invoices.</li>
        <li><strong>Referrals:</strong> your referral code, who referred you (if anyone), and whether a referral reward was paid.</li>
        <li><strong>Messages you send us:</strong> what you write in the contact form or by email, with your name and email.</li>
        <li><strong>Technical information:</strong> your IP address, used briefly in memory to stop abuse (such as repeated sign-in attempts), and standard server logs kept by our hosting provider.</li>
      </ul>

      <h2>While you read a textbook</h2>
      <p>
        The textbook reader (Molecular Atlas) runs as a separate part of our service. It receives only an anonymous
        account number from us, never your name or email. Your reading progress, answers, notes and notebook are saved in
        your own web browser on your device, not on our servers, so they do not follow you to another device and are lost
        if you clear your browser data.
      </p>
      <p>
        <Fact value="[TO BE CONFIRMED: if the AI study tutor is switched on] The reader's optional AI study tutor sends the questions you type, and the lesson you are on, to our AI provider, Anthropic, to generate an answer. Do not type personal information into the tutor." />
      </p>

      <h2>Cookies</h2>
      <p>We use only cookies that the site needs to work:</p>
      <ul>
        <li>sign-in cookies that keep you signed in (on this site and in the reader);</li>
        <li>a referral cookie, kept for 30 days, if you arrive through a friend&rsquo;s referral link;</li>
        <li>Stripe&rsquo;s own cookies on its checkout and billing pages, for fraud prevention.</li>
      </ul>
      <p>We do not use advertising or analytics cookies, and we do not sell or share your information for advertising.</p>

      <h2>Why we use it</h2>
      <ul>
        <li>to create and secure your account and let you sign in;</li>
        <li>to take payment, unlock the textbook you pay for, and manage your subscription;</li>
        <li>to run the refer-a-friend program;</li>
        <li>to answer your questions and send you essential emails about your account (confirmation, password reset, billing);</li>
        <li>to prevent fraud and abuse, and to meet our legal and tax obligations.</li>
      </ul>
      <p>We will not send you marketing emails unless you have agreed to them, and every marketing email will let you unsubscribe.</p>

      <h2>Who we share it with</h2>
      <p>We use these service providers, who handle information for us under their own privacy and security terms:</p>
      <ul>
        <li><strong>Supabase</strong>: accounts and our database. <Fact value="[TO BE CONFIRMED: Supabase project region]" /></li>
        <li><strong>Stripe</strong>: payments and invoices.</li>
        <li><strong>Render</strong> (with Cloudflare): hosting for the website and the reader. <Fact value="[TO BE CONFIRMED: Render region]" /></li>
        <li><strong>Google or Microsoft</strong>: only if you choose to sign in with them.</li>
        <li><strong><Fact value="[TO BE CONFIRMED: email provider, e.g. Resend]" /></strong>: sending account emails.</li>
      </ul>
      <p>
        Some of these providers store information outside Australia, including in the United States. We choose providers
        that protect information to a standard similar to the Australian Privacy Principles. We may also disclose
        information where the law requires it.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account information while you have an account. If you close your account we delete it, except for
        billing and tax records, which we must keep for as long as Australian tax law requires (generally five years),
        and messages needed to resolve an open dispute.
      </p>

      <h2>Your choices and rights</h2>
      <ul>
        <li>You can see and change your name on <Link href="/account">My account</Link>, and see your invoices through Manage billing.</li>
        <li>You can ask for a copy of the personal information we hold about you, ask us to correct it, or ask us to delete your account, from My account or by email.</li>
        <li>We will respond within 30 days.</li>
      </ul>

      <h2>Security</h2>
      <p>
        Information is sent over encrypted connections, access to our database is restricted, and card details are held
        only by Stripe. If a data breach is likely to cause you serious harm, we will tell you and, where required, the
        Office of the Australian Information Commissioner.
      </p>

      <h2>Questions and complaints</h2>
      <p>
        Contact <SupportEmail /> or write to <Fact value={business.address} />. If you are not satisfied with our
        response, you can complain to the Office of the Australian Information Commissioner at{" "}
        <a href="https://www.oaic.gov.au" rel="noopener noreferrer">oaic.gov.au</a>.
      </p>

      <h2>Changes</h2>
      <p>If we change this policy in a way that matters, we will update the date at the top and email account holders.</p>
    </LegalPage>
  );
}
