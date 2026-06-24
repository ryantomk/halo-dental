import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Droplet,
  EyeOff,
  Feather,
  MessageCircle,
  Phone,
  TrendingUp,
  Unplug,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Clear Aligners in Angadipuram, Malappuram | Halo Dental",
  description:
    "Straighten your teeth with virtually invisible clear aligners at Halo Dental Cosmetic & Orthodontic Centre in Angadipuram, Malappuram, Kerala.",
};

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to book a consultation for clear aligners.");

const BENEFITS = [
  {
    title: "Nearly invisible",
    description: "Made from clear plastic, most people won't even notice you're wearing them.",
    icon: EyeOff,
  },
  {
    title: "Removable",
    description: "Take them out to eat, brush and floss, then pop them back in — no special tools needed.",
    icon: Unplug,
  },
  {
    title: "Comfortable",
    description: "Smooth edges with no metal brackets or wires means less irritation to your cheeks and gums.",
    icon: Feather,
  },
  {
    title: "Easier cleaning",
    description: "Brush and floss exactly as you normally would, without working around brackets and wires.",
    icon: Droplet,
  },
  {
    title: "Predictable results",
    description: "Digital planning maps out each stage in advance, so you can see roughly how your smile will progress.",
    icon: TrendingUp,
  },
];

const PROCESS_STEPS = [
  {
    title: "Consultation",
    description: "We assess your bite and discuss your goals to confirm aligners are the right choice for you.",
  },
  {
    title: "Digital scan",
    description: "A digital scan of your teeth creates a precise 3D model, with no messy impressions.",
  },
  {
    title: "Custom aligners",
    description: "Your full series of aligners is custom-made from that scan, mapping out each stage of treatment.",
  },
  {
    title: "Progress reviews",
    description: "We check in periodically to track your progress and make sure treatment is moving along as planned.",
  },
  {
    title: "Final result",
    description: "Once you've worked through the full series, you're left with a straighter smile — some patients choose a retainer afterwards to help maintain it.",
  },
];

const COMPARISON_ROWS = [
  { label: "Visibility", aligners: "Virtually invisible, clear plastic", braces: "Visible metal brackets and wires" },
  { label: "Removable", aligners: "Yes — take out to eat and clean", braces: "No — fixed in place throughout treatment" },
  { label: "Eating", aligners: "No food restrictions once removed", braces: "Some hard, sticky or chewy foods best avoided" },
  { label: "Cleaning", aligners: "Brush and floss as normal", braces: "Extra care needed around brackets and wires" },
  { label: "Comfort", aligners: "Smooth plastic, minimal irritation", braces: "Can cause more irritation to cheeks and gums" },
  { label: "Best suited for", aligners: "Mild to moderate alignment issues", braces: "Mild to complex alignment issues" },
];

const FAQS = [
  {
    question: "How long does treatment take?",
    answer:
      "Treatment time varies depending on how much movement is needed, but many cases are completed within six months to a year and a half. We'll give you a personalised estimate at your consultation.",
  },
  {
    question: "Can I eat while wearing aligners?",
    answer:
      "We recommend removing your aligners before eating or drinking anything other than water, then brushing before putting them back in. This keeps both your aligners and your teeth clean.",
  },
  {
    question: "Are aligners painful?",
    answer:
      "You may feel mild pressure for a day or two after switching to a new set in the series — that's a normal sign they're working. It's generally much milder than the discomfort associated with traditional braces.",
  },
  {
    question: "How many hours per day should I wear them?",
    answer:
      "For the best results, aligners should be worn for around 20 to 22 hours a day, removing them only to eat, drink and clean your teeth.",
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
                Clear aligners
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
            Clear aligners in Angadipuram, Malappuram
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Straighten your teeth gradually with a virtually invisible, removable system that fits
            around your day-to-day life.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-1.5 rounded-md bg-brand-gold px-5 py-2.5 text-[15px] font-medium text-brand-charcoal transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight"
          >
            Book appointment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* What are clear aligners? */}
      <section aria-labelledby="what-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 id="what-heading" className="font-display text-3xl text-brand-charcoal sm:text-4xl">
                What are clear aligners?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-charcoal/70">
                Clear aligners are a series of custom-made, virtually invisible plastic trays that
                gradually shift your teeth into a straighter position. Each set is worn for one to
                two weeks before moving on to the next in the series, gently guiding your teeth
                along a pre-planned path.
              </p>
              <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
                They work well for mild to moderate crowding, gaps and bite issues, and are popular
                with teens and adults who want a straighter smile without the look of metal braces.
                Dr. Haseeb will confirm whether aligners are the right fit for your bite during a
                consultation.
              </p>
            </div>

            <div className="flex items-center justify-center rounded-2xl bg-brand-linen p-8 sm:p-10">
              <svg viewBox="0 0 240 140" aria-hidden="true" focusable="false" className="h-36 w-auto sm:h-44">
                <rect x="20" y="50" width="18" height="34" rx="6" fill="#FFFFFF" stroke="#1A252F" strokeOpacity="0.15" strokeWidth="1.5" />
                <rect x="50" y="56" width="18" height="34" rx="6" fill="#FFFFFF" stroke="#1A252F" strokeOpacity="0.15" strokeWidth="1.5" />
                <rect x="80" y="50" width="18" height="34" rx="6" fill="#FFFFFF" stroke="#1A252F" strokeOpacity="0.15" strokeWidth="1.5" />
                <rect x="110" y="56" width="18" height="34" rx="6" fill="#FFFFFF" stroke="#1A252F" strokeOpacity="0.15" strokeWidth="1.5" />
                <rect x="140" y="50" width="18" height="34" rx="6" fill="#FFFFFF" stroke="#1A252F" strokeOpacity="0.15" strokeWidth="1.5" />
                <rect x="170" y="56" width="18" height="34" rx="6" fill="#FFFFFF" stroke="#1A252F" strokeOpacity="0.15" strokeWidth="1.5" />
                <rect x="200" y="50" width="18" height="34" rx="6" fill="#FFFFFF" stroke="#1A252F" strokeOpacity="0.15" strokeWidth="1.5" />
                <rect x="10" y="42" width="220" height="56" rx="20" fill="#C9A96E" fillOpacity="0.18" stroke="#C9A96E" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits-heading" className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="benefits-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Benefits
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
      <section aria-labelledby="process-heading" className="bg-white py-16 sm:py-20">
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
      <section aria-labelledby="comparison-heading" className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 id="comparison-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Clear aligners vs. traditional braces
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-brand-charcoal/70">
            Both straighten teeth effectively — the right choice depends on your bite and lifestyle.
            Here&rsquo;s how they compare.
          </p>

          <div className="mt-10 overflow-x-auto rounded-lg border border-brand-charcoal/10">
            <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
              <thead>
                <tr className="bg-brand-midnight text-white">
                  <th scope="col" className="px-5 py-4 font-display text-base">
                    <span className="sr-only">Comparison criteria</span>
                  </th>
                  <th scope="col" className="px-5 py-4 font-display text-base">
                    Clear aligners
                  </th>
                  <th scope="col" className="px-5 py-4 font-display text-base">
                    Traditional braces
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-charcoal/10 bg-brand-ivory">
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="px-5 py-4 font-medium text-brand-charcoal">
                      {row.label}
                    </th>
                    <td className="px-5 py-4 text-brand-charcoal/80">{row.aligners}</td>
                    <td className="px-5 py-4 text-brand-charcoal/80">{row.braces}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          <h2 className="font-display text-3xl text-white sm:text-4xl">Ready to start with clear aligners?</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
            Call us or message on WhatsApp — we&rsquo;re happy to answer your questions.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={PHONE_TEL}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-[15px] font-medium text-brand-charcoal transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call now
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp booking
            </a>
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