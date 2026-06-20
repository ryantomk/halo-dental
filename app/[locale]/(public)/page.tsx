import type { Metadata } from "next";
import Hero from "@/components/marketing/Hero";

export const metadata: Metadata = {
  title: "Halo Dental Cosmetic & Orthodontic Centre",
};

export default function Page() {
  return (
    <main>
      <Hero />
    </main>
  );
}