import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingWhatsAppButton from "@/components/marketing/FloatingWhatsAppButton";
import FloatingBookingWidget from "@/components/booking/FloatingBookingWidget";

export default function PublicLayout({
  children,
  params,
}: {
  children: ReactNode;
  params?: { locale?: string };
}) {
  if (params?.locale) {
    setRequestLocale(params.locale);
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-brand-gold focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-charcoal focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
      >
        Skip to main content
      </a>
      <Header />
      <div className="flex min-h-screen flex-col">
        <main id="main-content" className="flex-1">
          {children}
        </main>
      </div>
      <Footer />
      <FloatingWhatsAppButton />
      <FloatingBookingWidget />
    </>
  );
}
