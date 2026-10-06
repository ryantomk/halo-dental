"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, HelpCircle, Phone, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Faq {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = (t.raw("items") as Faq[]) || [];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section aria-labelledby="faq-heading" className="bg-brand-linen py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-charcoal/10 bg-white px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-brand-gold">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
            {t("badge")}
          </div>
          <h2 id="faq-heading" className="mt-4 font-display text-3xl font-medium text-brand-charcoal sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            {t("description")}
          </p>
        </div>

        <div className="mt-12 divide-y divide-brand-charcoal/10 rounded-2xl border border-brand-charcoal/10 bg-white shadow-sm overflow-hidden">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-btn-${index}`;
            const panelId = `faq-pnl-${index}`;

            return (
              <div key={faq.question} className="transition-colors hover:bg-brand-linen/30">
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4.5 text-left transition-colors sm:px-7 sm:py-5"
                  >
                    <span className="text-[15px] font-semibold text-brand-charcoal sm:text-base pr-2">
                      {faq.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "h-5 w-5 flex-shrink-0 text-brand-gold transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  aria-labelledby={buttonId}
                  role="region"
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="min-h-0">
                    <p className="px-5 pb-5 pt-1 text-sm sm:text-[15px] leading-relaxed text-brand-charcoal/75 sm:px-7">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support callout */}
        <div className="mt-8 rounded-xl border border-brand-charcoal/10 bg-white p-5 sm:p-6 text-center sm:flex sm:items-center sm:justify-between sm:text-left shadow-sm">
          <div>
            <h4 className="font-display text-base font-semibold text-brand-charcoal">{t("anotherQuestion")}</h4>
            <p className="text-xs sm:text-sm text-brand-charcoal/70 mt-1">{t("receptionDaily")}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3 justify-center">
            <a
              href="tel:+918547085403"
              className="inline-flex items-center gap-1.5 rounded-md border border-brand-charcoal/20 px-3.5 py-2 text-xs font-semibold text-brand-charcoal hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {t("callReception")}
            </a>
            <a
              href="https://wa.me/918547085403"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#20ba5c] transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {t("whatsapp")}
            </a>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}