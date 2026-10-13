"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

/** After checkout, access arrives via Stripe's webhook a moment later. Poll politely. */
export function RefreshWhilePending() {
  const router = useRouter();
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      router.refresh();
      if (++n >= 12) clearInterval(t);
    }, 3000);
    return () => clearInterval(t);
  }, [router]);

  return (
    <p role="status" className="flex items-center gap-3 rounded-2xl bg-mist-2 px-5 py-4 text-sm font-medium text-steel ring-1 ring-line">
      <Loader2 className="animate-spin" size={18} aria-hidden />
      Payment received. We’re activating your access — this usually takes a few seconds.
    </p>
  );
}
