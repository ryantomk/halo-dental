import TestimonialCarousel from "./TestimonialCarousel";
import { getTranslations } from "next-intl/server";
import { MessageSquareQuote } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { defaultLocale } from "@/lib/i18n";

interface TestimonialDbRow {
  id: string;
  patient_name: string;
  treatment: string;
  rating: number;
  quote_en: string;
  quote_ml: string | null;
  photo_url: string | null;
  is_approved: boolean;
  display_order: number;
}

async function getApprovedTestimonials(): Promise<TestimonialDbRow[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return [];

  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("testimonials")
      .select("id, patient_name, treatment, rating, quote_en, quote_ml, photo_url, is_approved, display_order")
      .eq("is_approved", true)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data as TestimonialDbRow[];
  } catch {
    return [];
  }
}

export default async function TestimonialsSection({
  locale = defaultLocale,
}: {
  locale?: string;
}) {
  const t = await getTranslations({ locale, namespace: "testimonials" });
  const dbTestimonials = await getApprovedTestimonials();

  const mappedTestimonials =
    dbTestimonials.length > 0
      ? dbTestimonials.map((row) => ({
          name: row.patient_name,
          treatment: row.treatment,
          rating: row.rating,
          quote: locale === "ml" && row.quote_ml ? row.quote_ml : row.quote_en,
        }))
      : undefined;

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
        <TestimonialCarousel testimonials={mappedTestimonials} />
      </div>
    </section>
  );
}