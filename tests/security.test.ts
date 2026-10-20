import { describe, expect, it } from "vitest";
import {
  blocksNewCheckout, clientIp, describeSubscription, grantsAccess, isSameOrigin, rateLimit, safeNext,
} from "@/lib/security";

describe("safeNext (open-redirect guard)", () => {
  it("allows same-site paths", () => {
    expect(safeNext("/catalogue/molecular-atlas?x=1")).toBe("/catalogue/molecular-atlas?x=1");
  });
  it.each(["https://evil.com", "//evil.com", "/\\evil.com", "javascript:alert(1)", "evil", "/a\nb", ""])(
    "rejects %j",
    (v) => expect(safeNext(v)).toBe("/dashboard"),
  );
  it("falls back for null/undefined", () => {
    expect(safeNext(null)).toBe("/dashboard");
    expect(safeNext(undefined, "/x")).toBe("/x");
  });
});

describe("isSameOrigin (CSRF)", () => {
  const site = "https://www.example.com";
  const req = (origin?: string) => new Request(site + "/api", { method: "POST", headers: origin ? { origin } : {} });
  it("accepts matching origin", () => expect(isSameOrigin(req(site), site)).toBe(true));
  it("rejects other origin", () => expect(isSameOrigin(req("https://evil.com"), site)).toBe(false));
  it("rejects missing origin", () => expect(isSameOrigin(req(), site)).toBe(false));
  it("rejects look-alike subdomain", () => expect(isSameOrigin(req("https://www.example.com.evil.com"), site)).toBe(false));
});

describe("rateLimit", () => {
  it("blocks after the limit and resets after the window", () => {
    const k = "t:" + Math.random();
    expect([1, 2, 3].map(() => rateLimit(k, 3, 1000, 0))).toEqual([true, true, true]);
    expect(rateLimit(k, 3, 1000, 10)).toBe(false);
    expect(rateLimit(k, 3, 1000, 2000)).toBe(true);
  });
});

describe("grantsAccess", () => {
  const future = new Date(Date.now() + 86_400_000);
  const past = new Date(Date.now() - 86_400_000);
  it("grants for active/trialing within period", () => {
    expect(grantsAccess("active", future)).toBe(true);
    expect(grantsAccess("trialing", future)).toBe(true);
  });
  it.each(["past_due", "unpaid", "canceled", "incomplete", "incomplete_expired", "paused"])(
    "denies %s",
    (s) => expect(grantsAccess(s, future)).toBe(false),
  );
  it("denies an active row whose period has ended", () => expect(grantsAccess("active", past)).toBe(false));
});

describe("clientIp (rate-limit key)", () => {
  const h = (o: Record<string, string>) => new Headers(o);
  it("trusts the edge-set CF-Connecting-IP over anything the visitor sends", () =>
    expect(clientIp(h({ "cf-connecting-ip": "1.2.3.4", "x-forwarded-for": "6.6.6.6" }))).toBe("1.2.3.4"));
  it("accepts True-Client-IP", () => expect(clientIp(h({ "true-client-ip": "5.5.5.5" }))).toBe("5.5.5.5"));
  it("uses the LAST X-Forwarded-For hop, not the spoofable first one", () =>
    expect(clientIp(h({ "x-forwarded-for": "6.6.6.6, 10.0.0.1, 1.2.3.4" }))).toBe("1.2.3.4"));
  it("falls back to 'unknown'", () => expect(clientIp(h({}))).toBe("unknown"));
});

describe("rateLimit memory bound", () => {
  it("keeps working after many distinct keys", () => {
    for (let i = 0; i < 10_050; i++) rateLimit(`flood:${i}`, 1, 1000, 0);
    const k = "after-flood";
    expect(rateLimit(k, 1, 1000, 5)).toBe(true);
    expect(rateLimit(k, 1, 1000, 6)).toBe(false);
  });
});

describe("blocksNewCheckout (double-charge guard)", () => {
  it.each(["active", "trialing", "past_due", "unpaid", "paused", "incomplete"])("blocks while %s", (s) =>
    expect(blocksNewCheckout(["canceled", s])).toBe(true));
  it("allows a new subscription when every earlier one is finished", () =>
    expect(blocksNewCheckout(["canceled", "incomplete_expired"])).toBe(false));
  it("allows the very first subscription", () => expect(blocksNewCheckout([])).toBe(false));
});

describe("describeSubscription", () => {
  const fmt = (iso: string | null) => (iso ? iso.slice(0, 10) : "—");
  const now = new Date("2026-06-01T00:00:00Z");
  const row = (status: string, end: string | null, cancel = false) =>
    describeSubscription({ status, current_period_end: end, cancel_at_period_end: cancel }, fmt, now);
  it("active renews", () => expect(row("active", "2026-07-01T00:00:00Z").detail).toBe("Renews 2026-07-01"));
  it("cancel at period end keeps access until the date", () =>
    expect(row("active", "2026-07-01T00:00:00Z", true)).toMatchObject({ label: "Cancelled", detail: "Access until 2026-07-01" }));
  it("a cancelled subscription never says 'Renews'", () =>
    expect(row("canceled", "2026-05-01T00:00:00Z").detail).toBe("Ended 2026-05-01"));
  it("failed payment asks the customer to act", () =>
    expect(row("past_due", "2026-07-01T00:00:00Z")).toMatchObject({ label: "Payment failed", needsAction: true }));
  it("an active row past its end date reads as ended", () =>
    expect(row("active", "2026-05-01T00:00:00Z").label).toBe("Ended"));
});
