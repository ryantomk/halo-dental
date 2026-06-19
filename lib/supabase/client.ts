import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client for Client Components.
 * Uses the public anon key — every query is still subject to the RLS
 * policies defined in supabase/migrations.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
