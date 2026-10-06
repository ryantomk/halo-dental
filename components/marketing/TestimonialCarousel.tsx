"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Testimonial {
  name: string;
  treatment: string;
  rating?: number;
  quote: string;
}

interface TestimonialCarouselProps {
  testimonials?: Testimonial[];
  className?: string;
}

export default function TestimonialCarousel({
  testimonials,
  className,
}: TestimonialCarouselProps) {
  const t = useTranslations("testimonials");
  const [currentIndex, setCurrentIndex] = useState(0);

  const rawItems = (t.raw("items") as Array<{ name: string; treatment: string; quote: string }>) || [];
  const activeTestimonials: Testimonial[] = testimonials || rawItems.map((item) => ({
    ...item,
    rating: 5,
  }));

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? activeTestimonials.length - 1 : prev - 1));
  }, [activeTestimonials.length]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === activeTestimonials.length - 1 ? 0 : prev + 1));
  }, [activeTestimonials.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevSlide, nextSlide]);

  if (!activeTestimonials || activeTestimonials.length === 0) return null;

  const current = activeTestimonials[currentIndex];
  if (!current) return null;

  const rating = current.rating ?? 5;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={t("heading")}
      className={cn("relative mx-auto max-w-4xl px-4 sm:px-6", className)}
    >
      <div className="overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-brand-ivory p-8 shadow-sm sm:p-12">
        <div className="flex flex-col items-center text-center">
          <Quote className="h-10 w-10 text-brand-gold/60" aria-hidden="true" />

          {/* Star rating */}
          <div
            role="img"
            aria-label={t("ratingAria", { rating })}
            className="mt-6 flex gap-1 text-brand-gold"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < rating ? "fill-brand-gold text-brand-gold" : "text-brand-charcoal/20"
                )}
                aria-hidden="true"
              />
            ))}
          </div>

          {/* Quote text */}
          <blockquote className="mt-6">
            <p className="font-display text-lg font-normal leading-relaxed text-brand-charcoal sm:text-xl md:text-2xl">
              &ldquo;{current.quote}&rdquo;
            </p>
          </blockquote>

          {/* Attribution & Treatment badge */}
          <div className="mt-8 flex flex-col items-center gap-1.5 sm:flex-row sm:gap-3">
            <cite className="font-sans text-base font-semibold not-italic text-brand-charcoal">
              {current.name}
            </cite>
            <span className="hidden text-brand-charcoal/30 sm:inline">&middot;</span>
            <span className="rounded-full bg-brand-gold/20 px-3 py-0.5 text-xs font-medium text-brand-charcoal">
              {current.treatment}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-8 flex items-center justify-between sm:justify-center sm:gap-6">
        <button
          type="button"
          onClick={prevSlide}
          aria-label={t("prevSlide")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-charcoal/15 bg-white text-brand-charcoal shadow-sm transition-colors hover:border-brand-gold hover:bg-brand-linen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Indicator dots */}
        <div className="flex gap-2" role="tablist" aria-label="Testimonial slides">
          {activeTestimonials.map((item, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={currentIndex === index}
              aria-label={t("slideTabAria", { index: index + 1, name: item.name })}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2",
                currentIndex === index
                  ? "w-8 bg-brand-gold"
                  : "w-2.5 bg-brand-charcoal/20 hover:bg-brand-charcoal/40"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label={t("nextSlide")}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-charcoal/15 bg-white text-brand-charcoal shadow-sm transition-colors hover:border-brand-gold hover:bg-brand-linen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
