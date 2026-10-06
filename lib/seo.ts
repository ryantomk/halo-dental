import type { Metadata } from "next";

export const DEFAULT_SITE_URL = "https://halodental.in";

export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
  return url.replace(/\/+$/, "");
}

interface MetadataOptions {
  title: string;
  description: string;
  path: string; // e.g. "/" or "/services" or "/blog/clear-aligners-guide"
  locale?: string;
  image?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  path,
  locale = "en",
  image = "/og-image.jpg",
  noIndex = false,
}: MetadataOptions): Metadata {
  const baseUrl = getSiteUrl();

  // Normalize path
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const enUrl = `${baseUrl}${cleanPath === "/" ? "" : cleanPath}`;
  const mlUrl = `${baseUrl}/ml${cleanPath === "/" ? "" : cleanPath}`;
  const currentCanonical = locale === "ml" ? mlUrl : enUrl;

  const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`;

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: "%s | Halo Dental Angadipuram",
    },
    description,
    alternates: {
      canonical: currentCanonical,
      languages: {
        en: enUrl,
        ml: mlUrl,
        "x-default": enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: currentCanonical,
      siteName: "Halo Dental Cosmetic & Orthodontic Centre",
      locale: locale === "ml" ? "ml_IN" : "en_IN",
      alternateLocale: locale === "ml" ? ["en_IN"] : ["ml_IN"],
      type: "website",
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

/**
 * Verified Dentist / MedicalBusiness JSON-LD
 * Strictly uses verified clinic information from the database and clinic records.
 */
export function generateClinicJsonLd(locale = "en") {
  const baseUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": ["Dentist", "MedicalBusiness"],
    "@id": `${baseUrl}/#dentist`,
    name: "Halo Dental Cosmetic & Orthodontic Centre",
    legalName: "Halo Dental Cosmetic & Orthodontic Centre",
    alternateName: "Halo Dental Angadipuram",
    description:
      locale === "ml"
        ? "അങ്ങാടിപ്പുറം, മലപ്പുറത്ത് സ്ഥിതിചെയ്യുന്ന ഹാലോ ഡെന്റൽ ക്ലിനിക്ക്. ഡോ. ഹസീബിന്റെ നേതൃത്വത്തിൽ സ്മൈൽ മേക്കോവറുകൾ, ക്ലിയർ അലൈനറുകൾ, ഡെന്റൽ ഇംപ്ലാന്റുകൾ, റൂട്ട് കനാൽ ചികിത്സ എന്നിവ നൽകുന്നു."
        : "Doctor-led cosmetic and orthodontic dental clinic in Angadipuram, Malappuram, Kerala led by Chief Dental Surgeon Dr. Haseeb. Specialising in smile makeovers, clear aligners, dental implants, teeth whitening, and gentle restorative dentistry.",
    url: baseUrl,
    telephone: "+91 85470 85403",
    email: "info@halodental.in",
    priceRange: "₹₹",
    image: `${baseUrl}/images/hero-clinic.jpg`,
    logo: `${baseUrl}/images/halo-logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Near Soundharya Silks, Near Railway Station",
      addressLocality: "Angadipuram",
      addressRegion: "Kerala",
      postalCode: "679321",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "10.9822",
      longitude: "76.2163",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "09:00",
        closes: "20:00",
      },
    ],
    founder: {
      "@type": "Person",
      name: "Dr. Haseeb",
      jobTitle: "Chief Dental Surgeon & Specialist Orthodontist",
      alumniOf: "BDS, MDS (Orthodontics)",
    },
    employee: [
      {
        "@type": "Person",
        name: "Dr. Haseeb",
        jobTitle: "Chief Dental Surgeon",
        honorificPrefix: "Dr.",
      },
    ],
    availableLanguage: [
      {
        "@type": "Language",
        name: "English",
      },
      {
        "@type": "Language",
        name: "Malayalam",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Dental Treatments and Cosmetic Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Smile Makeovers",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Clear Aligners",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Dental Implants",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Root Canal Treatment",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Teeth Whitening",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Porcelain Veneers",
          },
        },
      ],
    },
  };
}

/**
 * Service Schema (JSON-LD) for Treatment Pages
 */
export function generateServiceJsonLd({
  name,
  description,
  slug,
  image,
  priceStartingAt,
  priceDisplay,
  category = "DentalCare",
}: {
  name: string;
  description: string;
  slug: string;
  image?: string | null;
  priceStartingAt?: number | null;
  priceDisplay?: string | null;
  category?: string;
}) {
  const baseUrl = getSiteUrl();
  const serviceUrl = `${baseUrl}/services/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: category,
    name,
    description,
    url: serviceUrl,
    provider: {
      "@type": ["Dentist", "MedicalBusiness"],
      name: "Halo Dental Cosmetic & Orthodontic Centre",
      url: baseUrl,
      telephone: "+91 85470 85403",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Near Soundharya Silks",
        addressLocality: "Angadipuram",
        addressRegion: "Kerala",
        postalCode: "679321",
        addressCountry: "IN",
      },
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Angadipuram, Malappuram, Kerala",
    },
    ...(image
      ? {
          image: image.startsWith("http") ? image : `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`,
        }
      : {}),
    ...(priceStartingAt || priceDisplay
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            ...(priceStartingAt ? { price: priceStartingAt } : {}),
            ...(priceDisplay ? { priceSpecification: { "@type": "UnitPriceSpecification", description: priceDisplay } } : {}),
          },
        }
      : {}),
  };
}

/**
 * BreadcrumbList Schema (JSON-LD)
 */
export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  const baseUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const fullUrl = item.url.startsWith("http") ? item.url : `${baseUrl}${item.url.startsWith("/") ? "" : "/"}${item.url}`;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: fullUrl,
      };
    }),
  };
}

/**
 * Article Schema (JSON-LD) for published blog articles
 */
export function generateArticleJsonLd({
  title,
  description,
  slug,
  datePublished,
  dateModified,
  authorName = "Dr. Haseeb",
  imageUrl,
}: {
  title: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified?: string | null;
  authorName?: string;
  imageUrl?: string | null;
}) {
  const baseUrl = getSiteUrl();
  const articleUrl = `${baseUrl}/blog/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: articleUrl,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      jobTitle: "Chief Dental Surgeon",
    },
    publisher: {
      "@type": "Organization",
      name: "Halo Dental Cosmetic & Orthodontic Centre",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/halo-logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    ...(imageUrl
      ? {
          image: imageUrl.startsWith("http") ? imageUrl : `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`,
        }
      : {}),
  };
}

/**
 * FAQPage Schema (JSON-LD)
 */
export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
