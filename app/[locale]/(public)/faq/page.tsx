import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import {
  ChevronDown,
  HelpCircle,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { defaultLocale } from "@/lib/i18n";
import {
  constructMetadata,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
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
        ? "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ (FAQ) | ഹാലോ ഡെന്റൽ അങ്ങാടിപ്പുറം"
        : "Frequently Asked Questions (FAQ) | Halo Dental Angadipuram",
    description:
      locale === "ml"
        ? "ദന്തചികിത്സകൾ, അപ്പോയിന്റ്മെന്റുകൾ, വേദനയില്ലാത്ത റൂട്ട് കനാൽ, ക്ലിയർ അലൈനറുകൾ എന്നിവയെക്കുറിച്ചുള്ള സംശയങ്ങൾക്കുള്ള മറുപടികൾ."
        : "Answers to common questions about dental consultations, smile makeovers, clear aligners, pain management, and appointments at Halo Dental in Angadipuram.",
    path: "/faq",
    locale,
  });
}

const FAQS = [
  {
    category: "General & Appointments",
    category_ml: "പൊതു വിവരങ്ങളും ബുക്കിംഗും",
    items: [
      {
        question: "How do I book an appointment at Halo Dental?",
        question_ml: "ഹാലോ ഡെന്റലിൽ എങ്ങനെ അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യാം?",
        answer:
          "You can select your preferred date and time slot using our real-time online booking tool, or simply message us on WhatsApp (+91 85470 85403).",
        answer_ml:
          "ഞങ്ങളുടെ വെബ്സൈറ്റിലെ ലൈവ് ബുക്കിംഗ് ടൂൾ വഴിയോ അല്ലെങ്കിൽ വാട്സാപ്പ് (+91 85470 85403) വഴിയോ തീയതിയും സമയവും മുൻകൂട്ടി തിരഞ്ഞെടുക്കാം.",
      },
      {
        question: "What are your clinic working hours?",
        question_ml: "ക്ലിനിക്കിന്റെ പ്രവർത്തന സമയം എന്താണ്?",
        answer:
          "We are open Monday through Saturday from 09:00 AM to 08:00 PM. We are closed on Sundays for routine appointments.",
        answer_ml:
          "തിങ്കൾ മുതൽ ശനി വരെ രാവിലെ 9:00 മുതൽ രാത്രി 8:00 വരെ ക്ലിനിക് പ്രവർത്തിക്കുന്നു. ഞായറാഴ്ചകളിൽ അവധിയാണ്.",
      },
      {
        question: "Where is the clinic located in Angadipuram?",
        question_ml: "ക്ലിനിക് എവിടെയാണ് സ്ഥിതി ചെയ്യുന്നത്?",
        answer:
          "Halo Dental is located near Soundharya Silks, close to the Angadipuram Railway Station in Malappuram district, Kerala.",
        answer_ml:
          "മലപ്പുറം ജില്ലയിലെ അങ്ങാടിപ്പുറം റെയിൽവേ സ്റ്റേഷന് സമീപം, സൗന്ദര്യ സിൽക്സിനടുത്താണ് ഹാലോ ഡെന്റൽ സ്ഥിതിചെയ്യുന്നത്.",
      },
    ],
  },
  {
    category: "Treatments & Safety",
    category_ml: "ചികിത്സകളും സുരക്ഷിതത്വവും",
    items: [
      {
        question: "Is root canal treatment painful?",
        question_ml: "റൂട്ട് കനാൽ ചികിത്സ വേദനാജനകമാണോ?",
        answer:
          "With modern local anaesthesia and endodontic techniques, the procedure itself is virtually painless and provides immediate relief from toothache.",
        answer_ml:
          "ആധുനിക അനസ്തെറ്റിക് സംവിധാനങ്ങളുള്ളതിനാൽ റൂട്ട് കനാൽ ചികിത്സ വേദനാജനകമല്ല. പല്ലുവേദനയിൽ നിന്ന് വേഗത്തിൽ ആശ്വാസം ലഭിക്കുകയും ചെയ്യും.",
      },
      {
        question: "What sterilization protocols do you follow?",
        question_ml: "ഏതൊക്കെ സ്റ്റെറിലൈസേഷൻ രീതികളാണ് സ്വീകരിക്കുന്നത്?",
        answer:
          "We use hospital-grade Class-B autoclaves for all non-disposable instruments. Pre-sterilized pouches are opened directly in front of each patient.",
        answer_ml:
          "ക്ലാസ്സ്-ബി ഓട്ടോക്ലേവ് സ്റ്റെറിലൈസേഷൻ വഴിയാണ് ഉപകരണങ്ങൾ അണുവിമുക്തമാക്കുന്നത്. ഓരോ രോഗിയുടെയും മുന്നിൽ വെച്ച് മാത്രമാണ് പൗച്ചുകൾ തുറക്കുന്നത്.",
      },
      {
        question: "How long does teeth whitening treatment take?",
        question_ml: "ടീത്ത് വൈറ്റനിംഗിന് എത്ര സമയം വേണം?",
        answer:
          "In-clinic professional whitening usually takes between 45 to 60 minutes, lifting surface and stubborn stains effectively in one session.",
        answer_ml:
          "ഇൻ-ക്ലിനിക്ക് ടീത്ത് വൈറ്റനിംഗിന് ഏകദേശം 45 മുതൽ 60 മിനിറ്റ് വരെ സമയമെടുക്കും. ഒറ്റ സിറ്റിംഗിൽ തന്നെ പ്രകടമായ മാറ്റം കാണാം.",
      },
      {
        question: "Are clear aligners suitable for all ages?",
        question_ml: "ക്ലിയർ അലൈനറുകൾ ഏത് പ്രായക്കാർക്കും അനുയോജ്യമാണോ?",
        answer:
          "Clear aligners are suitable for teens and adults whose permanent teeth have fully erupted. Dr. Haseeb evaluates your specific dental structure during the consultation.",
        answer_ml:
          "സ്ഥിരദന്തങ്ങൾ പൂർണ്ണമായും വന്ന കൗമാരക്കാർക്കും മുതിർന്നവർക്കും ക്ലിയർ അലൈനറുകൾ ഉപയോഗിക്കാം. ഡോ. ഹസീബ് നിങ്ങളുടെ പല്ലുകൾ പരിശോധിച്ച് അനുയോജ്യത ഉറപ്പുവരുത്തും.",
      },
    ],
  },
];

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I have a question regarding dental consultation at Halo Dental.");

export default function FAQPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const isMl = locale === "ml";

  const allFlatFaqs = FAQS.flatMap((cat) =>
    cat.items.map((item) => ({
      question: isMl ? item.question_ml : item.question,
      answer: isMl ? item.answer_ml : item.answer,
    }))
  );

  const breadcrumbs = [
    { name: isMl ? "ഹോം" : "Home", url: prefix || "/" },
    { name: isMl ? "പതിവുചോദ്യങ്ങൾ" : "FAQ", url: `${prefix}/faq` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);
  const faqJsonLd = generateFaqJsonLd(allFlatFaqs);

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
                {isMl ? "പതിവുചോദ്യങ്ങൾ" : "FAQ"}
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
              {isMl ? "സംശയങ്ങളും ഉത്തരങ്ങളും" : "Answers & Clarifications"}
            </span>
            <h1 className="mt-4 font-display text-3xl font-medium sm:text-5xl text-white">
              {isMl ? "പതിവായി ചോദിക്കുന്ന ചോദ്യങ്ങൾ" : "Frequently Asked Questions"}
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/80">
              {isMl
                ? "ദന്തചികിത്സകൾ, അപ്പോയിന്റ്മെന്റുകൾ, സുരക്ഷാ മാനദണ്ഡങ്ങൾ എന്നിവയെക്കുറിച്ച് പൊതുവായി ഉണ്ടാകുന്ന സംശയങ്ങൾക്കുള്ള വ്യക്തമായ വിശദീകരണങ്ങൾ."
                : "Clear, transparent answers about our clinical treatments, appointment booking, sterilization protocols, and recovery expectations."}
            </p>
          </div>
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {FAQS.map((category) => {
            const catTitle = isMl ? category.category_ml : category.category;

            return (
              <div key={category.category}>
                <h2 className="font-display text-2xl font-semibold text-brand-charcoal mb-6 border-b border-brand-charcoal/10 pb-3">
                  {catTitle}
                </h2>

                <div className="divide-y divide-brand-charcoal/10 rounded-2xl border border-brand-charcoal/10 bg-white shadow-sm overflow-hidden">
                  {category.items.map((item) => {
                    const q = isMl ? item.question_ml : item.question;
                    const a = isMl ? item.answer_ml : item.answer;

                    return (
                      <details key={item.question} className="group p-2">
                        <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium text-brand-charcoal transition-colors hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold sm:px-6">
                          <span className="text-[15px] sm:text-base font-semibold">{q}</span>
                          <ChevronDown
                            className="h-5 w-5 flex-shrink-0 text-brand-gold transition-transform duration-300 group-open:rotate-180"
                            aria-hidden="true"
                          />
                        </summary>
                        <p className="px-5 pb-5 pt-1 text-sm sm:text-[15px] leading-relaxed text-brand-charcoal/75 sm:px-6">
                          {a}
                        </p>
                      </details>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Support Callout */}
      <section className="bg-white border-t border-brand-charcoal/10 py-16 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-brand-charcoal">
            {isMl ? "മറ്റു സംശയങ്ങളുണ്ടോ?" : "Still Have Questions?"}
          </h2>
          <p className="mt-2 text-sm text-brand-charcoal/70">
            {isMl
              ? "ക്ലിനിക്ക് റിസപ്ഷനുമായി നേരിട്ട് സംസാരിക്കാം."
              : "Our clinical team is always available to clarify procedures and provide guidance."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href={PHONE_TEL}
              className="inline-flex items-center gap-1.5 rounded-md border border-brand-charcoal/20 px-4 py-2 text-xs font-semibold text-brand-charcoal hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              {isMl ? "വിളിക്കുക" : "Call Reception"}
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366] px-4 py-2 text-xs font-semibold text-white hover:bg-[#20ba5c] transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              WhatsApp
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}
