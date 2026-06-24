import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Ban,
  Check,
  ChevronDown,
  HeartHandshake,
  HeartPulse,
  MessageCircle,
  Microscope,
  Phone,
  RotateCcw,
  Save,
  ScanLine,
  ShieldCheck,
  Sofa,
  X,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Root Canal Treatment in Angadipuram, Malappuram | Halo Dental",
  description:
    "Pain-free root canal treatment at Halo Dental Cosmetic & Orthodontic Centre. Save infected teeth and relieve dental pain with modern endodontic care.",
};

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I'd like to book an appointment for root canal treatment.");

const whatsappButtonClasses =
  "inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 py-2.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-midnight sm:w-auto";

const SIGNS = [
  "A severe, persistent toothache",
  "Sensitivity to hot or cold that lingers",
  "Swollen or tender gums near a tooth",
  "Darkening or discoloration of a tooth",
  "Pain when chewing or biting down",
];

const BENEFITS = [
  { title: "Relieves pain", description: "Removes the infected tissue causing the ache, rather than just masking it.", icon: HeartPulse },
  { title: "Saves your natural tooth", description: "Keeps your own tooth in place instead of removing it.", icon: Save },
  { title: "Prevents extraction", description: "Avoids the bone loss and shifting teeth that often follow a missing tooth.", icon: ShieldCheck },
  { title: "Stops infection spreading", description: "Clears the infection before it can affect neighbouring teeth or your jaw.", icon: Ban },
  { title: "Restores normal function", description: "Lets you bite and chew normally again, without favouring the other side.", icon: RotateCcw },
];

const PROCESS_STEPS = [
  { title: "Consultation and examination", description: "We review your symptoms and examine the affected tooth and surrounding gum." },
  { title: "Digital X-ray", description: "A digital X-ray shows the extent of the infection and the shape of the root canals." },
  { title: "Cleaning the infected pulp", description: "The infected or inflamed pulp tissue is carefully removed from inside the tooth, under local anaesthesia." },
  { title: "Filling the root canals", description: "The cleaned canals are shaped and sealed with a biocompatible filling material." },
  { title: "Crown placement, if required", description: "A crown is fitted where needed to protect the tooth and restore its full strength." },
];

const MYTHS = [
  {
    claim: "Root canals are painful",
    fact: "With modern local anaesthesia, most patients feel little more than the routine discomfort of a filling. Much of the pain people associate with root canals actually comes from the infection itself — the treatment is what relieves it.",
  },
  {
    claim: "Extraction is better than a root canal",
    fact: "Saving your natural tooth is almost always the better long-term option. Removing a tooth can lead to bone loss, shifting teeth, and the added cost of a bridge or implant later — a root canal keeps your natural bite intact.",
  },
  {
    claim: "Recovery takes weeks",
    fact: "Most patients return to normal activities the same day or the next, with only mild soreness for a couple of days. There's no extended downtime involved.",
  },
];

const WHY_CHOOSE = [
  { title: "Modern technology", description: "Digital X-rays support a precise diagnosis and a comfortable, efficient procedure.", icon: ScanLine },
  { title: "Patient-first care", description: "We take time to explain what's happening and what to expect before any treatment begins.", icon: HeartHandshake },
  { title: "Comfortable treatment experience", description: "Local anaesthesia and a calm, unhurried approach keep the procedure as comfortable as possible.", icon: Sofa },
  { title: "Detailed diagnosis", description: "We confirm exactly what's causing your pain before recommending treatment, not after.", icon: Microscope },
];

const FAQS = [
  {
    question: "Is root canal treatment painful?",
    answer:
      "With modern local anaesthesia, the procedure itself is generally no more uncomfortable than getting a filling. Some mild soreness for a day or two afterwards is normal and usually manageable with over-the-counter pain relief.",
  },
  {
    question: "How many visits are needed?",
    answer:
      "Many root canals are completed in one or two visits, though more complex cases — or those needing a crown afterwards — may take a few additional appointments.",
  },
  {
    question: "How long does a root canal last?",
    answer:
      "A successfully treated tooth can last many years, often a lifetime, especially when it's protected with a crown and you keep up with regular check-ups.",
  },
  {
    question: "Will I need a crown?",
    answer:
      "Often, yes — a crown protects the tooth from cracking and restores its full chewing strength, since a treated tooth can become more brittle over time. We'll let you know if your tooth needs one.",
  },
  {
    question: "Can the tooth get infected again?",
    answer:
      "It's uncommon, but possible if new decay reaches the tooth or the seal is compromised. Keeping up with brushing, flossing and regular check-ups goes a long way toward preventing this.",
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
                Root canal treatment
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">
            Lasting relief from tooth pain — without losing your tooth
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            If a damaged or infected tooth has been causing you pain, root canal treatment can
            relieve it and save your natural tooth — often in just one or two visits at Halo
            Dental in Angadipuram, Malappuram.
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

      {/* What is root canal treatment? */}
      <section aria-labelledby="what-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 id="what-heading" className="font-display text-3xl text-brand-charcoal sm:text-4xl">
                What is root canal treatment?
              </h2>
              <p className="mt-5 text-base leading-relaxed text-brand-charcoal/70">
                Inside every tooth is a soft tissue called the pulp, containing nerves and blood
                vessels. When deep decay, a crack, or repeated dental work lets bacteria reach the
                pulp, it can become infected and inflamed — which is usually what causes the kind
                of deep, throbbing toothache that brings people in to see us.
              </p>
              <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
                Root canal treatment — sometimes called endodontic treatment — removes that
                infected pulp, cleans out the canal inside the tooth, and seals it, removing the
                source of the infection while keeping your natural tooth in place.
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 rounded-2xl bg-brand-linen p-8 sm:p-10">
              <svg viewBox="0 0 160 220" aria-hidden="true" focusable="false" className="h-48 w-auto sm:h-56">
                <path
                  d="M30 20 Q30 0 80 0 Q130 0 130 20 L130 70 Q130 90 80 90 Q30 90 30 70 Z"
                  fill="#FFFFFF"
                  stroke="#1A252F"
                  strokeOpacity="0.15"
                  strokeWidth="2"
                />
                <path
                  d="M55 90 L60 200 Q60 212 70 212 Q78 212 80 200 L80 90 Z"
                  fill="#EAE6E0"
                  stroke="#1A252F"
                  strokeOpacity="0.15"
                  strokeWidth="2"
                />
                <path
                  d="M105 90 L100 200 Q100 212 90 212 Q82 212 80 200 L80 90 Z"
                  fill="#EAE6E0"
                  stroke="#1A252F"
                  strokeOpacity="0.15"
                  strokeWidth="2"
                />
                <path d="M80 18 L80 205" stroke="#C9A96E" strokeWidth="6" strokeLinecap="round" />
              </svg>

              <p className="max-w-[8rem] text-sm text-brand-charcoal/70">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-gold" aria-hidden="true" /> Pulp
                (nerve) chamber and canal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Signs */}
      <section aria-labelledby="signs-heading" className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 id="signs-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Signs you may need a root canal
          </h2>

          <ul className="mt-10 space-y-4">
            {SIGNS.map((sign) => (
              <li
                key={sign}
                className="flex items-start gap-3 rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-4 text-[15px] text-brand-charcoal"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-gold" aria-hidden="true" />
                {sign}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-center text-base leading-relaxed text-brand-charcoal/70">
            Not sure whether your symptoms need a root canal or just a routine check-up? Our{" "}
            <Link href="/services/general-dentistry" className="font-medium text-brand-charcoal underline-offset-4 hover:underline">
              general dentistry
            </Link>{" "}
            team can help you figure out which applies — or{" "}
            <Link href="/contact" className="font-medium text-brand-charcoal underline-offset-4 hover:underline">
              contact us
            </Link>{" "}
            directly and we&rsquo;ll guide you through it.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="benefits-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Benefits of root canal treatment
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

      {/* Myths vs facts */}
      <section aria-labelledby="myths-heading" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="myths-heading" className="text-center font-display text-3xl text-brand-charcoal sm:text-4xl">
            Common myths vs. facts
          </h2>

          <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {MYTHS.map((myth) => (
              <li key={myth.claim} className="rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6">
                <p className="flex items-center gap-2 text-sm font-medium text-brand-charcoal/50">
                  <X className="h-4 w-4" aria-hidden="true" />
                  Myth
                </p>
                <p className="mt-2 font-display text-lg text-brand-charcoal">{myth.claim}</p>

                <div className="mt-4 border-t border-brand-charcoal/10 pt-4">
                  <p className="flex items-center gap-2 text-sm font-medium text-brand-gold">
                    <Check className="h-4 w-4" aria-hidden="true" />
                    Fact
                  </p>
                  <p className="mt-2 text-[15px] leading-relaxed text-brand-charcoal/70">{myth.fact}</p>
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
          <h2 className="font-display text-3xl text-white sm:text-4xl">Don&rsquo;t wait out the pain</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/70">
            The sooner an infected tooth is treated, the more comfortable the process tends to be.
            Reach out and we&rsquo;ll get you in as soon as we can.
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