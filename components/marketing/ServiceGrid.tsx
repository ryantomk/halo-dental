import Link from "next/link";
import { getLocale } from "next-intl/server";
import {
  Anchor,
  ArrowRight,
  Layers,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultLocale } from "@/lib/i18n";

interface Service {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

// Placeholder copy matching the seeded `services` rows (slugs line up with
// supabase/seed.sql). Swap for Supabase-fetched, locale-aware name /
// short_description content once that's wired up — the Malayalam copy for
// these six is still an open item, so this component stays English-only
// for now rather than guessing at a translation.
const SERVICES: Service[] = [
  {
    slug: "smile-makeovers",
    name: "Smile makeovers",
    description: "A personalised plan that brings every part of your smile into balance.",
    icon: Smile,
  },
  {
    slug: "clear-aligners",
    name: "Clear aligners",
    description: "Straighten your teeth gradually with a virtually invisible, removable system.",
    icon: Layers,
  },
  {
    slug: "dental-implants",
    name: "Dental implants",
    description: "A secure, natural-looking replacement for a missing tooth, built to last.",
    icon: Anchor,
  },
  {
    slug: "root-canal-treatment",
    name: "Root canal treatment",
    description: "Gentle, modern care that relieves pain and saves an infected tooth.",
    icon: ShieldCheck,
  },
  {
    slug: "teeth-whitening",
    name: "Teeth whitening",
    description: "Professional whitening for a noticeably brighter smile in a single visit.",
    icon: Sparkles,
  },
  {
    slug: "general-dentistry",
    name: "General dentistry",
    description: "Routine check-ups, cleanings and preventive care for the whole family.",
    icon: Stethoscope,
  },
];

const linkFocusClasses =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2";

export default async function ServiceGrid() {
  // Server Component — no interactivity needed, so the locale comes from
  // next-intl/server. Header.tsx uses the client-side pathname version of
  // this same "as-needed" prefix logic since it needs it for active-link
  // state; this mirrors it for a server-rendered section.
  const locale = await getLocale();
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  return (
    <section aria-labelledby="services-heading" className="bg-brand-linen py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="services-heading" className="font-display text-3xl text-brand-charcoal sm:text-4xl">
            Featured services
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            From a single check-up to a complete smile transformation, every treatment is planned
            around you and carried out with the same careful attention.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <li key={service.slug} className="h-full">
              <Link
                href={`${prefix}/services/${service.slug}`}
                className={cn(
                  "group flex h-full flex-col rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md sm:p-7",
                  linkFocusClasses,
                  "focus-visible:ring-offset-brand-ivory"
                )}
              >
                <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10">
                  <service.icon className="h-6 w-6 text-brand-gold" aria-hidden="true" />
                </span>

                <h3 className="mt-5 font-display text-xl text-brand-charcoal">{service.name}</h3>

                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-brand-charcoal/70">
                  {service.description}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-charcoal">
                  Learn more
                  <ArrowRight
                    className="h-4 w-4 text-brand-gold transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <Link
            href={`${prefix}/services`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md text-[15px] font-medium text-brand-charcoal underline-offset-4 hover:underline",
              linkFocusClasses,
              "focus-visible:ring-offset-brand-linen"
            )}
          >
            View all services
            <ArrowRight className="h-4 w-4 text-brand-gold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}