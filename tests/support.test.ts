import { describe, expect, it } from "vitest";
import { contactSchema, displayName, isLikelyBot } from "@/lib/support";

const ok = { name: "Sam Lee", email: " Sam@Example.com ", topic: "billing", message: "I was charged twice this month." };

describe("contact form validation", () => {
  it("accepts a normal message and normalises the email", () => {
    const r = contactSchema.safeParse(ok);
    expect(r.success).toBe(true);
    expect(r.success && r.data.email).toBe("sam@example.com");
  });
  it.each([
    ["missing name", { ...ok, name: "  " }],
    ["bad email", { ...ok, email: "not-an-email" }],
    ["unknown topic", { ...ok, topic: "hacking" }],
    ["message too short", { ...ok, message: "help" }],
    ["message too long", { ...ok, message: "x".repeat(5001) }],
    ["name too long", { ...ok, name: "x".repeat(101) }],
  ])("rejects %s", (_, input) => expect(contactSchema.safeParse(input).success).toBe(false));
});

describe("honeypot", () => {
  it("flags a filled hidden field", () => expect(isLikelyBot("http://spam.example")).toBe(true));
  it("lets people through", () => {
    expect(isLikelyBot("")).toBe(false);
    expect(isLikelyBot(null)).toBe(false);
  });
});

describe("displayName", () => {
  it("prefers full_name from email sign-up", () => expect(displayName({ full_name: "Ana Ruiz", name: "x" })).toBe("Ana Ruiz"));
  it("falls back to name from Google/Microsoft", () => expect(displayName({ name: "Kim Ng" })).toBe("Kim Ng"));
  it("is empty when there is none", () => expect(displayName(undefined)).toBe(""));
});
