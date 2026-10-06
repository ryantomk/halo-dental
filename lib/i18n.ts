/**
 * Central Locale Configuration (Single Source of Truth)
 *
 * WHAT THIS FILE DOES:
 * Defines supported locales, default language, and human-readable names for language toggles.
 *
 * WHY THIS FILE EXISTS:
 * Ensures all parts of the app (middleware, routing, components, and language switcher)
 * use identical language definitions.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * - middleware.ts (route matching)
 * - lib/i18n-request.ts (message loading)
 * - components/layout/LanguageSwitcher.tsx (UI toggle)
 * - app/[locale]/layout.tsx (generateStaticParams)
 *
 * WHAT I CAN SAFELY CHANGE HERE:
 * - `localeNames` display labels.
 * - Adding a new locale to `locales` array (e.g., adding "ar" for Arabic, alongside messages/ar.json).
 *
 * WHAT I SHOULD NOT CHANGE WITHOUT UNDERSTANDING THE DEPENDENCIES:
 * Removing a locale or changing `defaultLocale` without updating messages/*.json and middleware.
 */

export const locales = ["en", "ml"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ml: "മലയാളം",
};
