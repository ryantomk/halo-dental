import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight, CheckCircle2, Clock, Languages, ListChecks, Calendar } from "lucide-react";
import { defaultLocale } from "@/lib/i18n";

interface AboutSectionProps {
  locale?: string;
}

export default function AboutSection({ locale = defaultLocale }: AboutSectionProps) {
  const t = useTranslations("about");
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  const highlights = [
    t("highlight1"),
    t("highlight2"),
    t("highlight3"),
    t("highlight4"),
  ];

  const stats = [
    { icon: Clock, value: t("stat1Value"), label: t("stat1Label") },
    { icon: ListChecks, value: t("stat2Value"), label: t("stat2Label") },
    { icon: Languages, value: t("stat3Value"), label: t("stat3Label") },
  ];

  return (
    <section aria-labelledby="about-heading" className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Doctor Portrait Placeholder Card: Structured cleanly for real photo replacement */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-brand-midnight via-[#1f2d3a] to-[#121a22] shadow-2xl sm:aspect-[5/6]">
              {/* Geometric halo emblem background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-15">
                <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" className="h-64 w-64">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#C9A96E"
                    strokeWidth="1.5"
                    strokeDasharray="430 90"
                    transform="rotate(-90 100 100)"
                  />
                </svg>
              </div>

              {/* Silhouette / Doctor representation container */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <p className="mt-4 font-display text-2xl font-medium text-white">{t("drHaseeb")}</p>
                <p className="mt-1 text-sm font-medium text-brand-gold">{t("chiefSurgeon")}</p>
                <span className="mt-2 text-xs text-white/50 tracking-wider uppercase">{t("clinicLocation")}</span>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">{t("leadershipTitle")}</p>
                <p className="mt-1 text-xs text-white/70 leading-relaxed">
                  {t("leadershipDesc")}
                </p>
              </div>
            </div>

            {/* Overlapping badge */}
            <div className="absolute -bottom-5 right-4 hidden sm:flex items-center gap-3 rounded-xl border border-brand-charcoal/10 bg-brand-ivory p-4 shadow-xl">
              <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-gold/20">
                <CheckCircle2 className="h-5 w-5 text-brand-charcoal" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">{t("patientFirst")}</p>
                <p className="text-xs font-medium text-brand-charcoal">{t("patientFirstDesc")}</p>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
              {t("badge")}
            </div>

            <h2 id="about-heading" className="mt-3 font-display text-3xl font-medium text-brand-charcoal sm:text-4xl">
              {t("heading")}
            </h2>

            <p className="mt-5 text-base leading-relaxed text-brand-charcoal/80">
              {t("description")}
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-brand-charcoal">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-y border-brand-charcoal/10 py-5">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-xl font-bold text-brand-charcoal sm:text-2xl">{s.value}</p>
                  <p className="mt-1 text-xs text-brand-charcoal/70 leading-snug">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={`${prefix}/booking`}
                className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-charcoal transition-all hover:bg-brand-gold/90 hover:shadow-md"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {t("bookConsultation")}
              </Link>
              <Link
                href={`${prefix}/about`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-charcoal underline-offset-4 hover:underline"
              >
                {t("learnMore")}
                <ArrowRight className="h-4 w-4 text-brand-gold" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}