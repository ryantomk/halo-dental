import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  HeartHandshake,
  MessageCircle,
  Microscope,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  Zap,
} from "lucide-react";
import { defaultLocale } from "@/lib/i18n";
import {
  constructMetadata,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
  generateServiceJsonLd,
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
        ? "പോർസലൈൻ വെനീറുകൾ | ഹാലോ ഡെന്റൽ ക്ലിനിക്ക് അങ്ങാടിപ്പുറം, മലപ്പുറം"
        : "Porcelain Veneers in Angadipuram, Malappuram | Halo Dental",
    description:
      locale === "ml"
        ? "പല്ലിലെ വിള്ളലുകൾ, കറകൾ, ചെറിയ വിടവുകൾ എന്നിവ മാറ്റി മനോഹരമായ പുഞ്ചിരി നൽകുന്ന പോർസലൈൻ വെനീർ ചികിത്സ അങ്ങാടിപ്പുറത്തെ ഹാലോ ഡെന്റലിൽ."
        : "Custom porcelain dental veneers at Halo Dental Cosmetic & Orthodontic Centre in Angadipuram, Malappuram. Transform chipped, discolored, or uneven teeth with natural-looking cosmetic facings.",
    path: "/services/veneers",
    locale,
  });
}

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to consult for porcelain veneers at Halo Dental.");

const BENEFITS = [
  {
    title: "Natural appearance",
    description: "Porcelain mimics the light-reflecting properties and natural translucency of tooth enamel.",
    icon: Sparkles,
  },
  {
    title: "Stain resistant",
    description: "Glazed dental porcelain resists staining from tea, coffee, and spices far better than composite resin.",
    icon: ShieldCheck,
  },
  {
    title: "Conservative preparation",
    description: "Only a micro-thin layer of enamel is shaped, preserving the structural integrity of your natural tooth.",
    icon: Zap,
  },
  {
    title: "Tailored to your smile",
    description: "Every veneer is custom shade-matched and shaped to harmonize with your facial aesthetics and lips.",
    icon: Smile,
  },
];

const PROCESS_STEPS = [
  {
    title: "Aesthetic consultation & photography",
    description: "We evaluate your smile, discuss your cosmetic goals, and take digital photos to design your ideal outcome.",
  },
  {
    title: "Digital smile planning & shade matching",
    description: "We select the optimal shade and shape to complement your facial structure and complexion.",
  },
  {
    title: "Minimal preparation & temporaries",
    description: "A minimal amount of enamel is contoured under gentle anaesthesia, and temporary facings protect your teeth.",
  },
  {
    title: "Precision bonding & polish",
    description: "The handcrafted porcelain facings are tried in, checked for bite and aesthetics, and permanently bonded.",
  },
];

const FAQS = [
  {
    question: "What is the difference between porcelain and composite veneers?",
    answer:
      "Porcelain veneers are crafted in a dental laboratory from high-grade ceramic, offering superior durability, stain resistance, and natural translucency. Composite veneers are hand-layered in a single visit and are suitable for minor touch-ups but tend to stain more easily over time.",
  },
  {
    question: "Do veneers damage your natural teeth?",
    answer:
      "No. Modern veneer techniques are ultra-conservative, removing only 0.3 to 0.5 mm of enamel on the front surface. Dr. Haseeb preserves as much healthy natural tooth structure as possible.",
  },
  {
    question: "How long do porcelain veneers last?",
    answer:
      "With good oral hygiene, regular check-ups, and normal chewing habits, high-quality porcelain veneers typically last 10 to 15 years or longer.",
  },
  {
    question: "Can veneers fix crooked teeth?",
    answer:
      "Veneers can mask minor misalignments, uneven lengths, and small gaps. For more severe crowding or bite misalignments, Dr. Haseeb may recommend orthodontic clear aligners first to achieve the healthiest long-term result.",
  },
];

export default function VeneersPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const isMl = locale === "ml";

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: isMl ? "ഹോം" : "Home", url: prefix || "/" },
    { name: isMl ? "ചികിത്സകൾ" : "Services", url: `${prefix}/services` },
    { name: isMl ? "പോർസലൈൻ വെനീറുകൾ" : "Porcelain Veneers", url: `${prefix}/services/veneers` },
  ]);

  const serviceJsonLd = generateServiceJsonLd({
    name: "Porcelain Veneers",
    description:
      "Handcrafted porcelain facings correcting chips, minor gaps, and deep discolorations at Halo Dental Cosmetic & Orthodontic Centre in Angadipuram.",
    slug: "veneers",
    category: "CosmeticDentistry",
  });

  const faqJsonLd = generateFaqJsonLd(FAQS);

  return (
    <main className="bg-brand-linen min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-midnight text-white py-16 sm:py-24">
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
              <li aria-current="page" className="text-white font-medium">
                {isMl ? "പോർസലൈൻ വെനീറുകൾ" : "Porcelain Veneers"}
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              {isMl ? "കോസ്മെറ്റിക് ഡെന്റിസ്ട്രി" : "Cosmetic Dentistry"}
            </span>
            <h1 className="mt-4 font-display text-3xl font-medium sm:text-5xl text-white">
              {isMl
                ? "പോർസലൈൻ വെനീറുകൾ — സ്വാഭാവിക പുഞ്ചിരി മാറ്റം"
                : "Handcrafted Porcelain Veneers"}
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/80">
              {isMl
                ? "പല്ലുകളിലെ കറകൾ, പൊട്ടലുകൾ, ചെറിയ വിടവുകൾ എന്നിവ ശാശ്വതമായി പരിഹരിച്ച് സ്വാഭാവിക ഭംഗിയുള്ള പുഞ്ചിരി സമ്മാനിക്കുന്ന സൗന്ദര്യവർദ്ധക ദന്തചികിത്സ."
                : "Custom, ultra-thin ceramic facings designed by Dr. Haseeb to transform chipped, discoloured, or irregularly spaced teeth into a balanced, luminous smile."}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`${prefix}/booking`}
                className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
              >
                {isMl ? "കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക" : "Book Consultation"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
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

      {/* Benefits */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
              {isMl ? "ഗുണങ്ങൾ" : "Why Porcelain Veneers"}
            </span>
            <h2 className="mt-2 font-display text-3xl font-medium text-brand-charcoal sm:text-4xl">
              {isMl
                ? "പോർസലൈൻ വെനീറുകളുടെ പ്രധാന നേട്ടങ്ങൾ"
                : "Designed for natural aesthetics and durability"}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="p-6 rounded-xl border border-brand-charcoal/10 bg-brand-linen/40 flex flex-col justify-between"
              >
                <div>
                  <div className="h-10 w-10 rounded-lg bg-brand-gold/15 text-brand-gold flex items-center justify-center mb-4">
                    <b.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-brand-charcoal">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-charcoal/70 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Process */}
      <section className="py-16 sm:py-20 bg-brand-linen border-t border-brand-charcoal/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
              {isMl ? "ചികിത്സാ ഘട്ടങ്ങൾ" : "Treatment Journey"}
            </span>
            <h2 className="mt-2 font-display text-3xl font-medium text-brand-charcoal sm:text-4xl">
              {isMl ? "ഘട്ടം ഘട്ടമായുള്ള പ്രക്രിയ" : "What to expect at each step"}
            </h2>
          </div>

          <div className="mt-12 max-w-3xl mx-auto space-y-6">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.title}
                className="flex gap-4 p-5 rounded-xl bg-white border border-brand-charcoal/10 shadow-sm"
              >
                <div className="h-8 w-8 rounded-full bg-brand-gold text-brand-charcoal font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-brand-charcoal">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-brand-charcoal/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 sm:py-20 bg-white border-t border-brand-charcoal/10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-gold">
              {isMl ? "സംശയങ്ങൾ" : "Common Questions"}
            </span>
            <h2 className="mt-2 font-display text-3xl font-medium text-brand-charcoal">
              {isMl ? "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ" : "Frequently Asked Questions"}
            </h2>
          </div>

          <div className="mt-10 divide-y divide-brand-charcoal/10 rounded-xl border border-brand-charcoal/10 bg-brand-linen/30">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group p-2">
                <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-brand-charcoal sm:text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold">
                  <span>{faq.question}</span>
                  <ChevronDown
                    className="h-5 w-5 flex-shrink-0 text-brand-gold transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="px-4 pb-4 pt-1 text-sm text-brand-charcoal/75 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-brand-midnight py-16 text-center text-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl font-medium">
            {isMl ? "പുഞ്ചിരി മാറ്റത്തിന് തയ്യാറാണോ?" : "Transform Your Smile With Dr. Haseeb"}
          </h2>
          <p className="mt-4 text-base text-white/70 max-w-xl mx-auto">
            {isMl
              ? "അങ്ങാടിപ്പുറത്തെ ക്ലിനിക്കിൽ കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക."
              : "Book a consultation at Halo Dental in Angadipuram to discuss your cosmetic smile makeover."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`${prefix}/booking`}
              className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
            >
              {isMl ? "ഓൺലൈൻ ബുക്കിംഗ്" : "Book Online"}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
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

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}