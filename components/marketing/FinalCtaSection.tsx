import Link from "next/link";
import { useTranslations } from "next-intl";
import { Calendar, Phone, MessageCircle } from "lucide-react";
import { defaultLocale } from "@/lib/i18n";

interface FinalCtaSectionProps {
  locale?: string;
}

const PHONE_NUMBER = "+91 85470 85403";
const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I would like to book a consultation at Halo Dental.");

export default function FinalCtaSection({ locale = defaultLocale }: FinalCtaSectionProps) {
  const t = useTranslations("finalCta");
  const prefix = locale === defaultLocale ? "" : `/${locale}`;

  return (
    <section aria-labelledby="cta-heading" className="relative overflow-hidden bg-brand-midnight py-16 sm:py-24 text-white">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[600px] rounded-full bg-brand-gold/10 blur-[120px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <span className="inline-block rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-brand-gold">
          {t("badge")}
        </span>

        <h2 id="cta-heading" className="mt-5 font-display text-3xl font-medium sm:text-4xl lg:text-5xl text-white">
          {t("heading")}
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
          {t("description")}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:flex-wrap">
          <Link
            href={`${prefix}/booking`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-gold px-7 py-3.5 text-base font-semibold text-brand-charcoal shadow-lg shadow-brand-gold/20 transition-all hover:bg-brand-gold/90 hover:scale-[1.02] sm:w-auto"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {t("bookOnline")}
          </Link>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-[#20ba5c] hover:scale-[1.02] sm:w-auto"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {t("messageWhatsapp")}
          </a>

          <a
            href={PHONE_TEL}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/25 bg-white/5 px-6 py-3.5 text-base font-medium text-white transition-all hover:border-brand-gold hover:text-brand-gold sm:w-auto"
          >
            <Phone className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            {t("call")}
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
          <span>{t("hours")}</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>{t("location")}</span>
          <span className="hidden sm:inline">&bull;</span>
          <span>{t("bilingual")}</span>
        </div>
      </div>
    </section>
  );
}
