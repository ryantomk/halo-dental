import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { defaultLocale } from "@/lib/i18n";
import {
  constructMetadata,
  generateBreadcrumbJsonLd,
  generateClinicJsonLd,
} from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return constructMetadata({
    title:
      locale === "ml"
        ? "ക്ലിനിക് വിലാസവും ഫോൺ നമ്പറും | ഹാലോ ഡെന്റൽ അങ്ങാടിപ്പുറം"
        : "Contact & Location | Halo Dental Angadipuram, Malappuram",
    description:
      locale === "ml"
        ? "അങ്ങാടിപ്പുറം റെയിൽവേ സ്റ്റേഷന് സമീപമുള്ള ഹാലോ ഡെന്റൽ ക്ലിനിക്ക് വിലാസം, ഫോൺ നമ്പർ (+91 85470 85403), പ്രവർത്തന സമയം എന്നിവ."
        : "Visit Halo Dental Cosmetic & Orthodontic Centre in Angadipuram, Malappuram near Soundharya Silks. Call +91 85470 85403 or book online.",
    path: "/contact",
    locale,
  });
}

const PHONE_TEL = "tel:+918547085403";
const PHONE_NUMBER = "+91 85470 85403";
const EMAIL_ADDRESS = "info@halodental.in";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to enquire about dental consultation at Halo Dental.");

export default function ContactPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const isMl = locale === "ml";

  const breadcrumbs = [
    { name: isMl ? "ഹോം" : "Home", url: prefix || "/" },
    { name: isMl ? "ബന്ധപ്പെടുക" : "Contact", url: `${prefix}/contact` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);
  const clinicJsonLd = generateClinicJsonLd(locale);

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
                {isMl ? "ബന്ധപ്പെടുക" : "Contact"}
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              Angadipuram · Malappuram · Kerala
            </span>
            <h1 className="mt-4 font-display text-3xl font-medium sm:text-5xl text-white">
              {isMl ? "ഞങ്ങളെ ബന്ധപ്പെടുക" : "Contact & Clinic Location"}
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/80">
              {isMl
                ? "അങ്ങാടിപ്പുറം റെയിൽവേ സ്റ്റേഷന് സമീപം സൗന്ദര്യ സിൽക്സിനടുത്ത് ഹാലോ ഡെന്റൽ സ്ഥിതിചെയ്യുന്നു. നേരിട്ടോ ഫോൺ വഴിയോ ബന്ധപ്പെടാം."
                : "Conveniently located in Angadipuram near the Railway Station and Soundharya Silks. Reach our reception for appointments and enquiries."}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards & Map Information */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Phone Card */}
            <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center mb-6">
                  <Phone className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="font-display text-xl font-semibold text-brand-charcoal">
                  {isMl ? "ഫോൺ കൺസൾട്ടേഷൻ" : "Phone & WhatsApp"}
                </h2>
                <p className="mt-2 text-sm text-brand-charcoal/70 leading-relaxed">
                  {isMl
                    ? "അടിയന്തിര ആവശ്യങ്ങൾക്കും ബുക്കിംഗിനും വിളിക്കാം അല്ലെങ്കിൽ സന്ദേശമയക്കാം."
                    : "Direct contact with reception for scheduled appointments and general treatment queries."}
                </p>
                <div className="mt-4 space-y-2 text-sm font-medium">
                  <p>
                    <a href={PHONE_TEL} className="text-brand-charcoal hover:text-brand-gold">
                      {PHONE_NUMBER}
                    </a>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-charcoal/10 flex gap-2">
                <a
                  href={PHONE_TEL}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-gold px-3.5 py-2 text-xs font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  {isMl ? "വിളിക്കുക" : "Call Now"}
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-[#25D366] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#20ba5c] transition-colors"
                >
                  <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Address Card */}
            <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center mb-6">
                  <MapPin className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="font-display text-xl font-semibold text-brand-charcoal">
                  {isMl ? "ക്ലിനിക് വിലാസം" : "Clinic Address"}
                </h2>
                <p className="mt-2 text-sm text-brand-charcoal/80 leading-relaxed font-medium">
                  Halo Dental Cosmetic & Orthodontic Centre
                </p>
                <p className="mt-1 text-sm text-brand-charcoal/70 leading-relaxed">
                  Near Soundharya Silks, Near Railway Station, Angadipuram, Malappuram, Kerala 679321
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-brand-charcoal/60">
                  <Navigation className="h-3.5 w-3.5 text-brand-gold" aria-hidden="true" />
                  <span>{isMl ? "അങ്ങാടിപ്പുറം റെയിൽവേ സ്റ്റേഷന് വളരെ അടുത്ത്" : "Walking distance from Railway Station"}</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-charcoal/10">
                <a
                  href="https://maps.google.com/?q=Halo+Dental+Angadipuram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-md border border-brand-charcoal/20 px-3.5 py-2 text-xs font-semibold text-brand-charcoal hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                  {isMl ? "ഗൂഗിൾ മാപ്പിൽ കാണുക" : "Open in Google Maps"}
                </a>
              </div>
            </div>

            {/* Timings Card */}
            <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="h-12 w-12 rounded-xl bg-brand-gold/15 text-brand-gold flex items-center justify-center mb-6">
                  <Clock className="h-6 w-6" aria-hidden="true" />
                </div>
                <h2 className="font-display text-xl font-semibold text-brand-charcoal">
                  {isMl ? "പ്രവർത്തന സമയം" : "Working Hours"}
                </h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-brand-charcoal/10 pb-2">
                    <span className="text-brand-charcoal/70">{isMl ? "തിങ്കൾ – ശനി" : "Monday – Saturday"}</span>
                    <span className="font-semibold text-brand-charcoal">09:00 AM – 08:00 PM</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-brand-charcoal/70">{isMl ? "ഞായറാഴ്ച" : "Sunday"}</span>
                    <span className="font-semibold text-red-600">{isMl ? "അവധി" : "Closed"}</span>
                  </div>
                </div>
                <p className="mt-4 text-xs text-brand-charcoal/60 leading-relaxed">
                  {isMl
                    ? "അപ്പോയിന്റ്മെന്റ് അടിസ്ഥാനത്തിലാണ് പരിശോധനകൾ ക്രമീകരിച്ചിരിക്കുന്നത്."
                    : "Advance appointments recommended for minimal waiting time."}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-brand-charcoal/10">
                <Link
                  href={`${prefix}/booking`}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-gold px-3.5 py-2 text-xs font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {isMl ? "ഓൺലൈനായി ബുക്ക് ചെയ്യുക" : "Book Online"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fast Appointment Banner */}
      <section className="bg-brand-midnight text-white py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl font-medium">
            {isMl ? "ഇന്ന് തന്നെ കൺസൾട്ടേഷൻ ഉറപ്പാക്കാം" : "Plan Your Dental Consultation"}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-white/70 max-w-xl mx-auto">
            {isMl
              ? "ഹാലോ ഡെന്റലിൽ തത്സമയം ലഭ്യമായ സ്ലോട്ട് തിരഞ്ഞെടുത്ത് ബുക്ക് ചെയ്യാം."
              : "Choose your preferred time slot online with immediate confirmation and zero waiting."}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href={`${prefix}/booking`}
              className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
            >
              <Calendar className="h-4 w-4" aria-hidden="true" />
              {isMl ? "സ്ലോട്ട് ബുക്ക് ചെയ്യുക" : "Book Online Now"}
            </Link>
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicJsonLd) }}
      />
    </main>
  );
}
