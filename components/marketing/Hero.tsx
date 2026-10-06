import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Calendar, Phone, MessageCircle } from "lucide-react";
import { defaultLocale } from "@/lib/i18n";

interface HeroProps {
  locale?: string;
}

const PHONE_NUMBER = "+91 85470 85403";
const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I would like to book a consultation at Halo Dental.");

export default function Hero({ locale = defaultLocale }: HeroProps) {
  const t = useTranslations("hero");
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const bookingHref = `${prefix}/booking`;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-brand-midnight pt-6 pb-16 sm:pb-20 lg:pt-10 lg:pb-28"
    >
      {/* Background ambient gradient glow */}
      <div
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-brand-gold/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 left-0 h-96 w-96 rounded-full bg-brand-gold/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        {/* Left Column: Headline, Description & CTAs */}
        <div className="order-2 lg:order-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-brand-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
            {t("locationBadge")}
          </div>

          <h1
            id="hero-heading"
            className="mt-5 font-display text-3xl font-medium leading-[1.18] text-white sm:text-4xl md:text-5xl lg:text-[3.25rem]"
          >
            {t("titleMain")}{" "}
            <span className="text-brand-gold italic">{t("titleHighlight")}</span>
          </h1>

          <p className="mt-5 max-w-xl mx-auto lg:mx-0 text-base leading-relaxed text-white/75 sm:text-lg">
            {t("description")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
            <Link
              href={bookingHref}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-3.5 text-base font-semibold text-brand-charcoal shadow-md shadow-brand-gold/20 transition-all hover:bg-brand-gold/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {t("bookCta")}
            </Link>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[#25D366]/40 bg-[#25D366]/10 px-5 py-3.5 text-base font-medium text-white transition-all hover:bg-[#25D366]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" aria-hidden="true" />
              {t("whatsappCta")}
            </a>

            <a
              href={PHONE_TEL}
              aria-label={`Call Halo Dental at ${PHONE_NUMBER}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-3.5 text-base font-medium text-white transition-all hover:border-brand-gold hover:bg-white/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight"
            >
              <Phone className="h-4 w-4 text-brand-gold" aria-hidden="true" />
              {PHONE_NUMBER}
            </a>
          </div>

          <div className="mt-7 flex items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm text-white/60">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" />
              {t("hours")}
            </span>
            <span>&bull;</span>
            <span>{t("surgeon")}</span>
          </div>
        </div>

        {/* Right Column: Verified Before/After Visual & Quick Card */}
        <div className="relative order-1 lg:order-2 max-w-md mx-auto lg:max-w-none w-full">
          <div className="grid grid-cols-2 overflow-hidden rounded-xl border border-white/15 shadow-2xl">
            <div className="relative aspect-[3/4] bg-white/5">
              <Image
                src="/images/hero-before.jpg"
                alt={t("beforeAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-md bg-brand-midnight/80 px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase text-white backdrop-blur-sm">
                {t("before")}
              </span>
            </div>
            <div className="relative aspect-[3/4] bg-brand-gold/10">
              <Image
                src="/images/hero-after.jpg"
                alt={t("afterAlt")}
                fill
                priority
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
              <span className="absolute bottom-3 right-3 rounded-md bg-brand-gold px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase text-brand-charcoal">
                {t("after")}
              </span>
            </div>
          </div>

          {/* Floating booking preview card */}
          <div className="relative -mt-6 mx-4 rounded-xl border border-brand-charcoal/10 bg-brand-ivory p-5 shadow-xl sm:absolute sm:-bottom-6 sm:-right-4 sm:mx-0 sm:mt-0 sm:w-64 lg:-right-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
              {t("previewBadge")}
            </p>
            <p className="mt-1 font-display text-base font-semibold text-brand-charcoal">
              {t("previewTitle")}
            </p>
            <p className="mt-1 text-xs text-brand-charcoal/70">
              {t("previewDesc")}
            </p>
            <Link
              href={bookingHref}
              className="mt-3.5 inline-flex w-full items-center justify-center rounded-md bg-brand-midnight px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-charcoal"
            >
              {t("checkAvailability")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}