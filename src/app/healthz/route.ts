import { connection, NextResponse } from "next/server";

/** Render health check. Answers per request, touches no database or keys, and reveals nothing. */
export async function GET() {
  await connection();
  return new NextResponse("ok", { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
