import type { Metadata } from "next";
import Link from "next/link";
import {
  Anchor,
  ArrowRight,
  Layers,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dental services in Angadipuram, Malappuram | Halo Dental",
  description:
    "Explore smile makeovers, clear aligners, dental implants, root canal treatment, teeth whitening and general dentistry at Halo Dental Cosmetic & Orthodontic Centre in Angadipuram, Malappuram, Kerala.",
};

interface Service {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

const SERVICES: Service[] = [
  {
    slug: "smile-makeovers",
    name: "Smile makeovers",
    description: "A personalised plan that brings every part of your smile into balance.",
    icon: Smile,
  },
  {
    slug: "clear-aligners",
    name: "Clear aligners",
    description: "Straighten your teeth gradually with a virtually invisible, removable system.",
    icon: Layers,
  },
  {
    slug: "dental-implants",
    name: "Dental implants",
    description: "A secure, natural-looking replacement for a missing tooth, built to last.",
    icon: Anchor,
  },
  {
    slug: "root-canal-treatment",
    name: "Root canal treatment",
    description: "Gentle, modern care that relieves pain and saves an infected tooth.",
    icon: ShieldCheck,
  },
  {
    slug: "teeth-whitening",
    name: "Teeth whitening",
    description: "Professional whitening for a noticeably brighter smile in a single visit.",
    icon: Sparkles,
  },
  {
    slug: "general-dentistry",
    name: "General dentistry",
    description: "Routine check-ups, cleanings and preventive care for the whole family.",
    icon: Stethoscope,
  },
];

export default function Page() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-brand-midnight">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">
                Services
              </li>
            </ol>
          </nav>

          <h1 className="mt-6 font-display text-4xl text-white sm:text-5xl">Our dental services</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            From a routine check-up to a complete smile makeover, every treatment at Halo Dental
            Cosmetic &amp; Orthodontic Centre in Angadipuram, Malappuram is planned around you.
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

      {/* Services grid */}
      <section aria-label="All services" className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group flex h-full flex-col rounded-lg border border-brand-charcoal/10 bg-brand-ivory p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:p-7"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-gold/10">
                    <service.icon className="h-6 w-6 text-brand-gold" aria-hidden="true" />
                  </span>

                  <h3 className="mt-5 font-display text-xl text-brand-charcoal">{service.name}</h3>

                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-brand-charcoal/70">
                    {service.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-charcoal">
                    Learn more
                    <ArrowRight
                      className="h-4 w-4 text-brand-gold transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-brand-linen py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl text-brand-charcoal sm:text-3xl">
            Not sure which treatment is right for you?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-brand-charcoal/70">
            Book a consultation and Dr. Haseeb will help you find the right plan.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-brand-gold px-5 py-2.5 text-[15px] font-medium text-brand-charcoal transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-linen"
          >
            Book appointment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}