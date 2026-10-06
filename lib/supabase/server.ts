/**
 * Server-side Supabase Client
 *
 * WHAT THIS FILE DOES:
 * Creates an SSR Supabase client for Server Components, Route Handlers, and Server Actions.
 *
 * WHY THIS FILE EXISTS:
 * Interacts with cookies via Next.js next/headers to read session tokens and execute RLS-checked queries.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * Server Actions (e.g. appointment booking), Server Components fetching clinic data, and Admin data loaders.
 *
 * WHAT I CAN SAFELY CHANGE HERE:
 * Cookie security options or error handlers.
 *
 * WHAT I SHOULD NOT CHANGE WITHOUT UNDERSTANDING THE DEPENDENCIES:
 * The cookieStore getter/setter logic; Server Components cannot modify cookies during rendering,
 * which is why setAll is wrapped in a try/catch.
 */

import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export function createClient(): SupabaseClient<Database> {
  const cookieStore = cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Ignore when cookies cannot be set during Server Component rendering.
          }
        },
      },
    }
  ) as unknown as SupabaseClient<Database>;
}

