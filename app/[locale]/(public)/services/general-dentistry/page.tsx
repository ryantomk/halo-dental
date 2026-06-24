import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  HeartHandshake,
  HeartPulse,
  MessageCircle,
  Microscope,
  Phone,
  PiggyBank,
  Puzzle,
  ScanLine,
  Search,
  ShieldCheck,
  Sofa,
  Sparkles,
  Stethoscope,
  Users,
  Wind,
} from "lucide-react";

export const metadata: Metadata = {
  title: "General Dentistry in Angadipuram, Malappuram | Halo Dental",
  description:
    "General dentistry services at Halo Dental including dental check-ups, cleanings, fillings, preventive care and family dentistry in Angadipuram, Malappuram.",
};

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to book a general dentistry appointment.");

const whatsappButtonClasses =
  "inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto";

const SERVICES_INCLUDED = [
  { title: "Dental check-ups", description: "A thorough look at your teeth, gums and bite to catch issues early.", icon: Stethoscope },
  { title: "Professional cleaning", description: "Removes plaque and tartar build-up that brushing alone can't reach.", icon: Sparkles },
  { title: "Tooth-coloured fillings", description: "Discreet, durable fillings that blend in with your natural teeth.", icon: Puzzle },
  { title: "Preventive care", description: "Guidance and treatment aimed at stopping problems before they start.", icon: ShieldCheck },
  { title: "Oral health assessments", description: "A full picture of your dental health, often supported by digital X-rays.", icon: Microscope },
  { title: "Family dentistry", description: "Routine care for every member of the family, from children to grandparents.", icon: Users },
];

const BENEFITS = [
  { title: "Early detection", description: "Small issues are caught while they're still simple to treat.", icon: Search },
  { title: "Prevent costly treatments", description: "Routine care helps you avoid more complex, expensive procedures later.", icon: ShieldCheck },
  { title: "Better oral health", description: "Consistent care keeps your teeth and gums healthier over the long run.", icon: HeartPulse },
  { title: "Fresh breath", description: "Regular cleanings address a common, often overlooked cause of bad breath.", icon: Wind },
  { title: "Long-term savings", description: "Prevention is almost always less expensive than the treatment it avoids.", icon: PiggyBank },
];

const CHECKUP_STEPS = [
  { title: "Examination", description: "We take a close look at your teeth, gums and bite to spot anything that needs attention." },
  { title: "Oral health assessment", description: "We check for early signs of decay, gum disease or other issues, supported by digital X-rays when needed." },
  { title: "Cleaning, if required", description: "Plaque and tartar build-up is gently removed, leaving your teeth feeling noticeably cleaner." },
  { title: "Treatment recommendations", description: "If anything needs further treatment, we'll explain your options clearly, with no pressure to decide on the spot." },
];

const WHY_CHECKUPS_MATTER = [
  { title: "Detect decay early", description: "Before it needs anything more than a simple filling." },
  { title: "Gum health monitoring", description: "Catching early gum disease while it's still easily treatable." },
  { title: "Oral hygiene guidance", description: "Practical tips tailored to your teeth and habits." },
  { title: "Long-term prevention", description: "Fewer surprises, and fewer emergency visits." },
];

const WHY_CHOOSE = [
  { title: "Patient-first care", description: "We explain what's happening and why, before recommending any treatment.", icon: HeartHandshake },
  { title: "Modern digital dentistry", description: "Digital X-rays and modern equipment support a precise, comfortable visit.", icon: ScanLine },
  { title: "Family-friendly environment", description: "A calm, welcoming clinic suited to patients of every age.", icon: Sofa },
  { title: "Preventive approach", description: "Regular care planned to keep small issues from becoming bigger ones.", icon: CalendarCheck },
];

const FAQS = [
  {
    question: "How often should I visit a dentist?",
    answer:
      "Most people benefit from a check-up and clean every six months, though Dr. Haseeb may suggest more frequent visits depending on your oral health. Regular visits help catch small issues before they become bigger ones.",
  },
  {
    question: "Are dental cleanings painful?",
    answer:
      "Routine cleanings are generally comfortable, with at most some mild sensitivity if it's been a while since your last visit or your gums are a little inflamed. Most patients find it a quick, easy part of the appointment.",
  },
  {
    question: "What happens during a routine check-up?",
    answer:
      "We examine your teeth and gums, check for any signs of decay or other issues, and clean your teeth if needed. We'll also talk you through anything we notice and what, if anything, needs further treatment.",
  },
  {
    question: "When should children first visit a dentist?",
    answer:
      "It's generally recommended that children have their first dental visit by their first birthday, or within six months of their first tooth appearing. Early visits help children get comfortable with the dentist and let us catch any issues early.",
  },
  {
    question: "How can I prevent cavities?",
    answer:
      "Brushing twice a day, flossing daily, limiting sugary food and drink, and keeping up with regular check-ups and cleanings are the most effective ways to prevent cavities.",
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
                General dentistry
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
            Complete dental care for every member of your family
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            From routine check-ups and cleanings to fillings and preventive care, general dentistry
            at Halo Dental in Angadipuram, Malappuram keeps your whole family&rsquo;s smiles healthy,
            year after year.
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

      {/* What is general dentistry? */}
      <section aria-labelledby="what-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="what-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            What is general dentistry?
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brand-charcoal/70">
            General dentistry covers the routine, preventive care that keeps your teeth and gums
            healthy day to day — check-ups, cleanings, fillings and the ongoing guidance that helps
            you avoid bigger problems down the line.
          </p>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            Regular visits matter more than they might seem to. Many dental issues — from early
            decay to gum disease — develop slowly and painlessly at first, which means they&rsquo;re
            often easiest to treat well before you'd notice anything yourself.
          </p>
        </div>
      </section>

      {/* Services included */}
      <section aria-labelledby="services-heading" className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="services-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Services included
          </h2>

          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES_INCLUDED.map((service) => (
              <li
                key={service.title}
                className="rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6 text-center sm:text-left"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-gold/10 sm:mx-0">
                  <service.icon className="h-6 w-6 text-brand-gold" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg text-brand-charcoal">{service.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-brand-charcoal/70">{service.description}</p>
              </li>
            ))}
          </ul>

          <p className="mx-auto mt-10 max-w-2xl text-center text-base leading-relaxed text-brand-charcoal/70">
            Dealing with persistent tooth pain rather than due for a routine visit? Our{" "}
            <Link href="/services/root-canal-treatment" className="font-medium text-brand-charcoal underline-offset-4 hover:underline">
              root canal treatment
            </Link>{" "}
            page covers what to expect. Looking for something more cosmetic? Our{" "}
            <Link href="/services/teeth-whitening" className="font-medium text-brand-charcoal underline-offset-4 hover:underline">
              teeth whitening
            </Link>{" "}
            can brighten things up too. Not sure what you need?{" "}
            <Link href="/contact" className="font-medium text-brand-charcoal underline-offset-4 hover:underline">
              Contact us
            </Link>{" "}
            and we&rsquo;ll point you in the right direction.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="benefits-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Benefits of regular dental care
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

      {/* What happens during a check-up */}
      <section aria-labelledby="checkup-heading" className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="checkup-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            What happens during a check-up?
          </h2>

          <ol className="mt-12 space-y-10">
            {CHECKUP_STEPS.map((step, index) => (
              <li key={step.title} className="relative flex gap-5 pl-1">
                {index < CHECKUP_STEPS.length - 1 && (
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

      {/* Why regular check-ups matter */}
      <section aria-labelledby="why-checkups-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="why-checkups-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Why regular check-ups matter
          </h2>

          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {WHY_CHECKUPS_MATTER.map((item) => (
              <li key={item.title} className="flex items-start gap-3 rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-4">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                <div>
                  <p className="font-medium text-brand-charcoal">{item.title}</p>
                  <p className="mt-0.5 text-[15px] text-brand-charcoal/70">{item.description}</p>
                </div>
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

      {/* Final CTA */}
      <section className="bg-brand-midnight">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20 lg:px-8">
          <h2 className="font-display text-3xl text-white sm:text-4xl">Ready to book your family in?</h2>
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