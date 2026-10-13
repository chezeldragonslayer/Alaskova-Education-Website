import { NextResponse, type NextRequest } from "next/server";
import { env, siteUrl } from "@/lib/env";
import { getBook } from "@/lib/catalogue";
import { getUser } from "@/lib/supabase/server";
import { hasAccess } from "@/lib/access";
import { signLaunchToken } from "@/lib/module-token";


const go = (url: string) =>
  NextResponse.redirect(url, {
    headers: { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" },
  });

/**
 * "Read" button target. Authorises on the SERVER, then hands the browser to the
 * textbook module with a 60-second, single-use signed pass. Also called by the
 * module when its own session expires, which is how cancellations take effect.
 */
export async function GET(_request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const site = siteUrl();
  const book = getBook(slug);
  if (!book) return go(`${site}/catalogue`);

  const user = await getUser().catch(() => null);
  if (!user) return go(`${site}/login?next=${encodeURIComponent(`/read/${slug}`)}`);

  if (!(await hasAccess(user.id, slug))) return go(`${site}/catalogue/${slug}?access=required`);

  const moduleUrl = env.moduleUrlForBook(slug);
  if (!moduleUrl) return go(`${site}/dashboard?reader=coming-soon`);

  const target = new URL("/launch", moduleUrl);
  const isLocal = target.hostname === "localhost" || target.hostname === "127.0.0.1";
  if (target.protocol !== "https:" && !isLocal) {
    console.error("MODULE_URL must be https in production");
    return go(`${site}/dashboard?reader=error`);
  }

  const token = await signLaunchToken({
    privateKeyPem: env.moduleSigningKeyPem(),
    kid: env.moduleKeyId(),
    userId: user.id,
    bookSlug: slug,
  });
  target.searchParams.set("token", token);
  return go(target.toString());
}
