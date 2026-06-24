import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ChevronDown,
  ClipboardList,
  Gem,
  HeartHandshake,
  Layers,
  Leaf,
  MessageCircle,
  Palette,
  PenTool,
  Phone,
  ScanLine,
  Smile,
  Sofa,
  Sparkles,
  UserCheck,
  Wand2,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Smile Makeovers in Angadipuram, Malappuram | Halo Dental",
  description:
    "Smile makeover treatments including veneers, whitening and cosmetic dentistry at Halo Dental Cosmetic & Orthodontic Centre, Angadipuram, Malappuram.",
};

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to book a consultation for a smile makeover.");

interface Treatment {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string | null;
}

const TREATMENTS: Treatment[] = [
  {
    name: "Veneers",
    description: "Thin, custom shells that cover the front of your teeth for an even, natural-looking finish.",
    icon: Gem,
    href: null,
  },
  {
    name: "Teeth whitening",
    description: "Professional whitening for a noticeably brighter smile in a single visit.",
    icon: Sparkles,
    href: "/services/teeth-whitening",
  },
  {
    name: "Clear aligners",
    description: "Straighten your teeth gradually with a virtually invisible, removable system.",
    icon: Layers,
    href: "/services/clear-aligners",
  },
  {
    name: "Cosmetic bonding",
    description: "Tooth-coloured composite resin used to reshape chips, gaps and minor imperfections.",
    icon: Wand2,
    href: null,
  },
  {
    name: "Smile design",
    description: "A digital preview of your new smile, planned around your facial features before any treatment begins.",
    icon: PenTool,
    href: null,
  },
];

const BENEFITS = [
  { title: "Improved confidence", description: "Feel more at ease smiling in photos, conversations and everyday moments.", icon: Smile },
  { title: "Better aesthetics", description: "A balanced, even smile that complements your face rather than just your teeth.", icon: Palette },
  { title: "Personalised treatment planning", description: "Every plan is built around your teeth, goals and budget — not a one-size-fits-all package.", icon: ClipboardList },
  { title: "Natural-looking results", description: "Treatments are shaded and shaped to blend with your natural teeth, not stand out from them.", icon: Leaf },
];

const PROCESS_STEPS = [
  { title: "Consultation", description: "We listen to what you'd like to change about your smile and examine your teeth, gums and bite." },
  { title: "Digital smile analysis", description: "Photos and digital imaging help map out how different treatments would change your smile." },
  { title: "Treatment planning", description: "We put together a step-by-step plan — which treatments, in what order, and a realistic timeline." },
  { title: "Treatment phase", description: "Each treatment in your plan is carried out at a comfortable pace, with check-ins along the way." },
  { title: "Final review", description: "Once treatment is complete, we review the result together and make any final adjustments." },
];

const SHOWCASE_ITEMS = ["Veneers", "Teeth whitening", "Full smile makeover"];

const WHY_CHOOSE = [
  { title: "Modern technology", description: "Digital X-rays and digital smile analysis support precise, predictable planning.", icon: ScanLine },
  { title: "Patient-first care", description: "Every plan starts with listening to your goals, not fitting you into a standard package.", icon: HeartHandshake },
  { title: "Personalised planning", description: "Dr. Haseeb tailors each treatment combination to your teeth, face and budget.", icon: UserCheck },
  { title: "Comfortable environment", description: "A calm, modern clinic designed to make every visit feel relaxed, not clinical.", icon: Sofa },
];

const FAQS = [
  {
    question: "Is a smile makeover painful?",
    answer:
      "Most smile makeover treatments — like whitening, bonding and aligners — involve little to no discomfort. If your plan includes veneers or other procedures, we'll use local anaesthesia where needed so you stay comfortable throughout.",
  },
  {
    question: "How long does treatment take?",
    answer:
      "It depends on which treatments are included. A makeover combining whitening and bonding might be finished in a couple of visits, while one involving veneers, aligners or implants can take several weeks to months. We'll map out a clear timeline during your consultation.",
  },
  {
    question: "How much does a smile makeover cost?",
    answer:
      "Costs vary widely depending on which treatments are combined and how many teeth are involved. We'll give you a clear, itemised quote after your consultation, with no obligation.",
  },
  {
    question: "Am I a good candidate?",
    answer:
      "Most people with healthy gums and teeth are good candidates for some combination of smile makeover treatments. The best way to know exactly what would work for you is a consultation, where we'll assess your smile and talk through your goals.",
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
                Smile makeovers
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
            Smile makeovers in Angadipuram, Malappuram
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            A personalised combination of cosmetic treatments, planned around your teeth and your
            goals, to bring every part of your smile into balance.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-gold px-5 py-2.5 text-[15px] font-medium text-brand-charcoal transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto"
            >
              Book appointment
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:border-brand-gold hover:bg-white/10 hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp us
            </a>
          </div>
        </div>
      </section>

      {/* What is a smile makeover? */}
      <section aria-labelledby="what-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="what-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            What is a smile makeover?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brand-charcoal/70">
            A smile makeover isn&rsquo;t a single procedure — it&rsquo;s a combination of cosmetic
            treatments chosen and sequenced specifically for you. Depending on what you&rsquo;d
            like to change, that might mean whitening alone, or whitening paired with veneers,
            bonding or clear aligners.
          </p>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            Rather than treating each issue separately, Dr. Haseeb looks at your smile as a whole —
            the shape, colour and alignment of your teeth, how much you show when you smile, and
            how everything works together — before recommending a plan that fits your goals and
            your budget.
          </p>
        </div>
      </section>

      {/* Treatments included */}
      <section aria-labelledby="treatments-heading" className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="treatments-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Treatments included
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-brand-charcoal/70">
            Your makeover might include one of these or several together — we&rsquo;ll confirm the
            right combination at your consultation.
          </p>

          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TREATMENTS.map((treatment) => {
              const content = (
                <>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10">
                    <treatment.icon className="h-6 w-6 text-brand-gold" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg text-brand-charcoal">{treatment.name}</h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-brand-charcoal/70">
                    {treatment.description}
                  </p>
                  {treatment.href && (
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-charcoal">
                      Learn more
                      <ArrowRight className="h-4 w-4 text-brand-gold" aria-hidden="true" />
                    </span>
                  )}
                </>
              );

              return (
                <li key={treatment.name}>
                  {treatment.href ? (
                    <Link
                      href={treatment.href}
                      className="group flex h-full flex-col rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-linen"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex h-full flex-col rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6 shadow-sm">
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="benefits-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Benefits
          </h2>

          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Process */}
      <section aria-labelledby="process-heading" className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="process-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Smile makeover process
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

      {/* Before & after showcase */}
      <section aria-labelledby="showcase-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="showcase-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Before &amp; after
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed text-brand-charcoal/70">
            Real results from real patients — our photo gallery is on its way.
          </p>

          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {SHOWCASE_ITEMS.map((item) => (
              <li key={item}>
                <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-brand-charcoal/20 bg-brand-ivory text-brand-charcoal/50">
                  <Camera className="h-8 w-8" aria-hidden="true" />
                  <p className="text-sm font-medium">Photos coming soon</p>
                </div>
                <p className="mt-3 text-center text-[15px] font-medium text-brand-charcoal">{item}</p>
              </li>
            ))}
          </ul>
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

      {/* Final conversion */}
      <section className="bg-brand-midnight">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-display text-3xl text-white sm:text-4xl">Ready to plan your smile makeover?</h2>
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
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp booking
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