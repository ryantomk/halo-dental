/**
 * Supabase Middleware Session Refresh
 *
 * WHAT THIS FILE DOES:
 * Refreshes Supabase authentication tokens in cookies on incoming /admin/* requests.
 *
 * WHY THIS FILE EXISTS:
 * Next.js Server Components cannot set cookies directly. Running token refresh in middleware
 * keeps admin sessions alive before server components or routes process the request.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * Invoked by middleware.ts for all /admin routes (login, dashboard, staff management).
 *
 * WHAT I CAN SAFELY CHANGE HERE:
 * Logging formatting, fallback behavior for unconfigured environments.
 *
 * WHAT I SHOULD NOT CHANGE WITHOUT UNDERSTANDING THE DEPENDENCIES:
 * The cookie getAll/setAll proxy callbacks and the supabase.auth.getUser() call.
 * Breaking cookie sync will cause login sessions to expire prematurely or fail auth guards.
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Updates and refreshes the Supabase auth session cookie.
 *
 * Input:
 * - request: NextRequest object for the incoming HTTP request
 *
 * Does:
 * - Checks for valid Supabase environment variables (fails safely if missing)
 * - Creates an SSR Supabase client wired to request/response cookies
 * - Calls supabase.auth.getUser() to refresh session cookies
 *
 * Returns:
 * - NextResponse with refreshed cookie headers attached
 *
 * IMPORTANT:
 * - Must fail safely when credentials are not configured (returns neutral response).
 * - Must never log or leak SUPABASE_ANON_KEY or auth tokens in errors.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Fail safely if Supabase is not configured in this environment
    return response;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(
            cookiesToSet: {
              name: string;
              value: string;
              options?: Parameters<typeof response.cookies.set>[2];
            }[]
          ) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });

            response = NextResponse.next({ request });

            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isLoginPage = request.nextUrl.pathname === "/admin/login";

    // Unauthenticated users visiting any protected /admin route -> redirect to /admin/login
    if (!user && !isLoginPage) {
      const redirectUrl = new URL("/admin/login", request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      // Copy cookies across redirect
      request.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value));
      return redirectResponse;
    }

    // Authenticated users visiting /admin/login -> redirect to /admin
    if (user && isLoginPage) {
      const redirectUrl = new URL("/admin", request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);
      request.cookies.getAll().forEach((c) => redirectResponse.cookies.set(c.name, c.value));
      return redirectResponse;
    }
  } catch (error) {
    // Fail safely if session refresh encounters an unexpected error without exposing secrets
    console.error("[supabase/middleware] Error updating session:", error instanceof Error ? error.message : "Unknown error");
  }

  return response;
}
