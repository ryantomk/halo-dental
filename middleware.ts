/**
 * Root Edge Middleware
 *
 * WHAT THIS FILE DOES:
 * Intercepts every incoming HTTP request and routes it to either:
 * 1. Supabase session refresh (for /admin/* routes)
 * 2. next-intl localization routing (for public bilingual routes / and /ml/*)
 *
 * WHY THIS FILE EXISTS:
 * Next.js Edge Middleware is the gatekeeper for URL routing, locale prefixing, and auth session sync.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * Every incoming browser request except static files, _next bundles, and API routes.
 *
 * WHAT I CAN SAFELY CHANGE HERE:
 * - localePrefix configuration or defaultLocale routing rules.
 * - Matching paths in the config.matcher regex.
 *
 * WHAT I SHOULD NOT CHANGE WITHOUT UNDERSTANDING THE DEPENDENCIES:
 * The separation between /admin routes and intlMiddleware; passing /admin to next-intl will break
 * admin URLs with unexpected locale rewrites.
 */

import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false, // "/" serves English, "/ml/..." serves Malayalam
});

export async function middleware(request: NextRequest) {
  // The admin dashboard is staff-only and not localized (see technical
  // spec Section 3 — admin routes have no /ml/ mirror), so it's routed
  // around next-intl entirely and just needs its session refreshed.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip Next internals, static files, and API routes.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
