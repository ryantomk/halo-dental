"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Calendar } from "lucide-react";
import { defaultLocale } from "@/lib/i18n";

export default function FloatingBookingWidget() {
  const t = useTranslations("floating");
  const pathname = usePathname();

  // If already on booking page, hide floating widget
  if (pathname.includes("/booking")) {
    return null;
  }

  const locale = pathname.startsWith("/ml") ? "ml" : defaultLocale;
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const bookingHref = `${prefix}/booking`;

  return (
    <aside aria-label={t("bookingAria")} className="fixed bottom-6 left-6 z-40">
      <Link
        href={bookingHref}
        aria-label={t("bookingAria")}
        className="group flex items-center gap-2.5 rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-charcoal shadow-lg shadow-brand-midnight/20 transition-all duration-300 hover:scale-105 hover:bg-brand-gold/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <Calendar className="h-4 w-4 transition-transform group-hover:-rotate-12" aria-hidden="true" />
        <span className="tracking-wide">
          {t("bookingText")}
        </span>
      </Link>
    </aside>
  );
}
