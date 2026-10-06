import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import {
  Clock,
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Calendar,
} from "lucide-react";
import { defaultLocale } from "@/lib/i18n";

const PHONE_DISPLAY = "+91 85470 85403";
const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to book an appointment at Halo Dental.");
const EMAIL = "halodentalclinic@gmail.com";
const MAPS_URL = "https://maps.app.goo.gl/SBHSHyhHuvavKm4w5";

const QUICK_LINKS = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "gallery", path: "/gallery" },
  { key: "faq", path: "/faq" },
  { key: "blog", path: "/blog" },
  { key: "contact", path: "/contact" },
] as const;

export default async function Footer() {
  const locale = await getLocale();
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const t = await getTranslations("nav");
  const tCta = await getTranslations("cta");
  const tFooter = await getTranslations("footer");

  const ctaLinkClasses =
    "inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-brand-gold hover:bg-white/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight";

  return (
    <footer className="bg-brand-midnight text-white/80 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + CTAs */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={prefix || "/"} className="flex items-center gap-2.5">
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
              <span className="font-display text-xl leading-none tracking-tight text-white">
                <span className="text-brand-gold font-bold">Halo</span> Dental
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-white/65">
              {tFooter("tagline")}
            </p>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:flex-col">
              {/* Primary booking button explicitly points to /booking */}
              <Link href={`${prefix}/booking`} className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-sm font-semibold text-brand-charcoal transition-all hover:bg-brand-gold/90">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {tCta("book")}
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={ctaLinkClasses}>
                <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
                {tCta("whatsapp")}
              </a>
              <a href={PHONE_TEL} className={ctaLinkClasses}>
                <Phone className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                {tCta("call")}
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-display text-base font-semibold uppercase tracking-wider text-white">{tFooter("contactTitle")}</h3>
            <ul className="mt-4 space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {tFooter("address")}
                  <ExternalLink className="ml-1 inline h-3 w-3 opacity-60" aria-hidden="true" />
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                <a href={PHONE_TEL} className="transition-colors hover:text-white font-medium">
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                <a href={`mailto:${EMAIL}`} className="break-all transition-colors hover:text-white">
                  {EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                <span className="text-white/85">{tFooter("hours")}</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer Navigation">
            <h3 className="font-display text-base font-semibold uppercase tracking-wider text-white">{tFooter("quickLinksTitle")}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link href={`${prefix}${link.path}`} className="transition-colors hover:text-brand-gold">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={`${prefix}/booking`} className="text-brand-gold font-medium transition-colors hover:underline">
                  {tFooter("onlineBooking")}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social & Verification */}
          <div>
            <h3 className="font-display text-base font-semibold uppercase tracking-wider text-white">{tFooter("connectTitle")}</h3>
            <p className="mt-4 text-xs leading-relaxed text-white/60">
              {tFooter("socialDescription")}
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.instagram.com/halo_dental_clinic"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tFooter("instagramAria")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all hover:border-brand-gold hover:text-brand-gold hover:scale-105"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={tFooter("whatsappAria")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all hover:border-[#25D366] hover:text-[#25D366] hover:scale-105"
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-6 rounded-md bg-white/5 p-3 text-xs text-white/60 border border-white/10">
              <span className="font-semibold text-brand-gold block">{tFooter("bilingualCareTitle")}</span>
              {tFooter("bilingualCareDesc")}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {tFooter("allRightsReserved")}</p>
          <div className="flex gap-6">
            <Link href={`${prefix}/privacy-policy`} className="transition-colors hover:text-white">
              {tFooter("privacyPolicy")}
            </Link>
            <Link href={`${prefix}/contact`} className="transition-colors hover:text-white">
              {tFooter("contact")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}