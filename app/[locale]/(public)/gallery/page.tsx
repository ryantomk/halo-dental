import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Calendar, Sparkles, Clock, MessageCircle, Phone } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { defaultLocale } from "@/lib/i18n";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

interface GalleryItem {
  id: string;
  title_en: string;
  title_ml: string | null;
  description_en: string | null;
  description_ml: string | null;
  before_image_url: string;
  after_image_url: string;
  treatment_duration: string | null;
  is_published: boolean;
  display_order: number;
  services?: { name_en: string } | null;
}

async function getPublishedGalleryItems(): Promise<GalleryItem[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { data } = await supabase
    .from("gallery_items")
    .select("*, services(name_en)")
    .eq("is_published", true)
    .order("display_order", { ascending: true });

  return (data as GalleryItem[]) || [];
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return constructMetadata({
    title:
      locale === "ml"
        ? "സ്മൈൽ ഗാലറി | ഹാലോ ഡെന്റൽ ക്ലിനിക്ക് അങ്ങാടിപ്പുറം, മലപ്പുറം"
        : "Smile Transformation Gallery | Halo Dental Angadipuram",
    description:
      locale === "ml"
        ? "ഹാലോ ഡെന്റലിൽ വിജയകരമായി പൂർത്തിയാക്കിയ സ്മൈൽ മേക്കോവറുകൾ, ക്ലിയർ അലൈനറുകൾ, ഇംപ്ലാന്റുകൾ എന്നിവയുടെ ഫലങ്ങൾ കാണുക."
        : "Explore real before-and-after smile transformations at Halo Dental Cosmetic & Orthodontic Centre in Angadipuram, Malappuram. Clear aligners, smile makeovers, and cosmetic bonding.",
    path: "/gallery",
    locale,
  });
}

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I saw your smile gallery and would like to book a consultation.");

export default async function GalleryPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const items = await getPublishedGalleryItems();
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const isMl = locale === "ml";

  const breadcrumbs = [
    { name: isMl ? "ഹോം" : "Home", url: prefix || "/" },
    { name: isMl ? "ഗാലറി" : "Gallery", url: `${prefix}/gallery` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <main className="bg-brand-linen min-h-screen">
      {/* Hero */}
      <section className="bg-brand-midnight text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href={prefix || "/"} className="hover:text-white transition-colors">
                  {isMl ? "ഹോം" : "Home"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white font-medium">
                {isMl ? "ഗാലറി" : "Gallery"}
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {isMl ? "ക്ലിനിക്കൽ ഫലങ്ങൾ" : "Real Clinical Results"}
            </span>
            <h1 className="mt-4 font-display text-3xl font-medium sm:text-5xl text-white">
              {isMl
                ? "പുഞ്ചിരി മാറ്റങ്ങളുടെ ഗാലറി"
                : "Smile Transformation Gallery"}
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/80">
              {isMl
                ? "അങ്ങാടിപ്പുറത്തെ ഹാലോ ഡെന്റലിൽ ഡോ. ഹസീബിന്റെ മേൽനോട്ടത്തിൽ ചെയ്ത യഥാർത്ഥ രോഗികളുടെ ട്രീറ്റ്മെന്റ് ഫലങ്ങൾ."
                : "Real patient outcomes achieved through personalized cosmetic and orthodontic treatment plans at Halo Dental in Angadipuram."}
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Showcase */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            /* Fallback showcase using verified hero showcase cards */
            <div className="text-center py-12">
              <div className="max-w-xl mx-auto rounded-2xl bg-white p-8 border border-brand-charcoal/10 shadow-sm">
                <Sparkles className="h-10 w-10 text-brand-gold mx-auto mb-4" aria-hidden="true" />
                <h2 className="font-display text-xl font-semibold text-brand-charcoal">
                  {isMl ? "പുതിയ കേസുകൾ ഉടൻ ചേർക്കും" : "Curating Clinical Transformations"}
                </h2>
                <p className="mt-2 text-sm text-brand-charcoal/70 leading-relaxed">
                  {isMl
                    ? "രോഗികളുടെ സമ്മതത്തോടെയുള്ള കൂടുതൽ കേസുകൾ ഉടൻ പ്രസിദ്ധീകരിക്കുന്നതാണ്. പരിശോധനയ്ക്കായി കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക."
                    : "Patient cases with verified clinical consent are published regularly. Book a consultation with Dr. Haseeb to explore what is possible for your smile."}
                </p>
                <div className="mt-6 flex justify-center gap-3">
                  <Link
                    href={`${prefix}/booking`}
                    className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
                  >
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {isMl ? "ബുക്ക് ചെയ്യുക" : "Book Consultation"}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => {
                const title = isMl && item.title_ml ? item.title_ml : item.title_en;
                const desc = isMl && item.description_ml ? item.description_ml : item.description_en;

                const isDual =
                  item.before_image_url &&
                  item.after_image_url &&
                  item.before_image_url !== item.after_image_url;

                return (
                  <div
                    key={item.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    {isDual ? (
                      /* Before and After Image Split */
                      <div className="grid grid-cols-2 gap-1 bg-brand-charcoal/5 p-1">
                        <div className="relative aspect-square overflow-hidden rounded-l-xl bg-brand-charcoal/10">
                          <Image
                            src={item.before_image_url}
                            alt={`Before treatment: ${title} at Halo Dental`}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                            className="object-cover"
                          />
                          <span className="absolute bottom-2 left-2 rounded bg-brand-charcoal/80 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur-sm">
                            {isMl ? "മുമ്പ്" : "Before"}
                          </span>
                        </div>
                        <div className="relative aspect-square overflow-hidden rounded-r-xl bg-brand-charcoal/10">
                          <Image
                            src={item.after_image_url}
                            alt={`After treatment: ${title} at Halo Dental`}
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                            className="object-cover"
                          />
                          <span className="absolute bottom-2 right-2 rounded bg-brand-gold/90 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-brand-charcoal uppercase backdrop-blur-sm">
                            {isMl ? "ശേഷം" : "After"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Single Normal Showcase Photo */
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-charcoal/10">
                        <Image
                          src={item.after_image_url || item.before_image_url}
                          alt={`${title} at Halo Dental`}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Content Details */}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between text-xs text-brand-charcoal/60 mb-2">
                        {item.services?.name_en && (
                          <span className="rounded-full bg-brand-linen px-2.5 py-0.5 font-medium text-brand-gold">
                            {item.services.name_en}
                          </span>
                        )}
                        {item.treatment_duration && (
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {item.treatment_duration}
                          </span>
                        )}
                      </div>

                      <h2 className="font-display text-lg font-semibold text-brand-charcoal">
                        {title}
                      </h2>

                      {desc && (
                        <p className="mt-2 text-xs leading-relaxed text-brand-charcoal/70 flex-1">
                          {desc}
                        </p>
                      )}

                      <div className="mt-5 pt-4 border-t border-brand-charcoal/10 flex items-center justify-between">
                        <Link
                          href={`${prefix}/booking`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold hover:text-brand-charcoal transition-colors"
                        >
                          {isMl ? "കൺസൾട്ടേഷൻ എടുക്കൂ" : "Book similar care"}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Booking CTA Strip */}
      <section className="bg-brand-midnight py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-medium sm:text-4xl">
            {isMl ? "നിങ്ങളുടെ പുഞ്ചിരി സുന്ദരമാക്കാം" : "Discover What's Possible For Your Smile"}
          </h2>
          <p className="mt-4 text-base text-white/70">
            {isMl
              ? "ഡോ. ഹസീബുമായി കൺസൾട്ടേഷൻ നടത്താൻ ഓൺലൈനായോ വാട്സാപ്പ് വഴിയോ ബുക്ക് ചെയ്യാം."
              : "Every smile makeover begins with a detailed examination and a calm, transparent discussion with Dr. Haseeb."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`${prefix}/booking`}
              className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {isMl ? "ഓൺലൈൻ ബുക്കിംഗ്" : "Book Consultation"}
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#20ba5c] transition-colors"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={PHONE_TEL}
              className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              +91 85470 85403
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
