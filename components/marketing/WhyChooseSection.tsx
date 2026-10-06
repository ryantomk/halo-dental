import { HeartHandshake, ShieldCheck, Clock, Languages, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { defaultLocale } from "@/lib/i18n";

interface WhyChooseSectionProps {
  locale?: string;
}

export default function WhyChooseSection({ locale = defaultLocale }: WhyChooseSectionProps) {
  const t = useTranslations("whyChoose");
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  const reasons = [
    {
      icon: HeartHandshake,
      title: t("reason1Title"),
      description: t("reason1Desc"),
    },
    {
      icon: ShieldCheck,
      title: t("reason2Title"),
      description: t("reason2Desc"),
    },
    {
      icon: Clock,
      title: t("reason3Title"),
      description: t("reason3Desc"),
    },
    {
      icon: Languages,
      title: t("reason4Title"),
      description: t("reason4Desc"),
    },
  ];

  return (
    <section aria-labelledby="why-choose-heading" className="bg-white py-16 sm:py-24 border-t border-brand-charcoal/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-charcoal/10 bg-brand-linen px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-brand-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
            {t("badge")}
          </div>
          <h2
            id="why-choose-heading"
            className="mt-4 font-display text-3xl font-medium text-brand-charcoal sm:text-4xl"
          >
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            {t("description")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col rounded-xl border border-brand-charcoal/10 bg-brand-linen/50 p-6 transition-all hover:bg-white hover:shadow-md hover:border-brand-gold/30"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-charcoal">
                <reason.icon className="h-6 w-6 text-brand-gold" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-brand-charcoal">
                {reason.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-brand-charcoal/70 flex-1">
                {reason.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href={`${prefix}/booking`}
            className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-charcoal shadow-sm transition-all hover:bg-brand-gold/90"
          >
            {t("ctaButton")}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
