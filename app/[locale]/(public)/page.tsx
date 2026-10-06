import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import Hero from "@/components/marketing/Hero";
import TrustStrip from "@/components/marketing/TrustStrip";
import AboutSection from "@/components/marketing/AboutSection";
import ServiceGrid from "@/components/marketing/ServiceGrid";
import WhyChooseSection from "@/components/marketing/WhyChooseSection";
import BeforeAfterSection from "@/components/marketing/BeforeAfterSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import FAQSection from "@/components/marketing/FAQSection";
import FinalCtaSection from "@/components/marketing/FinalCtaSection";

import { constructMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return constructMetadata({
    title:
      locale === "ml"
        ? "ഹാലോ ഡെന്റൽ ക്ലിനിക്ക് | കോസ്മെറ്റിക് & ഓർത്തോഡോണ്ടിക് സെന്റർ, അങ്ങാടിപ്പുറം"
        : "Halo Dental Cosmetic & Orthodontic Centre | Angadipuram, Malappuram",
    description:
      locale === "ml"
        ? "അങ്ങാടിപ്പുറം റെയിൽവേ സ്റ്റേഷന് സമീപം ഡോ. ഹസീബിന്റെ നേതൃത്വത്തിൽ സ്മൈൽ മേക്കോവറുകൾ, ക്ലിയർ അലൈനറുകൾ, ഇംപ്ലാന്റുകൾ, വേദനയില്ലാത്ത റൂട്ട് കനാൽ ചികിത്സ എന്നിവ."
        : "Leading cosmetic and orthodontic dental clinic in Angadipuram, Malappuram led by Dr. Haseeb. Specialising in smile makeovers, clear aligners, dental implants, teeth whitening, and gentle family dental care.",
    path: "/",
    locale,
  });
}

export default function Page({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  return (
    <>
      {/* 1. Hero */}
      <Hero locale={locale} />

      {/* 2. Trust Strip */}
      <TrustStrip />

      {/* 3. About / Clinic Introduction */}
      <AboutSection locale={locale} />

      {/* 4. Services Grid (11 Treatments) */}
      <ServiceGrid locale={locale} />

      {/* 5. Why Choose Halo Dental */}
      <WhyChooseSection locale={locale} />

      {/* 6. Before / After Treatment Showcase */}
      <BeforeAfterSection locale={locale} />

      {/* 7. Patient Testimonials Carousel */}
      <TestimonialsSection />

      {/* 8. Frequently Asked Questions */}
      <FAQSection />

      {/* 9. Final Booking CTA */}
      <FinalCtaSection locale={locale} />
    </>
  );
}