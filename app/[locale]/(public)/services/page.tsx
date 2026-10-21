import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
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
import { defaultLocale } from "@/lib/i18n";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return constructMetadata({
    title:
      locale === "ml"
        ? "ദന്തചികിത്സകൾ | ഹാലോ ഡെന്റൽ ക്ലിനിക്ക് അങ്ങാടിപ്പുറം, മലപ്പുറം"
        : "Dental Treatments in Angadipuram, Malappuram | Halo Dental",
    description:
      locale === "ml"
        ? "സ്മൈൽ മേക്കോവറുകൾ, ക്ലിയർ അലൈനറുകൾ, ഇംപ്ലാന്റുകൾ, വേദനയില്ലാത്ത റൂട്ട് കനാൽ, ടീത്ത് വൈറ്റനിംഗ്, വെനീറുകൾ എന്നിവ അങ്ങാടിപ്പുറത്തെ ഹാലോ ഡെന്റലിൽ ലഭ്യമാണ്."
        : "Explore smile makeovers, clear aligners, dental implants, root canal treatment, teeth whitening, veneers and general dentistry at Halo Dental in Angadipuram, Malappuram.",
    path: "/services",
    locale,
  });
}

import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

interface ServiceStatic {
  slug: string;
  category?: string;
  name_en: string;
  name_ml?: string | null;
  short_description_en?: string | null;
  short_description_ml?: string | null;
  description_en?: string | null;
  description_ml?: string | null;
  image_url?: string | null;
}

interface ServiceDbRow {
  id: string;
  slug: string;
  name_en: string;
  name_ml: string | null;
  category: string;
  short_description_en: string | null;
  short_description_ml: string | null;
  description_en: string | null;
  description_ml: string | null;
  image_url?: string | null;
  sort_order: number;
}

const STATIC_FALLBACK_SERVICES: ServiceStatic[] = [
  { slug: "smile-makeovers", category: "cosmetic", name_en: "Smile Makeovers" },
  { slug: "clear-aligners", category: "orthodontics", name_en: "Clear Aligners" },
  { slug: "dental-implants", category: "implants", name_en: "Dental Implants" },
  { slug: "root-canal-treatment", category: "restorative", name_en: "Root Canal Treatment" },
  { slug: "teeth-whitening", category: "cosmetic", name_en: "Teeth Whitening" },
  { slug: "veneers", category: "cosmetic", name_en: "Porcelain Veneers" },
  { slug: "general-dentistry", category: "general", name_en: "General Dentistry" },
];

function getServiceIcon(slug: string, category?: string | null): LucideIcon {
  switch (slug) {
    case "smile-makeovers":
      return Smile;
    case "clear-aligners":
      return Layers;
    case "dental-implants":
      return Anchor;
    case "root-canal-treatment":
      return ShieldCheck;
    case "teeth-whitening":
    case "veneers":
      return Sparkles;
    case "general-dentistry":
      return Stethoscope;
  }
  switch (category) {
    case "cosmetic":
      return Sparkles;
    case "orthodontics":
      return Layers;
    case "implants":
      return Anchor;
    case "restorative":
      return ShieldCheck;
    case "pediatric":
      return Smile;
    case "general":
    default:
      return Stethoscope;
  }
}

async function getPublicServices(): Promise<(ServiceDbRow | ServiceStatic)[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return STATIC_FALLBACK_SERVICES;

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("services")
      .select("id, slug, name_en, name_ml, category, short_description_en, short_description_ml, description_en, description_ml, image_url, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return STATIC_FALLBACK_SERVICES;
    }
    return data as ServiceDbRow[];
  } catch {
    return STATIC_FALLBACK_SERVICES;
  }
}

export default async function Page({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const t = await getTranslations("services");
  const tCta = await getTranslations("cta");
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  const services = await getPublicServices();

  return (
    <main>
      {/* Hero */}
      <section className="bg-brand-midnight">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2 text-sm text-white/60">
              <li>
                <Link href={prefix || "/"} className="transition-colors hover:text-white">
                  {t("breadcrumbHome")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">
                {t("breadcrumbServices")}
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">{t("pageHeading")}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            {t("pageDescription")}
          </p>

          <Link
            href={`${prefix}/booking`}
            className="mt-8 inline-flex items-center gap-1.5 rounded-md bg-brand-gold px-5 py-2.5 text-[15px] font-medium text-brand-charcoal transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight"
          >
            {tCta("book")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Services grid */}
      <section aria-label="All services" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = getServiceIcon(service.slug, service.category);

              let displayName = locale === "ml" && service.name_ml ? service.name_ml : service.name_en;
              try {
                if (t.has(`items.${service.slug}.name`)) {
                  displayName = locale === "ml"
                    ? (service.name_ml || t(`items.${service.slug}.name` as any))
                    : (t(`items.${service.slug}.name` as any) || service.name_en);
                }
              } catch {
                // Keep database name fallback
              }

              let displayDesc = locale === "ml"
                ? (service.short_description_ml || service.description_ml || service.short_description_en || service.description_en || "")
                : (service.short_description_en || service.description_en || "");
              try {
                if (t.has(`items.${service.slug}.description`)) {
                  displayDesc = locale === "ml"
                    ? (service.short_description_ml || t(`items.${service.slug}.description` as any))
                    : (service.short_description_en || t(`items.${service.slug}.description` as any));
                }
              } catch {
                // Keep database description fallback
              }

              return (
                <li key={service.slug}>
                  <Link
                    href={`${prefix}/services/${service.slug}`}
                    className="group flex h-full flex-col rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:p-7"
                  >
                    {service.image_url ? (
                      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md bg-brand-charcoal/5">
                        <Image
                          src={service.image_url}
                          alt={displayName}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10">
                        <Icon className="h-6 w-6 text-brand-gold" aria-hidden="true" />
                      </span>
                    )}

                    <h3 className="mt-5 font-display text-xl text-brand-charcoal">
                      {displayName}
                    </h3>

                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-brand-charcoal/70">
                      {displayDesc}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-charcoal">
                      {t("treatmentDetails")}
                      <ArrowRight
                        className="h-4 w-4 text-brand-gold transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl text-brand-charcoal sm:text-3xl">
            {t("closingTitle")}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-charcoal/70">
            {t("closingDesc")}
          </p>
          <Link
            href={`${prefix}/booking`}
            className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-brand-gold px-5 py-2.5 text-[15px] font-medium text-brand-charcoal transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-linen"
          >
            {tCta("book")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: locale === "ml" ? "ഹോം" : "Home", url: prefix || "/" },
              { name: locale === "ml" ? "ചികിത്സകൾ" : "Services", url: `${prefix}/services` },
            ])
          ),
        }}
      />
    </main>
  );
}