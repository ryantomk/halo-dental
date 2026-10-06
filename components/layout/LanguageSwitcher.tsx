"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { defaultLocale, locales, localeNames } from "@/lib/i18n";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const currentLocale = pathname.startsWith("/ml") ? "ml" : defaultLocale;
  const prefix = currentLocale === defaultLocale ? "" : `/${currentLocale}`;
  const localelessPath =
    prefix && pathname.startsWith(prefix) ? pathname.slice(prefix.length) || "/" : pathname;

  return (
    <div
      role="group"
      aria-label={tHeader("language")}
      className={cn("inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-white/5 p-1", className)}
    >
      {locales.map((loc) => {
        const isCurrent = loc === currentLocale;
        const targetPrefix = loc === defaultLocale ? "" : `/${loc}`;
        const targetHref = localelessPath === "/" ? (targetPrefix || "/") : `${targetPrefix}${localelessPath}`;

        return (
          <Link
            key={loc}
            href={targetHref}
            hrefLang={loc}
            lang={loc}
            aria-current={isCurrent ? "true" : undefined}
            aria-label={tHeader("switchLanguage", { name: localeNames[loc] })}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold",
              isCurrent ? "bg-brand-gold text-brand-charcoal font-semibold" : "text-white/70 hover:text-white"
            )}
          >
            {loc === "en" ? "EN" : localeNames[loc]}
          </Link>
        );
      })}
    </div>
  );
}
