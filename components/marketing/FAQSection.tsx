"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Faq {
  question: string;
  answer: string;
}

const FAQS: Faq[] = [
  {
    question: "How often should I visit a dentist?",
    answer:
      "Most people benefit from a check-up and clean every six months, though Dr. Haseeb may suggest more frequent visits depending on your oral health. Regular visits help catch small issues before they become bigger ones.",
  },
  {
    question: "Are clear aligners better than braces?",
    answer:
      "Both are effective at straightening teeth — the right choice depends on your bite, budget and lifestyle. Clear aligners are removable and far less noticeable, while metal braces can be better suited to more complex movements. We'll help you weigh the options at your consultation.",
  },
  {
    question: "Is teeth whitening safe?",
    answer:
      "Professional teeth whitening, done under a dentist's supervision, is considered safe for most adults. Some mild, temporary sensitivity is common, which is one reason we recommend having it done in-clinic rather than with unsupervised home kits.",
  },
  {
    question: "How long do dental implants last?",
    answer:
      "With good oral hygiene and regular check-ups, a dental implant can last for decades — for many patients, a lifetime. The crown on top may eventually need replacing due to normal wear, but the implant itself is built to be a long-term solution.",
  },
  {
    question: "Does root canal treatment hurt?",
    answer:
      "Modern root canal treatment, performed with local anaesthesia, is generally no more uncomfortable than getting a filling. Most of the pain people associate with root canals actually comes from the infection beforehand — the treatment itself is what relieves it.",
  },
  {
    question: "What should I do during a dental emergency?",
    answer:
      "Call us right away — we'll advise you over the phone and fit you in as soon as we can. In the meantime, rinse gently with warm water, avoid extreme temperatures, and keep any knocked-out tooth moist (in milk or saliva) until you can be seen.",
  },
  {
    question: "How long does a smile makeover take?",
    answer:
      "It depends on the treatments involved. A makeover combining whitening and minor adjustments might be completed in a couple of visits, while one involving veneers, implants or orthodontics can take several weeks to months. We'll map out a clear timeline during your consultation.",
  },
  {
    question: "Do you offer consultations?",
    answer:
      "Yes — every new treatment plan starts with a consultation, so Dr. Haseeb can understand your goals and recommend the right approach before any work begins. You can book one through the appointment form or by calling us directly.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section aria-labelledby="faq-heading" className="bg-brand-linen py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="faq-heading" className="font-display text-3xl text-brand-charcoal sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-charcoal/70">
            Answers to the questions we hear most often. Don&rsquo;t see yours? Just give us a call.
          </p>
        </div>

        <div className="mt-10 divide-y divide-brand-charcoal/10 rounded-lg border border-brand-charcoal/10 bg-brand-ivory">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            const buttonId = `faq-button-${index}`;
            const panelId = `faq-panel-${index}`;

            return (
              <div key={faq.question}>
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-brand-gold/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-gold sm:px-6"
                  >
                    <span className="text-[15px] font-medium text-brand-charcoal sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        "h-5 w-5 flex-shrink-0 text-brand-gold transition-transform duration-300",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  aria-labelledby={buttonId}
                  className={cn(
                    "grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="min-h-0">
                    <p className="px-5 pb-5 text-[15px] leading-relaxed text-brand-charcoal/70 sm:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}