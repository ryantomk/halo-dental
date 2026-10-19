/**
 * Locale Root Layout (app/[locale]/layout.tsx)
 *
 * WHAT THIS FILE DOES:
 * Wraps all localized pages (both English and Malayalam) with:
 * 1. An `<html lang={locale}>` tag
 * 2. NextIntlClientProvider loaded with translations for the active locale
 *
 * WHY THIS FILE EXISTS:
 * Next.js App Router root layout for the localized route group. Enables client-side
 * components (useTranslations, useLocale) to access translation keys.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * All user-facing pages: /, /ml, /services/*, /about, /blog/*, /gallery, etc.
 * (Does NOT wrap /admin routes, which live outside [locale]).
 *
 * WHAT I CAN SAFELY CHANGE HERE:
 * Top-level font classes, body attributes, analytics tags, or provider wrappers.
 *
 * WHAT I SHOULD NOT CHANGE WITHOUT UNDERSTANDING THE DEPENDENCIES:
 * - `generateStaticParams()`: Required for static HTML export (SSG) of all supported locales.
 * - `setRequestLocale(locale)`: Required for server-side static rendering with next-intl.
 */

import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/lib/i18n";
import { generateClinicJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const { locale } = params;

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();
  const clinicJsonLd = generateClinicJsonLd(locale);

  return (
    <html lang={locale}>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, address=no, email=no"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
        />
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}