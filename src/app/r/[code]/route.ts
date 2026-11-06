import { connection, NextResponse } from "next/server";
import { siteUrl } from "@/lib/env";

/**
 * The refer-a-friend program has ended. Links people already shared (/r/CODE) still work: they go to the home page.
 * No cookie is set and nothing is recorded.
 */
export async function GET() {
  await connection();
  const res = NextResponse.redirect(`${siteUrl()}/`, { status: 308 });
  res.headers.set("X-Robots-Tag", "noindex");
  return res;
}
