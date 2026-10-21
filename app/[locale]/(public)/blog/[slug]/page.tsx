import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Calendar, Clock, MessageCircle, Phone, Share2, Sparkles, User } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { defaultLocale } from "@/lib/i18n";
import { constructMetadata, generateArticleJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

interface BlogPostDetail {
  id: string;
  slug: string;
  title_en: string;
  title_ml: string | null;
  category: string;
  excerpt_en: string | null;
  excerpt_ml: string | null;
  content_en: string;
  content_ml: string | null;
  cover_image_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
}

async function getPost(slug: string): Promise<BlogPostDetail | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  return (data as BlogPostDetail) || null;
}

export async function generateStaticParams() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { data } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("status", "published");

  if (!data) return [];
  return data.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  const post = await getPost(slug);

  if (!post) {
    return constructMetadata({
      title: "Article Not Found",
      description: "The requested dental health article could not be found.",
      path: `/blog/${slug}`,
      locale,
      noIndex: true,
    });
  }

  const title = (locale === "ml" && post.title_ml) ? post.title_ml : post.title_en;
  const description =
    (locale === "ml" && post.excerpt_ml)
      ? post.excerpt_ml
      : post.excerpt_en || title;

  return constructMetadata({
    title: `${title} | Halo Dental Angadipuram`,
    description,
    path: `/blog/${slug}`,
    locale,
    image: post.cover_image_url || undefined,
  });
}

const PHONE_TEL = "tel:+918547085403";
const WHATSAPP_URL =
  "https://wa.me/918547085403?text=" +
  encodeURIComponent("Hi, I read your dental article and would like to consult Dr. Haseeb.");

export default async function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);

  const post = await getPost(slug);
  if (!post) {
    notFound();
  }

  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const isMl = locale === "ml";

  const title = isMl && post.title_ml ? post.title_ml : post.title_en;
  const content = isMl && post.content_ml ? post.content_ml : post.content_en;
  const excerpt = isMl && post.excerpt_ml ? post.excerpt_ml : post.excerpt_en;
  const dateFormatted = post.published_at
    ? new Date(post.published_at).toLocaleDateString(locale === "ml" ? "ml-IN" : "en-IN", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  const breadcrumbs = [
    { name: isMl ? "ഹോം" : "Home", url: prefix || "/" },
    { name: isMl ? "ബ്ലോഗ്" : "Blog", url: `${prefix}/blog` },
    { name: title, url: `${prefix}/blog/${slug}` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  const articleJsonLd = generateArticleJsonLd({
    title,
    description: excerpt || title,
    slug,
    datePublished: post.published_at || post.created_at,
    dateModified: post.updated_at || post.published_at,
    authorName: "Dr. Haseeb",
    imageUrl: post.cover_image_url,
  });

  return (
    <main className="bg-brand-linen min-h-screen py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-brand-charcoal/60">
            <li>
              <Link href={prefix || "/"} className="hover:text-brand-gold transition-colors">
                {isMl ? "ഹോം" : "Home"}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`${prefix}/blog`} className="hover:text-brand-gold transition-colors">
                {isMl ? "ബ്ലോഗ്" : "Blog"}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-brand-charcoal font-medium truncate max-w-xs">
              {title}
            </li>
          </ol>
        </nav>

        {/* Article Container */}
        <article className="overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-wrap items-center gap-3 text-xs text-brand-charcoal/60">
            <span className="rounded-full bg-brand-linen px-3 py-1 font-semibold uppercase tracking-wider text-brand-gold">
              {post.category || (isMl ? "ദന്താരോഗ്യം" : "Dental Health")}
            </span>
            {dateFormatted && (
              <span className="flex items-center gap-1 font-medium">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                {dateFormatted}
              </span>
            )}
          </div>

          <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-brand-charcoal sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          {/* Author Badge */}
          <div className="mt-6 flex items-center gap-3 border-y border-brand-charcoal/10 py-4">
            <div className="h-10 w-10 rounded-full bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center text-brand-gold font-display font-bold">
              DH
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-charcoal">Dr. Haseeb</p>
              <p className="text-xs text-brand-charcoal/60">
                {isMl ? "ചീഫ് ഡെന്റൽ സർജൻ & സ്പെഷ്യലിസ്റ്റ് ഓർത്തോഡോണ്ടിസ്റ്റ് (BDS, MDS)" : "Chief Dental Surgeon & Specialist Orthodontist (BDS, MDS)"}
              </p>
            </div>
          </div>

          {/* Cover Image */}
          {post.cover_image_url && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-brand-charcoal/10">
              <Image
                src={post.cover_image_url}
                alt={title}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          )}

          {/* Content Body */}
          <div className="prose prose-brand max-w-none mt-8 text-brand-charcoal/85 leading-relaxed text-base space-y-5">
            {content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="font-display text-2xl font-semibold text-brand-charcoal pt-4">
                    {paragraph.replace("## ", "")}
                  </h2>
                );
              }
              if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="font-display text-xl font-semibold text-brand-charcoal pt-2">
                    {paragraph.replace("### ", "")}
                  </h3>
                );
              }
              return (
                <p key={index} className="text-base sm:text-[17px] leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Doctor Bio Card */}
          <div className="mt-12 rounded-xl bg-brand-linen/40 p-6 border border-brand-charcoal/10">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="h-16 w-16 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold flex-shrink-0 font-display font-bold text-xl">
                DH
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-semibold text-brand-gold">
                  {isMl ? "ലേഖകൻ" : "Written & Reviewed by"}
                </p>
                <h3 className="font-display text-lg font-bold text-brand-charcoal mt-0.5">
                  Dr. Haseeb
                </h3>
                <p className="text-xs text-brand-charcoal/70 mt-1 leading-relaxed">
                  {isMl
                    ? "അങ്ങാടിപ്പുറത്തെ ഹാലോ ഡെന്റൽ ക്ലിനിക്കിൽ ഓർത്തോഡോണ്ടിക്സ്, കോസ്മെറ്റിക് സ്മൈൽ മേക്കോവർ എന്നിവയിൽ വിദഗ്ദ്ധ സേവനം നൽകുന്നു."
                    : "Chief Dental Surgeon at Halo Dental Cosmetic & Orthodontic Centre in Angadipuram, Kerala. Specializing in clear aligners, aesthetic makeovers, and minimally invasive dentistry."}
                </p>
              </div>
            </div>
          </div>

          {/* Next Step CTA */}
          <div className="mt-8 rounded-xl bg-brand-midnight p-6 sm:p-8 text-center text-white">
            <h3 className="font-display text-xl font-semibold sm:text-2xl">
              {isMl ? "സംശയങ്ങളുണ്ടോ? ഡോക്ടറുമായി സംസാരിക്കാം" : "Have Questions About This Treatment?"}
            </h3>
            <p className="mt-2 text-sm text-white/75 max-w-lg mx-auto">
              {isMl
                ? "നിങ്ങളുടെ വ്യക്തിഗത ദന്തരോഗ സംശയങ്ങൾക്ക് ക്ലിനിക്കിൽ നേരിട്ട് കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക."
                : "Schedule an in-person consultation with Dr. Haseeb at Halo Dental in Angadipuram for personalized clinical advice."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={`${prefix}/booking`}
                className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2.5 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                {isMl ? "കൺസൾട്ടേഷൻ ബുക്ക് ചെയ്യുക" : "Book Consultation"}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#20ba5c] transition-colors"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8 pt-6 border-t border-brand-charcoal/10 flex justify-between items-center text-xs text-brand-charcoal/60">
            <Link
              href={`${prefix}/blog`}
              className="inline-flex items-center gap-1 font-semibold text-brand-charcoal hover:text-brand-gold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {isMl ? "എല്ലാ ലേഖനങ്ങളും കാണുക" : "Back to all articles"}
            </Link>
          </div>
        </article>
      </div>

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </main>
  );
}
