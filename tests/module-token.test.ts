import { describe, expect, it } from "vitest";
import { generateKeyPairSync } from "node:crypto";
import { SignJWT } from "jose";
import { ISSUER, publicJwk, signLaunchToken, verifyLaunchToken } from "@/lib/module-token";

const pair = () => {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  return {
    priv: privateKey.export({ type: "pkcs8", format: "pem" }).toString(),
    pub: publicKey.export({ type: "spki", format: "pem" }).toString(),
  };
};
const k = pair();
const sign = (over: Partial<Parameters<typeof signLaunchToken>[0]> = {}) =>
  signLaunchToken({ privateKeyPem: k.priv, kid: "k1", userId: "user-1", bookSlug: "molecular-atlas", ...over });

describe("launch token", () => {
  it("round-trips with the documented claims", async () => {
    const { payload, protectedHeader } = await verifyLaunchToken(await sign(), k.pub, "molecular-atlas");
    expect(protectedHeader).toMatchObject({ alg: "EdDSA", kid: "k1" });
    expect(payload).toMatchObject({ iss: ISSUER, aud: "molecular-atlas", sub: "user-1", book: "molecular-atlas" });
    expect(payload.jti).toBeTruthy();
    expect(payload.exp! - payload.iat!).toBe(60);
  });

  it("gives every token a unique jti", async () => {
    const a = await verifyLaunchToken(await sign(), k.pub, "molecular-atlas");
    const b = await verifyLaunchToken(await sign(), k.pub, "molecular-atlas");
    expect(a.payload.jti).not.toBe(b.payload.jti);
  });

  it("rejects the wrong audience", async () => {
    await expect(verifyLaunchToken(await sign(), k.pub, "another-book")).rejects.toThrow();
  });

  it("rejects an expired token", async () => {
    const old = await sign({ now: Math.floor(Date.now() / 1000) - 3600 });
    await expect(verifyLaunchToken(old, k.pub, "molecular-atlas")).rejects.toThrow();
  });

  it("rejects a token signed by a different key", async () => {
    const other = pair();
    await expect(verifyLaunchToken(await sign({ privateKeyPem: other.priv }), k.pub, "molecular-atlas")).rejects.toThrow();
  });

  it("rejects a tampered payload", async () => {
    const [h, , s] = (await sign()).split(".");
    const forged = Buffer.from(JSON.stringify({ iss: ISSUER, aud: "molecular-atlas", sub: "attacker", book: "molecular-atlas", exp: 9999999999 })).toString("base64url");
    await expect(verifyLaunchToken(`${h}.${forged}.${s}`, k.pub, "molecular-atlas")).rejects.toThrow();
  });

  it("rejects alg:none", async () => {
    const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const none = `${b64({ alg: "none", typ: "JWT" })}.${b64({ iss: ISSUER, aud: "molecular-atlas", sub: "x", exp: 9999999999 })}.`;
    await expect(verifyLaunchToken(none, k.pub, "molecular-atlas")).rejects.toThrow();
  });

  it("rejects a token with the wrong issuer", async () => {
    const { importPKCS8 } = await import("jose");
    const key = await importPKCS8(k.priv, "EdDSA");
    const t = await new SignJWT({}).setProtectedHeader({ alg: "EdDSA" }).setIssuer("someone-else").setAudience("molecular-atlas").setExpirationTime("1m").sign(key);
    await expect(verifyLaunchToken(t, k.pub, "molecular-atlas")).rejects.toThrow();
  });

  it("accepts PEMs stored with literal \\n (Render env style)", async () => {
    const escaped = k.priv.trim().replace(/\n/g, "\\n");
    const t = await sign({ privateKeyPem: escaped });
    await expect(verifyLaunchToken(t, k.pub, "molecular-atlas")).resolves.toBeTruthy();
  });

  it("publishes only the public half in the JWKS", () => {
    const jwk = publicJwk(k.priv, "k1") as Record<string, unknown>;
    expect(jwk).toMatchObject({ kty: "OKP", crv: "Ed25519", alg: "EdDSA", kid: "k1", use: "sig" });
    expect(jwk.d).toBeUndefined();
  });
});
