import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

// Loads the per-locale message bundle for the current request.
// Referenced by next.config.mjs via createNextIntlPlugin().
export default getRequestConfig(async ({ locale }) => {
  const resolved = (locales as readonly string[]).includes(locale ?? "")
    ? (locale as Locale)
    : defaultLocale;

  return {
    locale: resolved,
    messages: (await import(`../messages/${resolved}.json`)).default,
  };
});
