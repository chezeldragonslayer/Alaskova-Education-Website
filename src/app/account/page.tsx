import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CreditCard, KeyRound } from "lucide-react";
import { authConfigured, billingConfigured } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";
import { getSubscriptions } from "@/lib/access";
import { getBook } from "@/lib/catalogue";
import { describeSubscription } from "@/lib/security";
import { displayName } from "@/lib/support";
import { DeleteAccountForm, NameForm } from "./AccountForms";

export const metadata: Metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};

type SP = Promise<Record<string, string | undefined>>;

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "—";

const providerLabel: Record<string, string> = { email: "Email and password", google: "Google", azure: "Microsoft" };

const card = "rounded-2xl bg-white p-6 shadow-card ring-1 ring-line";

async function Account({ searchParams }: { searchParams: SP }) {
  if (!authConfigured()) redirect("/login?error=not-configured");
  const user = await getUser();
  if (!user) redirect("/login?next=/account");
  const sp = await searchParams;
  const subs = billingConfigured() ? await getSubscriptions(user.id) : [];
  const providers = ((user.app_metadata?.providers as string[] | undefined) ?? [user.app_metadata?.provider ?? "email"])
    .map((p) => providerLabel[p] ?? p);
  const hasPassword = providers.includes(providerLabel.email);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8 lg:py-14">
      <p className="eyebrow">My account</p>
      <h1 className="h2 mt-2">Account settings</h1>
      <p className="mt-2 text-muted">
        <Link href="/dashboard" className="font-semibold text-ocean underline underline-offset-4">Back to my library</Link>
      </p>

      {sp.password === "updated" && (
        <p role="status" className="mt-6 rounded-2xl bg-ocean/10 px-5 py-4 text-sm font-semibold text-steel ring-1 ring-ocean/30">
          Your password has been changed.
        </p>
      )}

      <section aria-labelledby="details" className={`mt-8 ${card}`}>
        <h2 id="details" className="font-display text-xl font-semibold tracking-tight">Your details</h2>
        <div className="mt-4"><NameForm name={displayName(user.user_metadata)} /></div>
        <dl className="mt-6 grid gap-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
          <div><dt className="text-muted">Email</dt><dd className="mt-0.5 font-medium break-all">{user.email ?? "—"}</dd></div>
          <div><dt className="text-muted">Sign-in method</dt><dd className="mt-0.5 font-medium">{providers.join(", ")}</dd></div>
        </dl>
        <p className="mt-4 text-xs text-muted">
          To change your email address, <Link href="/support#contact" className="text-ocean underline underline-offset-4">contact support</Link>.
        </p>
      </section>

      <section aria-labelledby="security" className={`mt-6 ${card}`}>
        <h2 id="security" className="font-display text-xl font-semibold tracking-tight">Password</h2>
        <p className="mt-2 text-sm text-muted">
          {hasPassword ? "Change the password you use to sign in with your email." : "You sign in with Google or Microsoft. You can also add a password to sign in with your email."}
        </p>
        <Link href="/reset-password" className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-steel ring-1 ring-line transition-colors hover:bg-mist-2">
          <KeyRound size={16} aria-hidden /> {hasPassword ? "Change password" : "Add a password"}
        </Link>
      </section>

      <section aria-labelledby="sub" className={`mt-6 ${card}`}>
        <h2 id="sub" className="font-display text-xl font-semibold tracking-tight">Subscription</h2>
        {subs.length ? (
          <ul className="mt-4 divide-y divide-line">
            {subs.map((s) => {
              const d = describeSubscription(s, fmt);
              return (
                <li key={s.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                  <span className="font-medium">{getBook(s.book_slug)?.title ?? s.book_slug}</span>
                  <span className="text-sm">
                    <span className={d.needsAction ? "font-semibold text-red-700" : "text-steel"}>{d.label}</span>
                    <span className="text-muted"> · {d.detail}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">
            You don’t have a subscription yet. <Link href="/catalogue" className="text-ocean underline underline-offset-4">Explore textbooks</Link>.
          </p>
        )}
        {subs.length > 0 && (
          <form action="/api/stripe/portal" method="post" className="mt-4">
            <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-midnight shadow-card ring-1 ring-line transition-all hover:-translate-y-0.5">
              <CreditCard size={16} aria-hidden /> Manage billing
            </button>
            <p className="mt-2 text-xs text-muted">Update your card, download invoices or cancel, in the secure Stripe billing portal.</p>
          </form>
        )}
      </section>

      <section aria-labelledby="delete" className={`mt-6 ${card}`}>
        <h2 id="delete" className="font-display text-xl font-semibold tracking-tight">Delete my account</h2>
        <p className="mt-2 text-sm text-muted">
          We’ll delete your account and personal information within 30 days, except billing records we must keep for tax
          purposes (see the <Link href="/legal/privacy" className="text-ocean underline underline-offset-4">privacy policy</Link>).
          {subs.some((s) => describeSubscription(s, fmt).label !== "Ended") &&
            " Your subscription will be cancelled as part of this. To stop payments straight away, cancel it in Manage billing first."}
        </p>
        <div className="mt-4"><DeleteAccountForm /></div>
      </section>
    </div>
  );
}

export default function AccountPage({ searchParams }: { searchParams: SP }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl space-y-6 px-5 py-14 sm:px-8" aria-busy="true" aria-label="Loading your account">
          <div className="skeleton h-10 w-64" />
          <div className="skeleton h-56" />
          <div className="skeleton h-32" />
        </div>
      }
    >
      <Account searchParams={searchParams} />
    </Suspense>
  );
}
