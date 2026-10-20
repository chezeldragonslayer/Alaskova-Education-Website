import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { authConfigured, env } from "@/lib/env";
import { supabaseCookieOptions } from "./cookies";

/** Per-request client acting as the signed-in user (RLS applies). */
export async function createSupabaseServer() {
  const store = await cookies();
  return createServerClient(env.supabaseUrl(), env.supabaseAnonKey(), {
    cookieOptions: supabaseCookieOptions(),
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // Called from a Server Component: cookie refresh is handled by proxy.ts.
        }
      },
    },
  });
}

/**
 * Service-role client. BYPASSES RLS. Server-only: used by the Stripe webhook and
 * entitlement checks. Never import from a client component.
 */
export function createSupabaseAdmin() {
  return createAdminClient(env.supabaseUrl(), env.supabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Verified current user (validates the JWT with Supabase), or null. */
export async function getUser() {
  if (!authConfigured()) return null;
  const supabase = await createSupabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}
