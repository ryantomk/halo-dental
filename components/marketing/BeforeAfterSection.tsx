import BeforeAfterSlider from "./BeforeAfterSlider";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles } from "lucide-react";
import { defaultLocale } from "@/lib/i18n";

interface BeforeAfterSectionProps {
  locale?: string;
}

export default function BeforeAfterSection({ locale = defaultLocale }: BeforeAfterSectionProps) {
  const t = useTranslations("showcase");
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  return (
    <section aria-labelledby="showcase-heading" className="bg-brand-linen py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-charcoal/10 bg-white px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-brand-gold">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {t("badge")}
          </div>
          <h2
            id="showcase-heading"
            className="mt-4 font-display text-3xl font-medium text-brand-charcoal sm:text-4xl"
          >
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            {t("description")}
          </p>
        </div>

        <BeforeAfterSlider />

        <div className="mt-10 text-center">
          <Link
            href={`${prefix}/booking`}
            className="inline-flex items-center gap-2 rounded-md bg-brand-midnight px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-charcoal"
          >
            {t("ctaButton")}
            <ArrowRight className="h-4 w-4 text-brand-gold" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
