import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Calendar, CheckCircle2, MessageCircle, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { defaultLocale } from "@/lib/i18n";
import { constructMetadata, generateBreadcrumbJsonLd, generateServiceJsonLd } from "@/lib/seo";

export const dynamicParams = true;
export const revalidate = 60;

interface ServiceRecord {
  id: string;
  slug: string;
  name_en: string;
  name_ml: string | null;
  short_description_en: string | null;
  short_description_ml: string | null;
  description_en: string | null;
  description_ml: string | null;
  category: string | null;
  price_starting_at: number | null;
  price_display: string | null;
  duration_minutes: number | null;
  is_active: boolean;
  image_url: string | null;
}

async function getService(slug: string): Promise<ServiceRecord | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  return (data as ServiceRecord) || null;
}

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { data } = await supabase
    .from("services")
    .select("slug")
    .eq("is_active", true);

  if (!data) return [];
  return data.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  const service = await getService(slug);

  if (!service) {
    return constructMetadata({
      title: "Service Not Found",
      description: "The requested dental treatment could not be found.",
      path: `/services/${slug}`,
      locale,
      noIndex: true,
    });
  }

  const name = (locale === "ml" && service.name_ml) ? service.name_ml : service.name_en;
  const desc =
    (locale === "ml" && (service.description_ml || service.short_description_ml))
      ? (service.description_ml || service.short_description_ml)
      : (service.description_en || service.short_description_en) ||
        `Learn more about ${name} at Halo Dental Cosmetic & Orthodontic Centre in Angadipuram, Malappuram.`;

  return constructMetadata({
    title: `${name} in Angadipuram, Malappuram | Halo Dental`,
    description: desc || `Learn more about ${name} at Halo Dental.`,
    path: `/services/${slug}`,
    locale,
  });
}

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to book an appointment for dental care at Halo Dental.");

export default async function ServiceDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);

  const service = await getService(slug);
  if (!service) {
    notFound();
  }

  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const isMl = locale === "ml";

  const displayName = isMl && service.name_ml ? service.name_ml : service.name_en;
  const displayDesc =
    isMl && (service.description_ml || service.short_description_ml)
      ? (service.description_ml || service.short_description_ml)
      : (service.description_en || service.short_description_en) ||
        "Expert dental care delivered with clinical precision and gentle patient-first attention.";

  const breadcrumbs = [
    { name: isMl ? "ഹോം" : "Home", url: prefix || "/" },
    { name: isMl ? "ചികിത്സകൾ" : "Services", url: `${prefix}/services` },
    { name: displayName, url: `${prefix}/services/${slug}` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  const serviceJsonLd = generateServiceJsonLd({
    name: service.name_en,
    description: service.description_en || service.short_description_en || displayDesc || "Dental care at Halo Dental",
    slug: service.slug,
    category: service.category || "DentalCare",
    priceStartingAt: service.price_starting_at,
    priceDisplay: service.price_display,
    image: service.image_url,
  });

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
              <li>
                <Link href={`${prefix}/services`} className="hover:text-white transition-colors">
                  {isMl ? "ചികിത്സകൾ" : "Services"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white font-medium truncate max-w-xs">
                {displayName}
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {service.category || (isMl ? "ദന്തചികിത്സ" : "Dental Care")}
            </span>

            <h1 className="mt-4 font-display text-3xl font-medium sm:text-5xl text-white">
              {displayName}
            </h1>

            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/80">
              {displayDesc}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`${prefix}/booking?service=${service.id}`}
                className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {isMl ? "കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക" : "Book Consultation"}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#20ba5c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
              <a
                href={PHONE_TEL}
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                {isMl ? "വിളിക്കുക" : "Call Clinic"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Details and Standards */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="font-display text-2xl font-medium text-brand-charcoal sm:text-3xl">
                {isMl ? "ചികിത്സാ വിവരങ്ങൾ" : "About This Treatment"}
              </h2>
              <p className="text-base text-brand-charcoal/80 leading-relaxed">
                {displayDesc}
              </p>

              <div className="mt-8 p-6 rounded-xl bg-brand-linen/40 border border-brand-charcoal/10">
                <h3 className="font-display text-lg font-semibold text-brand-charcoal">
                  {isMl ? "ഹാലോ ഡെന്റലിന്റെ പ്രത്യേകതകൾ" : "The Halo Dental Standard"}
                </h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3 text-sm text-brand-charcoal">
                    <CheckCircle2 className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {isMl
                        ? "ചീഫ് ഡെന്റൽ സർജൻ ഡോ. ഹസീബിന്റെ നേരിട്ടുള്ള പരിശോധനയും കൺസൾട്ടേഷനും."
                        : "Direct diagnosis and personalized consultations led by Chief Dental Surgeon Dr. Haseeb."}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-brand-charcoal">
                    <CheckCircle2 className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {isMl
                        ? "രോഗീസുരക്ഷ ഉറപ്പാക്കാൻ ക്ലാസ്-ബി ഓട്ടോക്ലേവ് സ്റ്റെറിലൈസേഷൻ."
                        : "Hospital-grade sterilization with sealed pouches opened in front of each patient."}
                    </span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-brand-charcoal">
                    <CheckCircle2 className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span>
                      {isMl
                        ? "ശാന്തവും ഭയരഹിതവുമായ ചികിത്സാനുഭവം."
                        : "Calm, anxiety-free atmosphere with transparent pricing and no unnecessary procedures."}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Quick Summary Card */}
            <div>
              <div className="rounded-2xl border border-brand-charcoal/10 bg-brand-linen p-6 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-brand-charcoal">
                  {isMl ? "ചികിത്സ സംഗ്രഹം" : "Treatment Summary"}
                </h3>

                <div className="mt-4 divide-y divide-brand-charcoal/10 text-sm">
                  {service.duration_minutes && (
                    <div className="py-3 flex justify-between">
                      <span className="text-brand-charcoal/70">{isMl ? "സമയം" : "Estimated Time"}</span>
                      <span className="font-medium text-brand-charcoal">{service.duration_minutes} mins</span>
                    </div>
                  )}

                  {service.price_display && (
                    <div className="py-3 flex justify-between">
                      <span className="text-brand-charcoal/70">{isMl ? "ഫീസ്" : "Fee Estimate"}</span>
                      <span className="font-medium text-brand-charcoal">{service.price_display}</span>
                    </div>
                  )}

                  <div className="py-3 flex justify-between">
                    <span className="text-brand-charcoal/70">{isMl ? "സ്ഥാനം" : "Location"}</span>
                    <span className="font-medium text-brand-charcoal">Angadipuram</span>
                  </div>

                  <div className="py-3 flex justify-between">
                    <span className="text-brand-charcoal/70">{isMl ? "ഡോക്ടർ" : "Surgeon"}</span>
                    <span className="font-medium text-brand-charcoal">Dr. Haseeb</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`${prefix}/booking?service=${service.id}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
                  >
                    {isMl ? "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക" : "Book This Service"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
    </main>
  );
}
