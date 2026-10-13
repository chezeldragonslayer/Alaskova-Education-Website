import { connection, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { publicJwk } from "@/lib/module-token";


/** Public key set so textbook modules can verify launch tokens without any shared secret. */
export async function GET() {
  await connection(); // evaluate per request, never frozen at build time
  try {
    const jwk = publicJwk(env.moduleSigningKeyPem(), env.moduleKeyId());
    return NextResponse.json(
      { keys: [jwk] },
      { headers: { "Cache-Control": "public, max-age=300" } },
    );
  } catch {
    return NextResponse.json({ keys: [] }, { status: 503 });
  }
}
