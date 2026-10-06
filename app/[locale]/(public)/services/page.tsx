import type { Metadata } from "next";
import Link from "next/link";
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

interface ServiceStatic {
  slug: string;
  icon: LucideIcon;
}

const SERVICES: ServiceStatic[] = [
  { slug: "smile-makeovers", icon: Smile },
  { slug: "clear-aligners", icon: Layers },
  { slug: "dental-implants", icon: Anchor },
  { slug: "root-canal-treatment", icon: ShieldCheck },
  { slug: "teeth-whitening", icon: Sparkles },
  { slug: "veneers", icon: Sparkles },
  { slug: "general-dentistry", icon: Stethoscope },
];

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
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`${prefix}/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:p-7"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10">
                    <service.icon className="h-6 w-6 text-brand-gold" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 font-display text-xl text-brand-charcoal">
                    {t(`items.${service.slug}.name` as any)}
                  </h3>

                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-brand-charcoal/70">
                    {t(`items.${service.slug}.description` as any)}
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
            ))}
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