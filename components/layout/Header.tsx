"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultLocale } from "@/lib/i18n";

const NAV_LINKS = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "gallery", path: "/gallery" },
  { key: "contact", path: "/contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // middleware.ts uses localePrefix: "as-needed" — English has no prefix,
  // Malayalam is served under "/ml". Deriving it here from the pathname
  // keeps every link correct without depending on next-intl's navigation
  // helpers, which aren't set up elsewhere in this project yet.
  const locale = pathname.startsWith("/ml") ? "ml" : defaultLocale;
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const localelessPath =
    prefix && pathname.startsWith(prefix) ? pathname.slice(prefix.length) || "/" : pathname;

  const href = (path: string) => `${prefix}${path}`;
  const isActive = (path: string) =>
    path === "/" ? localelessPath === "/" : localelessPath.startsWith(path);

  // Subtle elevation once the page scrolls — keeps the header from feeling
  // flat against busy hero imagery without drawing attention to itself.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape closes the mobile menu.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const linkClasses =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-[box-shadow,border-color] duration-300",
        isScrolled
          ? "border-white/10 bg-brand-midnight shadow-lg shadow-black/20"
          : "border-transparent bg-brand-midnight"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
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
            <span className="text-brand-gold">Halo</span> <span className="text-white">Dental</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  href={href(link.path)}
                  aria-current={isActive(link.path) ? "page" : undefined}
                  className={cn(
                    "relative py-1 text-[15px] font-medium text-white/85 transition-colors hover:text-brand-gold",
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

        <div className="flex items-center gap-2">
          <Link
            href={href("/contact")}
            className={cn(
              "hidden rounded-md bg-brand-gold px-5 py-2.5 text-[15px] font-medium text-brand-charcoal transition-opacity hover:opacity-90 lg:inline-flex",
              linkClasses
            )}
          >
            {tCta("book")}
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className={cn("inline-flex items-center justify-center rounded-md p-2 text-white lg:hidden", linkClasses)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-white/10 bg-brand-midnight px-4 pb-6 pt-2 shadow-lg shadow-black/20 lg:hidden"
        >
          <nav aria-label="Primary">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    href={href(link.path)}
                    aria-current={isActive(link.path) ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-3 py-3 text-base font-medium text-white/85 transition-colors hover:bg-white/5 hover:text-brand-gold",
                      linkClasses,
                      isActive(link.path) && "text-brand-gold"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href={href("/contact")}
            className={cn(
              "mt-4 block rounded-md bg-brand-gold px-5 py-3 text-center text-base font-medium text-brand-charcoal transition-opacity hover:opacity-90",
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