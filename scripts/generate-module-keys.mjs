// Generates the Ed25519 keypair used to sign textbook-module launch tokens.
//   node scripts/generate-module-keys.mjs [kid]
//
// The PRIVATE key is written to module-private-key.pem and is NEVER printed. *.pem is gitignored.
// This matters: the key this script replaces had to be rotated precisely because it was pasted into
// a chat, and a secret echoed to a terminal ends up in scrollback, in shell history and in any
// transcript of the session. Open the file, copy the one line it contains straight into Render, then
// delete it.
//
// Only the PUBLIC key and the kid are printed. They are safe to share: the module verifies against
// them and can be given either the PEM or, preferably, the JWKS URL.
import { generateKeyPairSync } from "node:crypto";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const kid = process.argv[2] ?? "alaskova-module-2";
const { privateKey, publicKey } = generateKeyPairSync("ed25519");

// Render wants the PEM as a single line with escaped newlines.
const privEnvLine = privateKey.export({ type: "pkcs8", format: "pem" }).toString().trim().replace(/\n/g, "\n");
const pub = publicKey.export({ type: "spki", format: "pem" }).toString().trim();

const out = resolve(process.cwd(), "module-private-key.pem");
writeFileSync(out, privEnvLine + "\n", { encoding: "utf8", mode: 0o600 });

console.log("Wrote the private key to:");
console.log("  " + out);
console.log("");
console.log("Next, on the WEBSITE service in Render > Environment:");
console.log("  ALASKOVA_MODULE_PRIVATE_KEY  = the single line in that file");
console.log(`  ALASKOVA_MODULE_KID          = ${kid}`);
console.log("");
console.log("Save, wait for Live, then check the new kid is being served:");
console.log("  curl https://alaskovaeducation.com/.well-known/jwks.json");
console.log("");
console.log("Then DELETE module-private-key.pem. The module needs no change: it reads the JWKS and");
console.log("refetches when it meets a kid it does not know.");
console.log("");
console.log("=== PUBLIC KEY (safe to share; the module does not need it if it uses the JWKS URL) ===");
console.log(pub);
