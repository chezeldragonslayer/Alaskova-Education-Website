import { describe, expect, it } from "vitest";
import { sourceFromCookie, sourceFromParams } from "@/lib/attribution";
import { isInAppBrowser } from "@/components/InAppBrowserNotice";

const p = (q: string) => new URLSearchParams(q);

describe("source attribution (privacy-conscious)", () => {
  it("recognises Instagram links", () => {
    expect(sourceFromParams(p("utm_source=instagram"))).toBe("instagram");
    expect(sourceFromParams(p("utm_source=Instagram&utm_medium=reel"))).toBe("instagram");
    expect(sourceFromParams(p("src=ig"))).toBe("instagram");
  });
  it("ignores unknown or free-text sources, so nothing arbitrary is stored", () => {
    expect(sourceFromParams(p("utm_source=newsletter"))).toBeNull();
    expect(sourceFromParams(p("utm_source=<script>"))).toBeNull();
    expect(sourceFromParams(p(""))).toBeNull();
  });
  it("only trusts known cookie values; everything else counts as direct", () => {
    expect(sourceFromCookie("instagram")).toBe("instagram");
    expect(sourceFromCookie("hacked value")).toBe("direct");
    expect(sourceFromCookie(undefined)).toBe("direct");
  });
});

describe("Instagram's built-in browser detection", () => {
  it("detects Instagram and Facebook in-app browsers", () => {
    expect(isInAppBrowser("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Instagram 350.0.0")).toBe(true);
    expect(isInAppBrowser("Mozilla/5.0 (Linux; Android 15) [FB_IAB/FB4A;FBAV/480.0]")).toBe(true);
  });
  it("leaves normal browsers alone", () => {
    expect(isInAppBrowser("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile Safari/604.1")).toBe(false);
  });
});
