/**
 * Internationalization Request Configuration (next-intl)
 *
 * WHAT THIS FILE DOES:
 * Loads the active translation bundle (en.json or ml.json) for the current request.
 *
 * WHY THIS FILE EXISTS:
 * Required by next-intl plugin (in next.config.mjs) to resolve messages dynamically
 * or during static page generation (SSG).
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * All public pages rendered inside app/[locale]/* and Server Components using getTranslations().
 *
 * WHAT I CAN SAFELY CHANGE HERE:
 * Fallback locale logic if an unsupported locale is requested.
 *
 * WHAT I SHOULD NOT CHANGE WITHOUT UNDERSTANDING THE DEPENDENCIES:
 * The signature of getRequestConfig or awaiting requestLocale; changing this breaks next-intl
 * static generation and causes production build failures.
 */

import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const resolved = (locales as readonly string[]).includes(requested ?? "")
    ? (requested as Locale)
    : defaultLocale;

  return {
    locale: resolved,
    messages: (await import(`../messages/${resolved}.json`)).default,
  };
});
