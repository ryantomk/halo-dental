import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ShieldCheck } from "lucide-react";
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
        ? "സ്വകാര്യതാ നയം | ഹാലോ ഡെന്റൽ അങ്ങാടിപ്പുറം"
        : "Privacy Policy | Halo Dental Angadipuram",
    description:
      locale === "ml"
        ? "രോഗികളുടെ വ്യക്തിവിവരങ്ങളുടെയും ദന്താരോഗ്യ രേഖകളുടെയും സുരക്ഷിതത്വം ഉറപ്പാക്കുന്ന ഹാലോ ഡെന്റലിന്റെ സ്വകാര്യതാ നയം."
        : "Patient data protection and privacy policy for Halo Dental Cosmetic & Orthodontic Centre in Angadipuram, Kerala, compliant with Indian medical confidentiality and DPDPA standards.",
    path: "/privacy-policy",
    locale,
  });
}

export default function PrivacyPolicyPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const isMl = locale === "ml";

  const breadcrumbs = [
    { name: isMl ? "ഹോം" : "Home", url: prefix || "/" },
    { name: isMl ? "സ്വകാര്യതാ നയം" : "Privacy Policy", url: `${prefix}/privacy-policy` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <main className="bg-brand-linen min-h-screen py-16 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-brand-charcoal/60">
            <li>
              <Link href={prefix || "/"} className="hover:text-brand-gold transition-colors">
                {isMl ? "ഹോം" : "Home"}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-brand-charcoal font-medium">
              {isMl ? "സ്വകാര്യതാ നയം" : "Privacy Policy"}
            </li>
          </ol>
        </nav>

        <div className="rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-gold">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {isMl ? "രോഗീവിവര സംരക്ഷണം" : "Patient Data Privacy"}
          </div>

          <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-brand-charcoal sm:text-4xl">
            {isMl ? "സ്വകാര്യതാ നയം (Privacy Policy)" : "Privacy Policy & Patient Data Protection"}
          </h1>

          <p className="mt-3 text-xs text-brand-charcoal/60">
            {isMl ? "അവസാനം പുതുക്കിയത്: ഒക്ടോബർ 2026" : "Last Updated: October 2026"}
          </p>

          <div className="mt-8 space-y-6 text-sm text-brand-charcoal/80 leading-relaxed border-t border-brand-charcoal/10 pt-6">
            <section>
              <h2 className="font-display text-lg font-semibold text-brand-charcoal mb-2">
                1. Overview & Data Controller
              </h2>
              <p>
                Halo Dental Cosmetic & Orthodontic Centre (&ldquo;Halo Dental&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), located in Angadipuram, Malappuram, Kerala, is committed to safeguarding the privacy and confidentiality of our patients and website visitors. This policy outlines how we collect, handle, and protect your personal information in accordance with the Digital Personal Data Protection Act (DPDPA 2023) and applicable Indian healthcare ethics standards.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-brand-charcoal mb-2">
                2. Information We Collect
              </h2>
              <p>
                When you schedule a consultation online or contact our reception, we collect only information necessary to coordinate your appointment and provide clinical care:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Patient full name and contact telephone number</li>
                <li>Preferred appointment date and requested dental treatment category</li>
                <li>Optional notes or symptoms provided during appointment booking</li>
                <li>Clinical and diagnostic records created during in-person examinations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-brand-charcoal mb-2">
                3. How We Use Your Information
              </h2>
              <p>
                Your personal and clinical data is used strictly for legitimate healthcare and administrative purposes:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Scheduling and confirming dental consultations</li>
                <li>Sending SMS or WhatsApp appointment reminders</li>
                <li>Maintaining doctor-patient clinical continuity</li>
                <li>Complying with statutory medical record-keeping requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-brand-charcoal mb-2">
                4. Data Security & Storage
              </h2>
              <p>
                All electronic patient records and appointment schedules are secured using industry-standard encryption, Row Level Security (RLS) database policies, and multi-factor access protocols. Access to clinical records is restricted to authorized dental healthcare personnel.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-brand-charcoal mb-2">
                5. Third-Party Sharing & Marketing
              </h2>
              <p>
                We do not sell, rent, or trade your personal information to third-party advertisers or commercial brokers. We do not engage in unauthorized third-party marketing.
              </p>
            </section>

            <section>
              <h2 className="font-display text-lg font-semibold text-brand-charcoal mb-2">
                6. Patient Rights & Contact
              </h2>
              <p>
                Under DPDPA, you have the right to request access to your personal information, request corrections, or enquire about record retention. If you have any privacy concerns or wish to update your details, please contact:
              </p>
              <div className="mt-3 p-4 rounded-xl bg-brand-linen/40 border border-brand-charcoal/10 text-xs space-y-1">
                <p className="font-semibold text-brand-charcoal">Halo Dental Cosmetic & Orthodontic Centre</p>
                <p>Near Soundharya Silks, Near Railway Station, Angadipuram, Malappuram, Kerala 679321</p>
                <p>Email: <a href="mailto:info@halodental.in" className="text-brand-gold underline">info@halodental.in</a></p>
                <p>Phone: <a href="tel:+918547085403" className="text-brand-gold underline">+91 85470 85403</a></p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
