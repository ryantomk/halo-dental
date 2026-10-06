import { createClient as createSupabaseClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Server-Side Admin Supabase Client (Service Role)
 *
 * WHAT THIS FILE DOES:
 * Creates a server-only Supabase client using the SUPABASE_SERVICE_ROLE_KEY.
 *
 * WHY THIS FILE EXISTS:
 * Next.js Server Actions (such as createBooking) need to perform system-level operations
 * that are protected by RLS against direct public access (e.g. checking appointment slot
 * collision and creating/linking patient records).
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * - app/actions/booking.ts (Server Action)
 * - lib/booking/availability.ts (Server-side availability verification)
 *
 * SECURITY INSTRUCTIONS:
 * 1. NEVER import this file into Client Components ("use client").
 * 2. NEVER expose the client or its credentials in API responses.
 * 3. SUPABASE_SERVICE_ROLE_KEY is server-only and not prefixed with NEXT_PUBLIC_.
 */

export function createAdminClient(): SupabaseClient<Database> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
