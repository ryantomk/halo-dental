import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Hero from "@/components/marketing/Hero";
import ServiceGrid from "@/components/marketing/ServiceGrid";
import AboutSection from "@/components/marketing/AboutSection";

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
      </main>
    </>
  );
}