/**
 * Browser-side Supabase Client
 *
 * WHAT THIS FILE DOES:
 * Creates a Supabase client for use inside Client Components ("use client").
 *
 * WHY THIS FILE EXISTS:
 * Enables browser-side Supabase operations (e.g. auth state listeners, realtime subscriptions)
 * using the public anon key.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * Client-rendered components, login form, real-time widgets.
 *
 * WHAT I CAN SAFELY CHANGE HERE:
 * Client options (e.g. auth storage key, realtime settings).
 *
 * WHAT I SHOULD NOT CHANGE WITHOUT UNDERSTANDING THE DEPENDENCIES:
 * Switching to a service role key here would expose master admin rights to the browser!
 */

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export function createClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey) as unknown as SupabaseClient<Database>;
}

