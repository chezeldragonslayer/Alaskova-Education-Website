/** Pure helpers (no server-only import) so they are unit-testable. */

/** Only allow same-site relative paths as post-login destinations (open-redirect guard). */
export function safeNext(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next) return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  if (/[\u0000-\u001f]/.test(next)) return fallback;
  return next;
}

/** CSRF defence for cookie-authenticated POST handlers: Origin must match our site. */
export function isSameOrigin(request: Request, siteOrigin: string): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(siteOrigin).origin;
  } catch {
    return false;
  }
}

/**
 * Tiny fixed-window limiter. Lives in this server's memory, so it only works while the site runs as ONE
 * instance (Render: keep "instances" at 1), and it resets on restart. Good enough to blunt abuse; a shared
 * store such as Redis is needed if the site is ever scaled out.
 */
const hits = new Map<string, { n: number; reset: number }>();
const MAX_KEYS = 10_000;
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  if (hits.size >= MAX_KEYS) {
    for (const [k, v] of hits) if (now > v.reset) hits.delete(k);
    if (hits.size >= MAX_KEYS) hits.clear(); // still full: start over rather than grow without limit
  }
  const h = hits.get(key);
  if (!h || now > h.reset) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  h.n += 1;
  return h.n <= limit;
}

/**
 * The visitor's IP address for rate limiting. Render's edge (Cloudflare) sets CF-Connecting-IP / True-Client-IP
 * itself and overwrites any value the visitor sends, so those are trusted first. The FIRST X-Forwarded-For entry is
 * whatever the visitor typed, so only the LAST entry (added by the proxy in front of us) is used as a fallback.
 */
export function clientIp(headers: Headers): string {
  const edge = headers.get("cf-connecting-ip") ?? headers.get("true-client-ip");
  if (edge?.trim()) return edge.trim();
  const xff = headers.get("x-forwarded-for");
  const last = xff?.split(",").map((s) => s.trim()).filter(Boolean).pop();
  return last ?? "unknown";
}

/** Subscription statuses that grant access. past_due/unpaid/canceled/incomplete do not. */
export const ACCESS_STATUSES = ["active", "trialing"] as const;
export function grantsAccess(
  status: string,
  currentPeriodEnd: string | Date | null,
  now = new Date(),
): boolean {
  if (!(ACCESS_STATUSES as readonly string[]).includes(status)) return false;
  if (currentPeriodEnd && new Date(currentPeriodEnd) < now) return false;
  return true;
}

/**
 * Statuses in which a subscription still exists and could be (or become) chargeable. While one of these exists for a
 * book, starting another checkout for the same book would risk charging the customer twice.
 * Only canceled and incomplete_expired are truly finished.
 */
export const LIVE_STATUSES = ["active", "trialing", "past_due", "unpaid", "paused", "incomplete"] as const;
export function blocksNewCheckout(statuses: readonly string[]): boolean {
  return statuses.some((s) => (LIVE_STATUSES as readonly string[]).includes(s));
}

/** Plain-language status line for the dashboard and account page. */
export function describeSubscription(
  s: { status: string; current_period_end: string | null; cancel_at_period_end: boolean },
  formatDate: (iso: string | null) => string,
  now = new Date(),
): { label: string; detail: string; needsAction: boolean } {
  const date = formatDate(s.current_period_end);
  const ended = s.current_period_end ? new Date(s.current_period_end) < now : false;
  switch (s.status) {
    case "active":
    case "trialing":
      if (ended) return { label: "Ended", detail: `Ended ${date}`, needsAction: false };
      return s.cancel_at_period_end
        ? { label: "Cancelled", detail: `Access until ${date}`, needsAction: false }
        : { label: s.status === "trialing" ? "Trial" : "Active", detail: `Renews ${date}`, needsAction: false };
    case "past_due":
    case "unpaid":
      return { label: "Payment failed", detail: "Update your card in Manage billing to restore access", needsAction: true };
    case "incomplete":
      return { label: "Payment pending", detail: "Your first payment hasn’t gone through yet", needsAction: true };
    case "paused":
      return { label: "Paused", detail: "Resume in Manage billing to restore access", needsAction: true };
    case "canceled":
      return { label: "Ended", detail: s.current_period_end ? `Ended ${date}` : "Ended", needsAction: false };
    default:
      return { label: "Ended", detail: "No longer active", needsAction: false };
  }
}
