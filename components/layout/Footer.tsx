import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import {
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { defaultLocale } from "@/lib/i18n";

const PHONE_DISPLAY = "+91 85470 85403";
const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to book an appointment at Halo Dental.");
const EMAIL = "halodentalclinic@gmail.com";
const ADDRESS = "Near Soundharya Silks, Angadipuram, Malappuram, Kerala";
const MAPS_URL = "https://maps.app.goo.gl/SBHSHyhHuvavKm4w5";
const HOURS = "Daily, 9 AM \u2013 8 PM";

// Facebook stays out of the array entirely until a real URL exists — the
// render below filters on `href`, so adding one later needs no JSX changes.
const SOCIAL_LINKS: { name: string; href: string | null; icon: LucideIcon }[] = [
  { name: "Instagram", href: "https://www.instagram.com/halo_dental_clinic", icon: Instagram },
  { name: "Facebook", href: null, icon: Facebook },
];

const QUICK_LINKS = [
  { key: "home", path: "/" },
  { key: "about", path: "/about" },
  { key: "services", path: "/services" },
  { key: "gallery", path: "/gallery" },
  { key: "contact", path: "/contact" },
] as const;

export default async function Footer() {
  // Server Component — same locale-derivation approach as ServiceGrid.tsx
  // and AboutSection.tsx.
  const locale = await getLocale();
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const t = await getTranslations("nav");
  const tCta = await getTranslations("cta");

  const ctaLinkClasses =
    "inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:border-brand-gold hover:bg-white/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight";

  return (
    <footer className="bg-brand-midnight text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
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
                <span className="text-brand-gold">Halo</span> Dental
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Cosmetic &amp; orthodontic dental care in Angadipuram, Malappuram, Kerala.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex-col">
              <Link href={`${prefix}/contact`} className={ctaLinkClasses}>
                {tCta("book")}
              </Link>
              <a href={PHONE_TEL} className={ctaLinkClasses}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                {tCta("call")}
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={ctaLinkClasses}>
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                {tCta("whatsapp")}
              </a>
            </div>
          </div>

          {/* Contact / NAP */}
          <div>
            <h3 className="font-display text-lg text-white">Get in touch</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  {ADDRESS}
                  <ExternalLink className="ml-1 inline h-3 w-3" aria-hidden="true" />
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                <a href={PHONE_TEL} className="transition-colors hover:text-white">
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
                <span>{HOURS}</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer">
            <h3 className="font-display text-lg text-white">Quick links</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {QUICK_LINKS.map((link) => (
                <li key={link.path}>
                  <Link href={`${prefix}${link.path}`} className="transition-colors hover:text-white">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social */}
          <div>
            <h3 className="font-display text-lg text-white">Follow us</h3>
            <div className="mt-4 flex gap-3">
              {SOCIAL_LINKS.filter((social) => social.href).map((social) => (
                <a
                  key={social.name}
                  href={social.href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Halo Dental on ${social.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-brand-gold hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight"
                >
                  <social.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Halo Dental Cosmetic &amp; Orthodontic Centre. All rights reserved.</p>
          <Link href={`${prefix}/privacy-policy`} className="transition-colors hover:text-white">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}