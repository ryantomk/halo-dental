import TestimonialCarousel from "./TestimonialCarousel";
import { useTranslations } from "next-intl";
import { MessageSquareQuote } from "lucide-react";

export default function TestimonialsSection() {
  const t = useTranslations("testimonials");

  return (
    <section aria-labelledby="testimonials-heading" className="bg-white py-16 sm:py-24 border-t border-brand-charcoal/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-charcoal/10 bg-brand-linen px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-brand-gold">
            <MessageSquareQuote className="h-3.5 w-3.5" aria-hidden="true" />
            {t("badge")}
          </div>
          <h2 id="testimonials-heading" className="mt-4 font-display text-3xl font-medium text-brand-charcoal sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            {t("description")}
          </p>
        </div>

        {/* Connected, accessible interactive carousel */}
        <TestimonialCarousel />
      </div>
    </section>
  );
}