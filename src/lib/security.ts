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

/** Tiny fixed-window limiter (per server instance; good enough to blunt abuse). */
const hits = new Map<string, { n: number; reset: number }>();
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()) {
  const h = hits.get(key);
  if (!h || now > h.reset) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return true;
  }
  h.n += 1;
  return h.n <= limit;
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
