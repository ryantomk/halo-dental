import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Bone,
  ChevronDown,
  MessageCircle,
  Phone,
  ShieldCheck,
  Smile,
  Utensils,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dental Implants in Angadipuram, Malappuram | Halo Dental",
  description:
    "Replace a missing tooth with a secure, natural-looking dental implant at Halo Dental Cosmetic & Orthodontic Centre in Angadipuram, Malappuram, Kerala.",
};

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to book a consultation for dental implants.");

const BENEFITS = [
  {
    title: "Natural appearance",
    description: "Crafted to match the shape, size and shade of your surrounding teeth, so the result blends right in.",
    icon: Smile,
  },
  {
    title: "Improved chewing",
    description: "A stable, secure fit lets you eat the foods you enjoy with confidence.",
    icon: Utensils,
  },
  {
    title: "Long-lasting",
    description: "With good oral hygiene and regular check-ups, an implant can last for decades.",
    icon: ShieldCheck,
  },
  {
    title: "Bone preservation",
    description:
      "Unlike a bridge or denture, an implant stimulates the jawbone, helping to prevent the bone loss that often follows tooth loss.",
    icon: Bone,
  },
];

const PROCESS_STEPS = [
  {
    title: "Consultation",
    description: "We examine your teeth and jaw, discuss your goals, and check whether an implant is the right fit for you.",
  },
  {
    title: "Planning",
    description: "Using digital X-rays, Dr. Haseeb maps out the precise position for your implant for a predictable, comfortable outcome.",
  },
  {
    title: "Implant placement",
    description: "The implant post is placed into the jawbone under local anaesthesia, in a procedure most patients describe as straightforward.",
  },
  {
    title: "Healing",
    description: "Over the following weeks, the implant gradually fuses with the surrounding bone — a process called osseointegration.",
  },
  {
    title: "Final crown",
    description: "Once healing is complete, a custom-made crown is fitted on top, completing your new tooth.",
  },
];

const FAQS = [
  {
    question: "Does it hurt?",
    answer:
      "The placement procedure is done under local anaesthesia, so you shouldn't feel pain during the appointment. Mild soreness or swelling for a few days afterwards is normal and usually manageable with over-the-counter pain relief.",
  },
  {
    question: "How long does it last?",
    answer:
      "With good oral hygiene and regular check-ups, a dental implant can last for decades — for many patients, a lifetime. The crown on top may eventually need replacing due to normal wear.",
  },
  {
    question: "Who is a candidate?",
    answer:
      "Most adults with good general and oral health are suitable candidates, including many who've previously been told they weren't eligible for other tooth-replacement options. A consultation, where we assess your jawbone and overall oral health, is the best way to know for sure.",
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
                Dental implants
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
            Dental implants in Angadipuram, Malappuram
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            A dental implant is one of the most reliable ways to replace a missing tooth —
            restoring the way you eat, speak and smile, without affecting the teeth around it.
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

      {/* What are dental implants? */}
      <section aria-labelledby="what-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 id="what-heading" className="font-display text-3xl text-brand-charcoal sm:text-4xl">
                What are dental implants?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-charcoal/70">
                A dental implant is a small titanium post that&rsquo;s placed into the jawbone, acting
                as an artificial root for a replacement tooth. Once it has fused with the bone, a
                custom-made crown is fitted on top — giving you a result that looks, feels and
                functions like a natural tooth.
              </p>
              <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
                Implants can replace a single tooth, several teeth, or support a full set of
                dentures, depending on what you need.
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 rounded-2xl bg-brand-linen p-8 sm:p-10">
              <svg viewBox="0 0 200 260" aria-hidden="true" focusable="false" className="h-56 w-auto sm:h-64">
                <rect x="20" y="170" width="160" height="70" rx="24" fill="#EAE6E0" stroke="#1A252F" strokeOpacity="0.15" />
                <rect x="92" y="120" width="16" height="70" rx="2" fill="#2C3E50" />
                <line x1="92" y1="135" x2="108" y2="135" stroke="#F8F6F2" strokeWidth="2" />
                <line x1="92" y1="150" x2="108" y2="150" stroke="#F8F6F2" strokeWidth="2" />
                <line x1="92" y1="165" x2="108" y2="165" stroke="#F8F6F2" strokeWidth="2" />
                <rect x="88" y="100" width="24" height="22" rx="4" fill="#C9A96E" />
                <path
                  d="M70 60 Q70 30 100 28 Q130 30 130 60 L130 100 L70 100 Z"
                  fill="#FFFFFF"
                  stroke="#1A252F"
                  strokeOpacity="0.15"
                  strokeWidth="2"
                />
              </svg>

              <ul className="space-y-3 text-sm text-brand-charcoal">
                <li className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-white ring-1 ring-brand-charcoal/20" aria-hidden="true" />
                  Crown
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-gold" aria-hidden="true" />
                  Abutment
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-midnight" aria-hidden="true" />
                  Implant post
                </li>
              </ul>
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

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="bg-brand-linen py-16 sm:py-20">
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
          <h2 className="font-display text-3xl text-white sm:text-4xl">Ready to talk about dental implants?</h2>
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto"
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