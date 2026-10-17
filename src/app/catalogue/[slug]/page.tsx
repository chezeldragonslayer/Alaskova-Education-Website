import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Check, ChevronRight, ShieldCheck } from "lucide-react";
import { BookCover } from "@/components/BookCover";
import { ButtonLink } from "@/components/ui/Button";
import { catalogue, getBook } from "@/lib/catalogue";
import { formatPrice, planForBook } from "@/lib/plans";
import { SubscribeButton } from "@/components/SubscribeButton";
import { authConfigured, billingConfigured } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";
import { hasAccess } from "@/lib/access";

const messages: Record<string, string> = {
  cancelled: "Checkout was cancelled — you haven’t been charged.",
  error: "We couldn’t start checkout. Please try again.",
  unavailable: "Checkout isn’t available yet.",
  required: "You need an active subscription to read this textbook.",
};

async function AccessCta({ slug, searchParams }: { slug: string; searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const msg = messages[sp.checkout ?? sp.access ?? ""];
  let subscribed = false;
  if (authConfigured() && billingConfigured()) {
    const user = await getUser().catch(() => null);
    if (user) subscribed = await hasAccess(user.id, slug).catch(() => false);
  }
  return (
    <div className="mt-6 grid gap-3">
      {msg && <p role="status" className="rounded-xl bg-mist-2 px-4 py-3 text-sm font-medium text-steel ring-1 ring-line">{msg}</p>}
      {subscribed ? (
        <ButtonLink href={`/read/${slug}`} size="lg" prefetch={false}>Read now</ButtonLink>
      ) : (
        <SubscribeButton slug={slug}>Subscribe to read</SubscribeButton>
      )}
      <ButtonLink href="/pricing" variant="secondary">Pricing details</ButtonLink>
    </div>
  );
}

type Params = { slug: string };

export function generateStaticParams() {
  return catalogue.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const book = getBook((await params).slug);
  if (!book) return {};
  return {
    title: book.title,
    description: book.description,
    alternates: { canonical: `/catalogue/${book.slug}` },
  };
}

export default async function BookPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<Record<string, string | undefined>> }) {
  const book = getBook((await params).slug);
  if (!book) notFound();
  const plan = planForBook(book.slug);

  const details: [string, string][] = [
    ["Publisher", book.publisher],
    ["Subjects", book.subjects.join(", ")],
    ...(book.author ? ([["Author", book.author]] as [string, string][]) : []),
    ...(book.edition ? ([["Edition", book.edition]] as [string, string][]) : []),
    ...(book.isbn ? ([["ISBN", book.isbn]] as [string, string][]) : []),
    ...(book.publicationYear ? ([["Published", String(book.publicationYear)]] as [string, string][]) : []),
    ["Format", "Digital — read online"],
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    publisher: { "@type": "Organization", name: book.publisher },
    description: book.description,
    ...(book.isbn && { isbn: book.isbn }),
    ...(book.author && { author: { "@type": "Person", name: book.author } }),
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/catalogue" className="hover:text-midnight">Catalogue</Link>
        <ChevronRight size={14} aria-hidden />
        <span aria-current="page" className="font-medium text-midnight">{book.title}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-[20rem_1fr_22rem] lg:gap-14">
        <div className="mx-auto w-56 lg:w-full">
          <BookCover book={{ title: book.title, subject: book.subjects[0], tone: book.tone }} />
        </div>

        <div>
          <ul className="flex flex-wrap gap-2" aria-label="Subjects">
            {book.subjects.map((s) => (
              <li key={s}><Link href={`/catalogue?subject=${encodeURIComponent(s)}`} className="rounded-full bg-ocean/10 px-3 py-1 text-[0.8125rem] font-semibold text-steel ring-1 ring-ocean/25 hover:bg-ocean/15">{s}</Link></li>
            ))}
          </ul>
          <h1 className="h1 mt-5 !text-[clamp(2.25rem,1.8rem+2vw,3.25rem)]">{book.title}</h1>
          <p className="lead mt-5">{book.description}</p>

          <dl className="mt-10 divide-y divide-line rounded-2xl ring-1 ring-line">
            {details.map(([k, v]) => (
              <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 px-5 py-3.5 text-[0.9375rem]">
                <dt className="font-medium text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside aria-label="Access" className="h-fit rounded-2xl bg-white p-6 shadow-lift ring-1 ring-line lg:sticky lg:top-24">
          <p className="eyebrow">Subscription access</p>
          {plan ? (
            <>
              <p className="mt-3 font-display text-4xl font-bold tracking-tight">
                {formatPrice(plan.priceCents)}
                <span className="text-base font-medium text-muted"> / month</span>
              </p>
              <p className="mt-2 text-sm text-muted">One subscription includes this textbook. Billed monthly until you cancel.</p>
            </>
          ) : (
            <p className="mt-3 text-muted">Subscription details coming soon.</p>
          )}
          <ul className="mt-5 space-y-2.5 text-sm">
            {["Read online in the Alaskova Education reader", "Bookmarks and reading progress", "Manage or cancel from your account"].map((t) => (
              <li key={t} className="flex gap-2.5"><Check size={16} className="mt-0.5 shrink-0 text-ocean" aria-hidden />{t}</li>
            ))}
          </ul>
          <Suspense fallback={<div className="mt-6 grid gap-3"><SubscribeButton slug={book.slug}>Subscribe to read</SubscribeButton></div>}>
            <AccessCta slug={book.slug} searchParams={searchParams} />
          </Suspense>
          <p className="mt-5 flex items-start gap-2 text-xs text-muted">
            <ShieldCheck size={14} className="mt-0.5 shrink-0" aria-hidden />
            Secure payments by Stripe. Access is confirmed after payment.
          </p>
        </aside>
      </div>
    </div>
  );
}
