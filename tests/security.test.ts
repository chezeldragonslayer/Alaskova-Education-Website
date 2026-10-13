import { describe, expect, it } from "vitest";
import { grantsAccess, isSameOrigin, rateLimit, safeNext } from "@/lib/security";

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
