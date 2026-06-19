import type { Metadata } from "next";

// TODO: Build the blog post template (cover image, rich content, related
// posts, CTA block) — technical spec Section 4.

export async function generateStaticParams() {
  // TODO: return published blog_posts slugs per locale.
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
      {/* Scaffolded in Phase 1 — post slug: {slug} */}
    </main>
  );
}
