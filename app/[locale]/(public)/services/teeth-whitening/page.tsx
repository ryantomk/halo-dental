import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  HeartHandshake,
  Info,
  Lock,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smile,
  Sparkles,
  TrendingUp,
  UserCheck,
  Wand2,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Teeth Whitening in Angadipuram, Malappuram | Halo Dental",
  description:
    "Professional teeth whitening treatment at Halo Dental Cosmetic & Orthodontic Centre. Remove stains and achieve a brighter smile with safe and effective whitening solutions.",
};

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to book an appointment for teeth whitening.");

const whatsappButtonClasses =
  "inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto";

const CAUSES = [
  "Coffee and tea",
  "Smoking",
  "Natural aging of the enamel",
  "Dark-coloured foods and beverages",
  "Poor oral hygiene",
];

const BENEFITS = [
  { title: "Brighter smile", description: "A noticeably whiter, more even shade across all your visible teeth.", icon: Sparkles },
  { title: "Increased confidence", description: "Feel more at ease smiling in photos, conversations and everyday moments.", icon: Smile },
  { title: "Fast treatment", description: "Visible results in a single in-clinic visit, with no weeks of waiting.", icon: Zap },
  { title: "Safe procedure", description: "Carried out under professional supervision, with your gums and enamel protected.", icon: ShieldCheck },
  { title: "More predictable results", description: "Your shade change is monitored and adjusted by your dentist as you go.", icon: TrendingUp },
];

const PROCESS_STEPS = [
  { title: "Consultation", description: "We check that your teeth and gums are healthy enough for whitening and discuss what you'd like to achieve." },
  { title: "Shade assessment", description: "We record your current shade so we can measure and show you the improvement afterwards." },
  { title: "Whitening procedure", description: "A professional-strength whitening gel is applied under controlled conditions to lift stains evenly." },
  { title: "Post-treatment care", description: "We talk you through what to expect over the next day or two, including any mild sensitivity." },
  { title: "Follow-up advice", description: "Simple guidance on diet and habits to help your new shade last as long as possible." },
];

const COMPARISON_ROWS = [
  { label: "Safety", professional: "Done under dental supervision, with your gums and enamel protected throughout", home: "Safety varies widely between products, with little oversight of gum or enamel exposure" },
  { label: "Effectiveness", professional: "Higher-strength whitening agents produce a noticeably brighter, more even result", home: "Lower-strength formulas often produce limited, uneven results" },
  { label: "Speed", professional: "Visible results in a single visit", home: "Typically needs weeks of repeated use for a smaller change" },
  { label: "Results", professional: "Shade change is measured and adjusted by your dentist", home: "Results are harder to predict and aren't professionally monitored" },
];

const WHY_CHOOSE = [
  { title: "Modern cosmetic dentistry", description: "Treatment planned with the same care and technology behind our full smile makeovers.", icon: Wand2 },
  { title: "Personalised treatment", description: "Your target shade and treatment plan are tailored to your teeth, not a one-size-fits-all kit.", icon: UserCheck },
  { title: "Safe whitening methods", description: "Professional-grade products used under supervision, with your comfort and enamel protected.", icon: Lock },
  { title: "Patient-first care", description: "We explain what to expect at every step, with no pressure and no surprises.", icon: HeartHandshake },
];

const FAQS = [
  {
    question: "Is teeth whitening safe?",
    answer:
      "Professional teeth whitening, done under a dentist's supervision, is considered safe for most adults. Some mild, temporary sensitivity is common, which is one reason we recommend having it done in-clinic rather than with unsupervised home kits.",
  },
  {
    question: "How long do results last?",
    answer:
      "Results commonly last from several months up to a couple of years, depending on your diet, habits like smoking, and how well you maintain your oral hygiene. Avoiding heavily staining foods and drinks, and touching up occasionally, helps results last longer.",
  },
  {
    question: "Does whitening damage teeth?",
    answer:
      "When done correctly under professional supervision, whitening doesn't damage healthy tooth enamel. Some people experience temporary sensitivity during or shortly after treatment, which typically settles on its own within a few days.",
  },
  {
    question: "Will whitening work on all stains?",
    answer:
      "It depends on the cause. Whitening works well on stains from food, drink and smoking, but stains caused by certain medications, old fillings or injury to a tooth may not respond the same way — we'll let you know what to expect after assessing your teeth.",
  },
  {
    question: "Is whitening painful?",
    answer:
      "Most people feel little to no pain during the procedure itself. Some experience mild, short-lived sensitivity to cold afterwards, which usually fades within a day or two.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function Page() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-brand-midnight">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center justify-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/services" className="transition-colors hover:text-white">
                  Services
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">
                Teeth whitening
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
            A noticeably brighter smile, done safely and predictably
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Professional teeth whitening removes years of stains from coffee, tea and everyday
            life — giving you a brighter, more even smile in a single visit at Halo Dental in
            Angadipuram, Malappuram.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-gold px-5 py-2.5 text-[15px] font-medium text-brand-charcoal transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto"
            >
              Book appointment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={whatsappButtonClasses}>
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* What is teeth whitening? */}
      <section aria-labelledby="what-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 id="what-heading" className="font-display text-3xl text-brand-charcoal sm:text-4xl">
                What is teeth whitening?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-charcoal/70">
                Professional teeth whitening uses a dentist-grade whitening gel, applied under
                controlled conditions, to break down the stains and discolouration built up on and
                inside your tooth enamel — lifting your overall shade several levels in a single
                visit.
              </p>
              <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
                Over-the-counter strips, gels and whitening toothpaste use much lower
                concentrations and aren&rsquo;t fitted to your teeth, so results tend to be slower,
                patchier and harder to predict. Professional whitening is monitored throughout, so
                the result — and your comfort — stay in safe hands.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-brand-linen p-8 sm:p-10">
              <svg viewBox="0 0 300 90" aria-hidden="true" focusable="false" className="h-20 w-full max-w-sm sm:h-24">
                <rect x="0" y="15" width="48" height="60" rx="14" fill="#D6D2CC" />
                <rect x="63" y="15" width="48" height="60" rx="14" fill="#DFDBD4" />
                <rect x="126" y="15" width="48" height="60" rx="14" fill="#EAE6E0" />
                <rect x="189" y="15" width="48" height="60" rx="14" fill="#F4F2EE" />
                <rect x="252" y="15" width="48" height="60" rx="14" fill="#FFFFFF" stroke="#1A252F" strokeOpacity="0.1" strokeWidth="1.5" />
              </svg>
              <p className="flex items-center gap-2 text-sm text-brand-charcoal/70">
                Stained
                <ArrowRight className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                Treated shade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Causes of stains */}
      <section aria-labelledby="causes-heading" className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="causes-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Common causes of tooth stains
          </h2>

          <ul className="mt-10 space-y-4">
            {CAUSES.map((cause) => (
              <li
                key={cause}
                className="flex items-start gap-3 rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-4 text-[15px] text-brand-charcoal"
              >
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                {cause}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-base leading-relaxed text-brand-charcoal/70">
            Whitening is often just one part of a bigger plan — if you&rsquo;re after a more
            complete change, take a look at our{" "}
            <Link href="/services/smile-makeovers" className="font-medium text-brand-charcoal underline-offset-4 hover:underline">
              smile makeovers
            </Link>
            , or{" "}
            <Link href="/contact" className="font-medium text-brand-charcoal underline-offset-4 hover:underline">
              contact us
            </Link>{" "}
            to talk through what&rsquo;s right for you.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="benefits-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Benefits of professional teeth whitening
          </h2>

          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <li
                key={benefit.title}
                className="rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6 text-center sm:text-left"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 sm:mx-0">
                  <benefit.icon className="h-6 w-6 text-brand-gold" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg text-brand-charcoal">{benefit.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-brand-charcoal/70">{benefit.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Treatment process */}
      <section aria-labelledby="process-heading" className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="process-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Treatment process
          </h2>

          <ol className="mt-12 space-y-10">
            {PROCESS_STEPS.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 pl-1">
                {index < PROCESS_STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[19px] top-10 h-[calc(100%+1rem)] w-px bg-brand-charcoal/10"
                  />
                )}
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-gold font-display text-base text-brand-charcoal">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl text-brand-charcoal">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-brand-charcoal/70">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Comparison */}
      <section aria-labelledby="comparison-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 id="comparison-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Professional whitening vs. home remedies
          </h2>

          <div className="mt-10 overflow-x-auto rounded-lg border border-brand-charcoal/10">
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="bg-brand-midnight text-white">
                  <th scope="col" className="px-5 py-4 font-display text-base">
                    <span className="sr-only">Comparison criteria</span>
                  </th>
                  <th scope="col" className="px-5 py-4 font-display text-base">
                    Professional whitening
                  </th>
                  <th scope="col" className="px-5 py-4 font-display text-base">
                    Home remedies
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-charcoal/10 bg-brand-ivory">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="px-5 py-4 font-medium text-brand-charcoal">
                      {row.label}
                    </th>
                    <td className="px-5 py-4 text-brand-charcoal/80">{row.professional}</td>
                    <td className="px-5 py-4 text-brand-charcoal/80">{row.home}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why choose Halo Dental */}
      <section aria-labelledby="why-heading" className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="why-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Why choose Halo Dental
          </h2>

          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE.map((reason) => (
              <li
                key={reason.title}
                className="rounded-lg border border-brand-charcoal/10 bg-white p-6 text-center sm:text-left"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 sm:mx-0">
                  <reason.icon className="h-6 w-6 text-brand-gold" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg text-brand-charcoal">{reason.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-brand-charcoal/70">{reason.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="faq-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Frequently asked questions
          </h2>

          <div className="mt-10 divide-y divide-brand-charcoal/10 rounded-lg border border-brand-charcoal/10 bg-brand-ivory">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group p-1">
                <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-[15px] font-medium text-brand-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold sm:px-5">
                  {faq.question}
                  <ChevronDown
                    className="h-5 w-5 flex-shrink-0 text-brand-gold transition-transform duration-300 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="px-4 pb-4 text-[15px] leading-relaxed text-brand-charcoal/70 sm:px-5">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-midnight">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-display text-3xl text-white sm:text-4xl">Ready for a brighter smile?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
            Call, message on WhatsApp, or book a consultation directly — whichever&rsquo;s easiest for you.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
            <a
              href={PHONE_TEL}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-[15px] font-medium text-brand-charcoal transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call now
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={whatsappButtonClasses}>
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp us
            </a>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:border-brand-gold hover:bg-white/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto"
            >
              Book appointment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  );
}