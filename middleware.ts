import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed", // "/" serves English, "/ml/..." serves Malayalam
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
