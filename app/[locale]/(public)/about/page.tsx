import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  HeartHandshake,
  Languages,
  MapPin,
  MessageCircle,
  Microscope,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { defaultLocale } from "@/lib/i18n";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return constructMetadata({
    title:
      locale === "ml"
        ? "ഡോ. ഹസീബിനെക്കുറിച്ചും ഹാലോ ഡെന്റലിനെക്കുറിച്ചും | അങ്ങാടിപ്പുറം"
        : "About Dr. Haseeb & Halo Dental | Angadipuram, Malappuram",
    description:
      locale === "ml"
        ? "അങ്ങാടിപ്പുറം റെയിൽവേ സ്റ്റേഷന് സമീപമുള്ള ഹാലോ ഡെന്റൽ ക്ലിനിക്ക്. ചീഫ് ഡെന്റൽ സർജൻ ഡോ. ഹസീബിന്റെ നേതൃത്വത്തിൽ ആധുനിക കോസ്മെറ്റിക്, ഓർത്തോഡോണ്ടിക് ഡെന്റൽ പരിചരണം."
        : "Meet Chief Dental Surgeon Dr. Haseeb at Halo Dental Cosmetic & Orthodontic Centre in Angadipuram, Malappuram. Learn about our philosophy, modern sterilization, and gentle patient-first dental care.",
    path: "/about",
    locale,
  });
}

export default function AboutPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const isMl = locale === "ml";

  const breadcrumbs = [
    { name: isMl ? "ഹോം" : "Home", url: `${prefix || "/"}` },
    { name: isMl ? "ഞങ്ങളെക്കുറിച്ച്" : "About", url: `${prefix}/about` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <div className="bg-brand-linen min-h-screen">
      {/* 1. Header / Breadcrumb & Hero */}
      <section className="bg-brand-midnight text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href={prefix || "/"} className="transition-colors hover:text-white">
                  {isMl ? "ഹോം" : "Home"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white font-medium">
                {isMl ? "ഞങ്ങളെക്കുറിച്ച്" : "About"}
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {isMl ? "ഡോക്ടർ നയിക്കുന്ന ക്ലിനിക്ക്" : "Doctor-Led Clinical Excellence"}
            </span>
            <h1 className="mt-4 font-display text-3xl font-medium tracking-tight sm:text-5xl text-white">
              {isMl
                ? "ഹാലോ ഡെന്റൽ കോസ്മെറ്റിക് & ഓർത്തോഡോണ്ടിക് സെന്റർ"
                : "Halo Dental Cosmetic & Orthodontic Centre"}
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/80">
              {isMl
                ? "അങ്ങാടിപ്പുറം, മലപ്പുറത്ത് രോഗീസൗഹൃദ അന്തരീക്ഷത്തിൽ അത്യാധുനിക ദന്തചികിത്സ ഉറപ്പാക്കുന്നു. ഡോ. ഹസീബിന്റെ നേതൃത്വത്തിൽ സ്മൈൽ മേക്കോവറുകൾ, ക്ലിയർ അലൈനറുകൾ, ഇംപ്ലാന്റുകൾ എന്നിവയിൽ സ്പെഷ്യലൈസ് ചെയ്ത പരിചരണം."
                : "A modern, patient-first dental clinic located in Angadipuram, Malappuram. Led by Chief Dental Surgeon Dr. Haseeb, our practice combines clinical precision, gentle treatment, and honest consultations."}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Doctor Profile Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual Portrait Card */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-2xl bg-gradient-to-br from-brand-midnight via-[#1c2936] to-[#0f1720] shadow-xl overflow-hidden border border-brand-charcoal/10 flex flex-col items-center justify-center p-8 text-center text-white">
                <div className="h-28 w-28 rounded-full bg-brand-gold/15 border-2 border-brand-gold/40 flex items-center justify-center text-brand-gold shadow-inner">
                  <Award className="h-14 w-14" aria-hidden="true" />
                </div>
                <h2 className="mt-6 font-display text-2xl font-bold sm:text-3xl">
                  {isMl ? "ഡോ. ഹസീബ്" : "Dr. Haseeb"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-brand-gold uppercase tracking-wider">
                  {isMl ? "ചീഫ് ഡെന്റൽ സർജൻ & സ്പെഷ്യലിസ്റ്റ് ഓർത്തോഡോണ്ടിസ്റ്റ്" : "Chief Dental Surgeon & Specialist Orthodontist"}
                </p>
                <p className="mt-2 text-xs text-white/70">
                  BDS, MDS (Orthodontics)
                </p>

                <div className="mt-6 w-full pt-6 border-t border-white/10 flex justify-around text-center text-xs">
                  <div>
                    <p className="text-white/60">{isMl ? "സ്ഥാനം" : "Role"}</p>
                    <p className="font-semibold text-white mt-0.5">{isMl ? "സ്ഥാപകൻ & ലീഡ് സർജൻ" : "Founder & Lead"}</p>
                  </div>
                  <div>
                    <p className="text-white/60">{isMl ? "സംഭാഷണം" : "Languages"}</p>
                    <p className="font-semibold text-white mt-0.5">English, മലയാളം</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Bio & Philosophy */}
            <div className="lg:col-span-7">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
                {isMl ? "ഞങ്ങളുടെ സമീപനം" : "Clinical Philosophy"}
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-medium text-brand-charcoal">
                {isMl
                  ? "വ്യക്തിഗത ശ്രദ്ധയും വേദനയില്ലാത്ത പരിചരണവും"
                  : "Personalised Care With Clear, Honest Explanations"}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-brand-charcoal/80">
                {isMl
                  ? "ഓരോ രോഗിയുടെയും പുഞ്ചിരിയും ദന്തരോഗ ആവശ്യങ്ങളും വ്യത്യസ്തമാണ്. അനാവശ്യ ചികിത്സകൾ ഒഴിവാക്കി, ഓരോ ഘട്ടവും വ്യക്തമായി വിശദീകരിച്ച് രോഗിയുടെ സമ്മതത്തോടെ മാത്രമേ ഞങ്ങൾ ചികിത്സ ആരംഭിക്കൂ."
                  : "At Halo Dental, we believe that exceptional dental care begins with listening. Dr. Haseeb approaches every smile with a commitment to conservative dentistry — preserving your natural teeth whenever possible and explaining every option before beginning any treatment."}
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-brand-charcoal/10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
                      <Microscope className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-semibold text-sm text-brand-charcoal">
                      {isMl ? "ഡിജിറ്റൽ ഡയഗ്നോസിസ്" : "Digital Diagnostics"}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-brand-charcoal/70 leading-relaxed">
                    {isMl
                      ? "കൃത്യമായ പരിശോധനയ്ക്കായി കുറഞ്ഞ റേഡിയേഷനുള്ള ഡിജിറ്റൽ എക്സ്-റേകൾ."
                      : "Low-radiation digital radiography for accurate diagnosis and transparent treatment planning."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-brand-charcoal/10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
                      <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-semibold text-sm text-brand-charcoal">
                      {isMl ? "ഹോസ്പിറ്റൽ ഗ്രേഡ് സ്റ്റെറിലൈസേഷൻ" : "Strict Sterilization"}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-brand-charcoal/70 leading-relaxed">
                    {isMl
                      ? "ഓരോ രോഗിക്കും ക്ലാസ്സ്-ബി ഓട്ടോക്ലേവ് സ്റ്റെറിലൈസ് ചെയ്ത ഉപകരണങ്ങൾ മാത്രം."
                      : "Class-B autoclave sterilization with sealed pouches opened directly in front of each patient."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-brand-charcoal/10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
                      <HeartHandshake className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-semibold text-sm text-brand-charcoal">
                      {isMl ? "രോഗീസൗഹൃദ സമീപനം" : "Calm, Gentle Experience"}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-brand-charcoal/70 leading-relaxed">
                    {isMl
                      ? "ഭയം കൂടാതെ ചികിത്സ സ്വീകരിക്കാൻ ശാന്തവും സുഖപ്രദവുമായ ക്ലിനിക്ക് അന്തരീക്ഷം."
                      : "Unrushed appointments designed to put anxious patients and children completely at ease."}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-brand-charcoal/10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-lg bg-brand-gold/10 text-brand-gold">
                      <Languages className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="font-semibold text-sm text-brand-charcoal">
                      {isMl ? "ദ്വിഭാഷാ കൺസൾട്ടേഷൻ" : "Bilingual Consultations"}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-brand-charcoal/70 leading-relaxed">
                    {isMl
                      ? "മലയാളത്തിലും ഇംഗ്ലീഷിലും വ്യക്തമായി ചർച്ച ചെയ്യാവുന്ന സൗകര്യം."
                      : "Comprehensive discussions in both English and Malayalam for effortless communication."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Location & Timings Card */}
      <section className="py-12 bg-white border-y border-brand-charcoal/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
                {isMl ? "ക്ലിനിക്ക് വിവരങ്ങൾ" : "Clinic Location & Hours"}
              </span>
              <h2 className="font-display text-2xl font-medium text-brand-charcoal">
                {isMl ? "അങ്ങാടിപ്പുറം റെയിൽവേ സ്റ്റേഷന് സമീപം" : "Conveniently Located in Angadipuram"}
              </h2>
              <div className="space-y-3 pt-2 text-sm text-brand-charcoal/80">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-brand-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Near Soundharya Silks, Near Railway Station, Angadipuram, Malappuram, Kerala 679321
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-brand-gold flex-shrink-0" aria-hidden="true" />
                  <span>
                    {isMl ? "തിങ്കൾ – ശനി: രാവിലെ 9:00 മുതൽ രാത്രി 8:00 വരെ (ഞായറാഴ്ച അവധി)" : "Monday – Saturday: 9:00 AM – 8:00 PM (Sunday Closed)"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-brand-gold flex-shrink-0" aria-hidden="true" />
                  <a href="tel:+918547085403" className="hover:text-brand-gold font-medium">
                    +91 85470 85403
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-brand-linen p-6 sm:p-8 border border-brand-charcoal/10">
              <h3 className="font-display text-lg font-semibold text-brand-charcoal">
                {isMl ? "കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക" : "Ready to Discuss Your Smile?"}
              </h3>
              <p className="mt-2 text-sm text-brand-charcoal/70">
                {isMl
                  ? "ഓൺലൈനായോ ഫോൺ വഴിയോ സൗകര്യപ്രദമായ സ്ലോട്ട് തിരഞ്ഞെടുക്കാം."
                  : "Book online in real-time or contact our front desk for appointment coordination."}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`${prefix}/booking`}
                  className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                >
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  {isMl ? "ഓൺലൈൻ ബുക്കിംഗ്" : "Book Online"}
                </Link>
                <a
                  href="https://wa.me/918547085403"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#20ba5c] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </div>
  );
}
