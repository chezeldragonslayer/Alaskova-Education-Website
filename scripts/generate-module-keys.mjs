// Generates the Ed25519 keypair used to sign textbook-module launch tokens.
//   node scripts/generate-module-keys.mjs
// Put the PRIVATE key in the Apex website's Render env (APEX_MODULE_PRIVATE_KEY).
// Give the module agent only the PUBLIC key (or point it at /.well-known/jwks.json).
import { generateKeyPairSync } from "node:crypto";

const { privateKey, publicKey } = generateKeyPairSync("ed25519");
const priv = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const pub = publicKey.export({ type: "spki", format: "pem" }).toString();

console.log("=== APEX_MODULE_PRIVATE_KEY (secret — Apex website only) ===");
console.log(priv.trim().replace(/\n/g, "\\n"));
console.log("\n=== PUBLIC KEY (safe to share with the module) ===");
console.log(pub.trim());
