import { Suspense } from "react";
import { ArrowRight, BookOpen } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SubscribeButton } from "@/components/SubscribeButton";
import { authConfigured, billingConfigured } from "@/lib/env";
import { getUser } from "@/lib/supabase/server";
import { hasAccess } from "@/lib/access";
import { formatPrice, planForBook } from "@/lib/plans";

const SLUG = "molecular-atlas";

const messages: Record<string, string> = {
  cancelled: "Checkout was cancelled. You haven’t been charged.",
  error: "We couldn’t start checkout. Please try again.",
  unavailable: "Checkout isn’t available yet.",
  required: "You need an active subscription to read Molecular Atlas.",
};

type SP = Promise<Record<string, string | undefined>>;

/** Subscribers see "Open Molecular Atlas"; everyone else sees the subscribe button (which signs them in first). */
async function Inner({ searchParams, label }: { searchParams?: SP; label: string }) {
  const sp = searchParams ? await searchParams : {};
  const msg = messages[sp.checkout ?? sp.access ?? ""];
  let subscribed = false;
  if (authConfigured() && billingConfigured()) {
    const user = await getUser().catch(() => null);
    if (user) subscribed = await hasAccess(user.id, SLUG).catch(() => false);
  }
  return (
    <div className="grid gap-3">
      {msg && (
        <p role="status" className="rounded-xl bg-paper-2 px-4 py-3 text-sm font-medium text-navy-soft ring-1 ring-line">
          {msg}
        </p>
      )}
      {subscribed ? (
        <ButtonLink href={`/read/${SLUG}`} size="lg" prefetch={false}>
          <BookOpen size={18} aria-hidden /> Open Molecular Atlas
        </ButtonLink>
      ) : (
        <SubscribeButton slug={SLUG}>
          {label} <ArrowRight size={18} aria-hidden className="ml-2" />
        </SubscribeButton>
      )}
    </div>
  );
}

export function AtlasAccess({ searchParams, label }: { searchParams?: SP; label?: string }) {
  const plan = planForBook(SLUG);
  const text = label ?? `Start learning · ${plan ? formatPrice(plan.priceCents) : ""}/month`;
  return (
    <Suspense fallback={<SubscribeButton slug={SLUG}>{text}</SubscribeButton>}>
      <Inner searchParams={searchParams} label={text} />
    </Suspense>
  );
}
