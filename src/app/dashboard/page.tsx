import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, CreditCard, LogOut } from "lucide-react";
import { authConfigured, billingConfigured } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";
import { getSubscriptions } from "@/lib/access";
import { grantsAccess } from "@/lib/security";
import { catalogue, getBook } from "@/lib/catalogue";
import { BookCover } from "@/components/BookCover";
import { ButtonLink } from "@/components/ui/Button";
import { RefreshWhilePending } from "./RefreshWhilePending";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

type SP = Promise<Record<string, string | undefined>>;

const notices: Record<string, string> = {
  already: "You already have an active subscription for that textbook.",
  "reader:coming-soon": "The online reader for this textbook isn’t connected yet.",
  "reader:error": "We couldn’t open the reader. Please try again shortly.",
  "billing:none": "You don’t have a billing account yet — it’s created when you subscribe.",
  "billing:unavailable": "Billing isn’t available right now.",
  "billing:error": "We couldn’t open the billing portal. Please try again.",
};

const fmt = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "—";

async function Dashboard({ searchParams }: { searchParams: SP }) {
  if (!authConfigured()) redirect("/login?error=not-configured");
  const user = await getUser();
  if (!user) redirect("/login?next=/dashboard");

  const sp = await searchParams;
  const subs = billingConfigured() ? await getSubscriptions(user.id) : [];
  const active = subs.filter((s) => grantsAccess(s.status, s.current_period_end));
  const name =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? user.email?.split("@")[0] ?? "there";
  const notice = sp.already ? notices.already : sp.reader ? notices[`reader:${sp.reader}`] : sp.billing ? notices[`billing:${sp.billing}`] : null;
  const pending = sp.checkout === "success" && active.length === 0;
  const libraryBooks = active.map((s) => ({ s, book: getBook(s.book_slug) })).filter((x) => x.book);
  const others = catalogue.filter((b) => !active.some((s) => s.book_slug === b.slug));

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 lg:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Student dashboard</p>
          <h1 className="h2 mt-2">Welcome back, {name}</h1>
        </div>
        <form action="/auth/signout" method="post">
          <button className="inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-steel ring-1 ring-line transition-colors hover:bg-mist-2">
            <LogOut size={16} aria-hidden /> Sign out
          </button>
        </form>
      </div>

      <div className="mt-8 space-y-4" aria-live="polite">
        {pending && <RefreshWhilePending />}
        {sp.checkout === "success" && active.length > 0 && (
          <p role="status" className="rounded-2xl bg-ocean/10 px-5 py-4 text-sm font-semibold text-steel ring-1 ring-ocean/30">
            You’re subscribed — your textbook is ready to read.
          </p>
        )}
        {notice && <p role="status" className="rounded-2xl bg-mist-2 px-5 py-4 text-sm font-medium text-steel ring-1 ring-line">{notice}</p>}
      </div>

      <section className="mt-10" aria-labelledby="lib">
        <h2 id="lib" className="font-display text-xl font-semibold tracking-tight">My library</h2>
        {libraryBooks.length ? (
          <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {libraryBooks.map(({ s, book }) => (
              <li key={s.id} className="flex gap-5 rounded-2xl bg-white p-5 shadow-card ring-1 ring-line">
                <BookCover book={{ title: book!.title, subject: book!.subjects[0], tone: book!.tone }} compact className="w-24 shrink-0" />
                <div className="flex min-w-0 flex-col">
                  <h3 className="font-display font-semibold tracking-tight">{book!.title}</h3>
                  <p className="mt-1 text-xs text-muted">{book!.subjects.join(" · ")}</p>
                  <ButtonLink href={`/read/${book!.slug}`} className="mt-auto" prefetch={false}>
                    <BookOpen size={16} aria-hidden /> Read now
                  </ButtonLink>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-2xl bg-mist p-8 text-center ring-1 ring-line">
            <BookOpen className="mx-auto text-steel" size={32} aria-hidden />
            <h3 className="mt-4 font-display text-lg font-semibold">Your library is empty</h3>
            <p className="mx-auto mt-1 max-w-sm text-muted">Subscribe to a textbook and it will appear here, ready to read.</p>
            <ButtonLink href="/catalogue" className="mt-5">Explore textbooks</ButtonLink>
          </div>
        )}
      </section>

      <section className="mt-12" aria-labelledby="sub">
        <h2 id="sub" className="font-display text-xl font-semibold tracking-tight">Subscription</h2>
        <div className="mt-5 overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-line">
          {subs.length ? (
            <ul className="divide-y divide-line">
              {subs.map((s) => (
                <li key={s.id} className="grid gap-1 px-5 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6">
                  <span className="font-medium">{getBook(s.book_slug)?.title ?? s.book_slug}</span>
                  <span className="text-sm capitalize text-steel">{s.status.replace("_", " ")}</span>
                  <span className="text-sm text-muted">
                    {s.cancel_at_period_end ? "Ends" : "Renews"} {fmt(s.current_period_end)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-6 text-muted">No active subscriptions.</p>
          )}
          {subs.length > 0 && (
            <form action="/api/stripe/portal" method="post" className="border-t border-line bg-mist px-5 py-4">
              <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-midnight shadow-card ring-1 ring-line transition-all hover:-translate-y-0.5">
                <CreditCard size={16} aria-hidden /> Manage billing
              </button>
              <span className="ml-3 text-xs text-muted">Update your card, view invoices or cancel.</span>
            </form>
          )}
        </div>
      </section>

      {others.length > 0 && (
        <section className="mt-12" aria-labelledby="more">
          <h2 id="more" className="font-display text-xl font-semibold tracking-tight">Explore</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {others.map((b) => (
              <li key={b.slug}>
                <Link href={`/catalogue/${b.slug}`} className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 ring-1 ring-line transition-all hover:-translate-y-0.5 hover:shadow-card">
                  <span className="font-medium">{b.title}</span>
                  <span className="text-sm font-semibold text-ocean">View →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function DashboardPage({ searchParams }: { searchParams: SP }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl space-y-6 px-5 py-14 sm:px-8" aria-busy="true" aria-label="Loading your dashboard">
          <div className="skeleton h-10 w-72" />
          <div className="skeleton h-48" />
          <div className="skeleton h-32" />
        </div>
      }
    >
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}
