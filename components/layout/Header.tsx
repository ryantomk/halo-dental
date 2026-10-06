"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultLocale, locales, localeNames, type Locale } from "@/lib/i18n";

const NAV_LINKS = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "gallery", path: "/gallery" },
  { key: "faq", path: "/faq" },
  { key: "blog", path: "/blog" },
  { key: "contact", path: "/contact" },
] as const;

const linkClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight";

function LanguageToggle({
  currentLocale,
  localelessPath,
  className,
}: {
  currentLocale: Locale;
  localelessPath: string;
  className?: string;
}) {
  const tHeader = useTranslations("header");

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
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              linkClasses,
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

export default function Header() {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const tHeader = useTranslations("header");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Derive current locale from pathname (English = defaultLocale "", Malayalam = "/ml")
  const locale = pathname.startsWith("/ml") ? "ml" : defaultLocale;
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const localelessPath =
    prefix && pathname.startsWith(prefix) ? pathname.slice(prefix.length) || "/" : pathname;

  const href = (path: string) => `${prefix}${path}`;
  const isActive = (path: string) =>
    path === "/" ? localelessPath === "/" : localelessPath.startsWith(path);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock background scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key closes the mobile menu
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[box-shadow,border-color] duration-300",
        isScrolled
          ? "border-white/10 bg-brand-midnight shadow-lg shadow-black/20"
          : "border-transparent bg-brand-midnight"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand logo & title */}
        <Link href={href("/")} className={cn("flex items-center gap-2.5 rounded-md", linkClasses)}>
          <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="h-7 w-7 flex-shrink-0">
            <circle
              cx="16"
              cy="16"
              r="12"
              fill="none"
              stroke="#C9A96E"
              strokeWidth="2"
              strokeDasharray="62 14"
              strokeLinecap="round"
              transform="rotate(-90 16 16)"
            />
          </svg>
          <span className="font-display text-xl leading-none tracking-tight sm:text-2xl">
            <span className="text-brand-gold font-bold">Halo</span> <span className="text-white">Dental</span>
          </span>
        </Link>

        {/* Desktop Primary Navigation */}
        <nav aria-label="Primary" className="hidden lg:flex">
          <ul className="flex items-center gap-6 xl:gap-7">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  href={href(link.path)}
                  aria-current={isActive(link.path) ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-[14px] xl:text-[15px] font-medium text-white/85 transition-colors hover:text-brand-gold",
                    linkClasses,
                    isActive(link.path) &&
                      "text-white after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:bg-brand-gold"
                  )}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right CTA & Controls */}
        <div className="flex items-center gap-3">
          <LanguageToggle currentLocale={locale} localelessPath={localelessPath} className="hidden sm:inline-flex" />

          {/* Primary booking button points directly to /booking */}
          <Link
            href={href("/booking")}
            className={cn(
              "hidden rounded-md bg-brand-gold px-4 py-2 text-sm xl:px-5 xl:py-2.5 xl:text-[15px] font-semibold text-brand-charcoal transition-all hover:bg-brand-gold/90 hover:shadow-md sm:inline-flex",
              linkClasses
            )}
          >
            {tCta("book")}
          </Link>

          {/* Mobile hamburger menu button */}
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? tHeader("closeMenu") : tHeader("openMenu")}
            className={cn("inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 lg:hidden", linkClasses)}
          >
            {isOpen ? <X className="h-6 w-6 text-brand-gold" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-white/10 bg-brand-midnight/98 px-4 pb-6 pt-3 shadow-2xl backdrop-blur-md lg:hidden"
        >
          <nav aria-label="Mobile Primary">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    href={href(link.path)}
                    aria-current={isActive(link.path) ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-3 py-2.5 text-base font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-brand-gold",
                      linkClasses,
                      isActive(link.path) && "bg-white/5 text-brand-gold font-semibold"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 flex justify-between items-center border-t border-white/10 pt-4">
            <span className="text-xs uppercase tracking-wider text-white/50">{tHeader("language")}</span>
            <LanguageToggle currentLocale={locale} localelessPath={localelessPath} />
          </div>

          <Link
            href={href("/booking")}
            className={cn(
              "mt-4 block rounded-md bg-brand-gold px-5 py-3 text-center text-base font-semibold text-brand-charcoal transition-all hover:bg-brand-gold/90",
              linkClasses
            )}
          >
            {tCta("book")}
          </Link>
        </div>
      )}
    </header>
  );
}