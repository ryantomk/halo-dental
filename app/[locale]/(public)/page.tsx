import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Hero from "@/components/marketing/Hero";
import ServiceGrid from "@/components/marketing/ServiceGrid";
import AboutSection from "@/components/marketing/AboutSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import GallerySection from "@/components/marketing/GallerySection";
import FAQSection from "@/components/marketing/FAQSection";
import Footer from "@/components/layout/Footer";  

export const metadata: Metadata = {
  title: "Halo Dental Cosmetic & Orthodontic Centre",
};

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServiceGrid />
        <AboutSection />
        <TestimonialsSection />
        <GallerySection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
}