import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import BookingForm from "@/components/booking/BookingForm";
import { getActiveServices } from "@/app/actions/booking";

import { defaultLocale } from "@/lib/i18n";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return constructMetadata({
    title:
      locale === "ml"
        ? "അപ്പോയിന്റ്മെന്റ് ബുക്കിംഗ് | ഹാലോ ഡെന്റൽ അങ്ങാടിപ്പുറം"
        : "Book an Appointment | Halo Dental Angadipuram",
    description:
      locale === "ml"
        ? "അങ്ങാടിപ്പുറത്തെ ഹാലോ ഡെന്റലിൽ ഡോ. ഹസീബുമായി കൺസൾട്ടേഷൻ ഓൺലൈനായി ബുക്ക് ചെയ്യാം. ലൈവ് സ്ലോട്ടുകൾ ലഭ്യമാണ്."
        : "Schedule your dental consultation online with Dr. Haseeb at Halo Dental Cosmetic & Orthodontic Centre in Angadipuram. Real-time availability.",
    path: "/booking",
    locale,
  });
}

export default async function BookingPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  // Server-side retrieval of active services from Supabase
  const servicesResult = await getActiveServices(locale);
  const initialServices = servicesResult.success ? servicesResult.services : [];
  const t = await getTranslations("booking");

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-charcoal/10 bg-brand-linen/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
          {t("pageBadge")}
        </span>
        <h1 className="mt-3 text-3xl font-display font-medium text-brand-charcoal sm:text-4xl">
          {t("pageHeading")}
        </h1>
        <p className="mt-3 text-base text-brand-charcoal/70 max-w-xl mx-auto">
          {t("pageDescription")}
        </p>
      </div>

      <BookingForm initialServices={initialServices} locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd([
              { name: locale === "ml" ? "ഹോം" : "Home", url: locale === defaultLocale ? "/" : `/${locale}` },
              { name: locale === "ml" ? "ബുക്കിംഗ്" : "Booking", url: locale === defaultLocale ? "/booking" : `/${locale}/booking` },
            ])
          ),
        }}
      />
    </div>
  );
}
