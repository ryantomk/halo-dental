import type { Metadata } from "next";

// TODO: Build the service landing page template (hero, overview, benefits,
// process steps, filtered before/after gallery, pricing block, related
// services, service-specific FAQ, sticky booking CTA) — technical spec
// Section 4. One of: cosmetic-dentistry, smile-makeovers, teeth-whitening,
// veneers, orthodontics, clear-aligners, metal-braces, dental-implants,
// root-canal-treatment, general-dentistry, digital-xrays.

export async function generateStaticParams() {
  // TODO: return [{ slug: "cosmetic-dentistry" }, ...] from the `services`
  // table once Supabase is connected (SSG per technical spec Section 9).
  return [];
}

export const metadata: Metadata = {
  title: "Halo Dental Cosmetic & Orthodontic Centre",
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main>
      {/* Scaffolded in Phase 1 — service slug: {slug} */}
    </main>
  );
}
