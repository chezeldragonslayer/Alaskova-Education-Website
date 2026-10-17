import { SignJWT, importPKCS8, jwtVerify, importSPKI, type CryptoKey } from "jose";
import { createPrivateKey, createPublicKey, randomUUID } from "node:crypto";

/**
 * Launch token handed to a textbook module (a separate Render service).
 * Contract is documented in docs/molecular-atlas-module-brief.md:
 *   alg EdDSA (Ed25519) · iss "alaskova-education" · aud = book slug · sub = user id
 *   book = slug · exp = 60s · jti = single-use id
 * The module holds only the PUBLIC key (or reads our JWKS) — never a shared secret.
 */
export const ISSUER = "alaskova-education";
export const TOKEN_TTL_SECONDS = 60;

/** Render/env files often store PEMs with literal "\n"; normalise. */
export const normalisePem = (pem: string) => pem.replace(/\\n/g, "\n").trim();

export async function signLaunchToken(opts: {
  privateKeyPem: string;
  kid: string;
  userId: string;
  bookSlug: string;
  now?: number; // seconds, for tests
}): Promise<string> {
  const key = await importPKCS8(normalisePem(opts.privateKeyPem), "EdDSA");
  const iat = opts.now ?? Math.floor(Date.now() / 1000);
  return new SignJWT({ book: opts.bookSlug })
    .setProtectedHeader({ alg: "EdDSA", kid: opts.kid, typ: "JWT" })
    .setIssuer(ISSUER)
    .setAudience(opts.bookSlug)
    .setSubject(opts.userId)
    .setJti(randomUUID())
    .setIssuedAt(iat)
    .setExpirationTime(iat + TOKEN_TTL_SECONDS)
    .sign(key as CryptoKey);
}

/** Public JWK derived from the private key, for /.well-known/jwks.json. */
export function publicJwk(privateKeyPem: string, kid: string) {
  const pub = createPublicKey(createPrivateKey(normalisePem(privateKeyPem)));
  const jwk = pub.export({ format: "jwk" });
  return { ...jwk, kid, alg: "EdDSA", use: "sig" };
}

/** Reference verifier (used in tests; mirrors what a module must do). */
export async function verifyLaunchToken(token: string, publicKeyPem: string, audience: string) {
  const key = await importSPKI(normalisePem(publicKeyPem), "EdDSA");
  return jwtVerify(token, key, {
    issuer: ISSUER,
    audience,
    algorithms: ["EdDSA"],
    clockTolerance: 5,
  });
}
