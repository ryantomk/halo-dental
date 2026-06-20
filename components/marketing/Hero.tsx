// TODO: Implement Hero.
// See halo-dental-technical-specification.md, Section 5 (Component structure).

import Image from "next/image";
import Link from "next/link";

/**
 * Hero — homepage marketing banner for Halo Dental Cosmetic & Orthodontic Centre.
 *
 * Design tokens referenced below (brand-midnight, brand-gold, brand-ivory,
 * brand-linen, brand-charcoal) are expected to be registered in
 * tailwind.config.ts per the project's design system spec:
 *   brand-midnight: #2C3E50   brand-ivory:    #EAE6E0
 *   brand-gold:     #C9A96E   brand-linen:    #F8F6F2
 *   brand-charcoal: #1A252F
 *
 * Headline/body font roles (font-display / font-sans) are expected to be
 * mapped to the serif display face and sans body face defined in the
 * typography spec.
 */

interface HeroProps {
  /** Clinic phone number in tel:-compatible format, e.g. "+919999999999" */
  phoneNumber?: string;
  /** Human-readable phone number for display */
  phoneNumberDisplay?: string;
  /** Route the "Book Appointment" CTA points to */
  bookingHref?: string;
}

export default function Hero({
  phoneNumber = "+910000000000",
  phoneNumberDisplay = "+91 00000 00000",
  bookingHref = "/contact",
}: HeroProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-brand-midnight"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-28 xl:px-12">
        {/* Text content */}
        <div className="order-2 lg:order-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand-gold sm:text-sm">
            Angadipuram &middot; Malappuram &middot; Kerala
          </p>

          <h1
            id="hero-heading"
            className="mt-4 font-display text-3xl font-medium leading-tight text-brand-linen sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.15]"
          >
            Smile makeovers and orthodontic care, crafted around you
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-linen/75 sm:text-lg">
            From porcelain veneers to clear aligners, Dr. Haseeb and the team
            at Halo Dental design every treatment plan around how you want to
            look and feel — with the precision of a specialist clinic and the
            warmth of a neighbourhood one.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={bookingHref}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-6 py-3.5 text-sm font-medium text-brand-charcoal transition-colors duration-150 hover:bg-brand-gold/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-base"
            >
              <CalendarIcon className="h-4 w-4" aria-hidden="true" />
              Book appointment
            </Link>

            <a
              href={`tel:${phoneNumber}`}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-brand-linen/30 bg-transparent px-6 py-3.5 text-sm font-medium text-brand-linen transition-colors duration-150 hover:bg-brand-linen/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-linen sm:text-base"
              aria-label={`Call Halo Dental now at ${phoneNumberDisplay}`}
            >
              <PhoneIcon className="h-4 w-4" aria-hidden="true" />
              Call now
            </a>
          </div>

          <p className="mt-6 text-sm text-brand-linen/60">
            Open every day, 9:00 AM&ndash;8:00 PM &middot; Led by{" "}
            <span className="text-brand-linen/85">Dr. Haseeb</span>, Chief
            Dental Surgeon
          </p>
        </div>

        {/* Visual: before/after split + floating consultation card */}
        <div className="relative order-1 lg:order-2">
          <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-brand-linen/15">
            <div className="relative aspect-[3/4] bg-brand-linen/5">
              <Image
                src="/images/hero-before.jpg"
                alt="Patient smile before cosmetic dental treatment at Halo Dental"
                fill
                priority
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
              <span className="absolute bottom-3 left-3 rounded-md bg-brand-midnight/70 px-2.5 py-1 text-[11px] font-medium tracking-wide text-brand-linen backdrop-blur-sm">
                Before
              </span>
            </div>
            <div className="relative aspect-[3/4] bg-brand-gold/10">
              <Image
                src="/images/hero-after.jpg"
                alt="Patient smile after cosmetic dental treatment at Halo Dental"
                fill
                priority
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
              <span className="absolute bottom-3 right-3 rounded-md bg-brand-gold px-2.5 py-1 text-[11px] font-medium tracking-wide text-brand-charcoal">
                After
              </span>
            </div>
          </div>

          {/* Floating booking widget */}
          <div className="relative mx-4 -mt-8 rounded-lg border border-brand-charcoal/10 bg-brand-linen p-4 shadow-lg sm:absolute sm:-bottom-6 sm:-right-4 sm:mx-0 sm:mt-0 sm:w-56 lg:-right-8 lg:w-60">
            <p className="text-xs text-brand-charcoal/60">
              Free initial consultation
            </p>
            <p className="mt-1 font-display text-base font-medium text-brand-charcoal">
              See your smile transform
            </p>
            <Link
              href={bookingHref}
              className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-brand-gold px-4 py-2.5 text-sm font-medium text-brand-charcoal transition-colors duration-150 hover:bg-brand-gold/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              Check availability
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}