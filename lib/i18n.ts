// Central locale configuration — single source of truth, imported by
// middleware.ts, lib/i18n-request.ts, and LanguageSwitcher.tsx.

export const locales = ["en", "ml"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ml: "മലയാളം",
};
