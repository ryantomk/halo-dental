import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Anchor,
  ArrowRight,
  Layers,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  HeartHandshake,
  Scan,
  Shield,
  Wand2,
  Calendar,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultLocale } from "@/lib/i18n";

export interface ServiceItem {
  slug: string;
  name: string;
  category: string;
  description: string;
  icon: LucideIcon;
}

// 11 verified clinical procedures from project specification & database schema
export const VERIFIED_SERVICES: ServiceItem[] = [
  {
    slug: "smile-makeovers",
    name: "Smile Makeovers",
    category: "Cosmetic Dentistry",
    description: "A tailored aesthetic plan harmonizing teeth alignment, color, and symmetry.",
    icon: Smile,
  },
  {
    slug: "clear-aligners",
    name: "Clear Aligners",
    category: "Orthodontics",
    description: "Virtually invisible, removable aligners designed for discreet teeth straightening.",
    icon: Layers,
  },
  {
    slug: "dental-implants",
    name: "Dental Implants",
    category: "Implants & Restorative",
    description: "Permanent titanium and ceramic replacements designed to restore full chewing and aesthetics.",
    icon: Anchor,
  },
  {
    slug: "root-canal-treatment",
    name: "Root Canal Treatment",
    category: "Endodontics",
    description: "Modern, gentle endodontic care to alleviate pain and preserve your natural tooth.",
    icon: ShieldCheck,
  },
  {
    slug: "teeth-whitening",
    name: "Teeth Whitening",
    category: "Cosmetic Dentistry",
    description: "In-clinic professional whitening lifting everyday coffee, tea, and aging stains.",
    icon: Sparkles,
  },
  {
    slug: "veneers",
    name: "Porcelain Veneers",
    category: "Cosmetic Dentistry",
    description: "Handcrafted porcelain facings correcting chips, minor gaps, and deep discolorations.",
    icon: Wand2,
  },
  {
    slug: "orthodontics",
    name: "Orthodontics & Braces",
    category: "Orthodontics",
    description: "Custom alignment systems correcting crowding, spacing, and bite irregularities.",
    icon: Layers,
  },
  {
    slug: "general-dentistry",
    name: "General & Preventive Care",
    category: "General Dentistry",
    description: "Routine check-ups, ultrasonic hygiene cleanings, and proactive oral healthcare.",
    icon: Stethoscope,
  },
  {
    slug: "pediatric-dentistry",
    name: "Pediatric Dentistry",
    category: "Children's Dental Care",
    description: "Patient, friendly dental check-ups and preventative care for children and teens.",
    icon: HeartHandshake,
  },
  {
    slug: "crowns-bridges",
    name: "Crowns & Fixed Bridges",
    category: "Restorative Dentistry",
    description: "Precision-milled ceramic crowns to reinforce damaged teeth or bridge gaps seamlessly.",
    icon: Shield,
  },
  {
    slug: "digital-diagnostics",
    name: "Digital Radiography & Diagnostics",
    category: "Diagnostics",
    description: "Low-radiation digital imaging enabling precise, transparent treatment discussions.",
    icon: Scan,
  },
];

interface ServiceGridProps {
  locale?: string;
  limit?: number;
}

export default function ServiceGrid({ locale = defaultLocale, limit }: ServiceGridProps) {
  const t = useTranslations("services");
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const displayedServices = limit ? VERIFIED_SERVICES.slice(0, limit) : VERIFIED_SERVICES;

  return (
    <section aria-labelledby="services-heading" className="bg-brand-linen py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-charcoal/10 bg-white/60 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-brand-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
            {t("badge")}
          </div>
          <h2 id="services-heading" className="mt-4 font-display text-3xl font-medium text-brand-charcoal sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            {t("description")}
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedServices.map((service) => (
            <li key={service.slug} className="h-full">
              <div
                className={cn(
                  "group flex h-full flex-col justify-between rounded-xl border border-brand-charcoal/10 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-lg sm:p-7"
                )}
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold transition-colors group-hover:bg-brand-gold group-hover:text-brand-charcoal">
                      <service.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-brand-linen px-2.5 py-0.5 text-[11px] font-medium text-brand-charcoal/65">
                      {t(`items.${service.slug}.category` as any)}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-xl font-semibold text-brand-charcoal">
                    {t(`items.${service.slug}.name` as any)}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/70">
                    {t(`items.${service.slug}.description` as any)}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-brand-charcoal/10 pt-4 text-xs font-medium">
                  <Link
                    href={`${prefix}/services/${service.slug}`}
                    className="inline-flex items-center gap-1 text-brand-charcoal hover:text-brand-gold transition-colors"
                  >
                    {t("treatmentDetails")}
                    <ArrowRight className="h-3.5 w-3.5 text-brand-gold transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                  <Link
                    href={`${prefix}/booking`}
                    className="inline-flex items-center gap-1 text-brand-gold font-semibold hover:underline"
                  >
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {t("book")}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <Link
            href={`${prefix}/services`}
            className="inline-flex items-center gap-2 rounded-md bg-brand-midnight px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-charcoal"
          >
            {t("exploreAll")}
            <ArrowRight className="h-4 w-4 text-brand-gold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}