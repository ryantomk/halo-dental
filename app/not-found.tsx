import Link from "next/link";
import { ArrowLeft, Calendar, Home, Stethoscope } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-linen flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-brand-charcoal/10">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold">
          404 Error
        </p>
        <h1 className="mt-2 text-3xl font-display font-medium text-brand-charcoal sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/70">
          The page you are looking for doesn&rsquo;t exist, was removed, or the link may be outdated.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-sm font-medium text-brand-charcoal hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Back to Homepage
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-brand-charcoal/15 bg-white px-4 py-2.5 text-sm font-medium text-brand-charcoal hover:bg-brand-linen/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            <Stethoscope className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            Explore Dental Treatments
          </Link>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-brand-charcoal/15 bg-white px-4 py-2.5 text-sm font-medium text-brand-charcoal hover:bg-brand-linen/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
          >
            <Calendar className="h-4 w-4 text-brand-gold" aria-hidden="true" />
            Book an Appointment
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-brand-charcoal/10 text-xs text-brand-charcoal/60">
          Need immediate assistance? Call us at{" "}
          <a
            href="tel:+918547085403"
            className="font-medium text-brand-charcoal underline hover:text-brand-gold"
          >
            +91 85470 85403
          </a>
        </div>
      </div>
    </div>
  );
}
