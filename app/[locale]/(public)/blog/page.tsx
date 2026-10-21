import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles, User } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { defaultLocale } from "@/lib/i18n";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

interface BlogPost {
  id: string;
  slug: string;
  title_en: string;
  title_ml: string | null;
  category: string;
  excerpt_en: string | null;
  excerpt_ml: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  created_at: string;
}

async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { data } = await supabase
    .from("blog_posts")
    .select("id, slug, title_en, title_ml, category, excerpt_en, excerpt_ml, cover_image_url, published_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (data as BlogPost[]) || [];
}

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  return constructMetadata({
    title:
      locale === "ml"
        ? "ദന്താരോഗ്യ ബ്ലോഗ് & ലേഖനങ്ങൾ | ഹാലോ ഡെന്റൽ അങ്ങാടിപ്പുറം"
        : "Dental Health Articles & Patient Guides | Halo Dental Angadipuram",
    description:
      locale === "ml"
        ? "ഡോ. ഹസീബിന്റെ ആധികാരിക ദന്താരോഗ്യ ലേഖനങ്ങൾ, സ്മൈൽ കെയർ ടിപ്പുകൾ, ഓർത്തോഡോണ്ടിക് മാർഗ്ഗനിർദ്ദേശങ്ങൾ എന്നിവ വായിക്കാം."
        : "Evidence-based dental health guides, treatment advice, and oral hygiene tips from Chief Dental Surgeon Dr. Haseeb at Halo Dental in Angadipuram, Malappuram.",
    path: "/blog",
    locale,
  });
}

export default async function BlogIndexPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);

  const posts = await getPublishedPosts();
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  const isMl = locale === "ml";

  const breadcrumbs = [
    { name: isMl ? "ഹോം" : "Home", url: prefix || "/" },
    { name: isMl ? "ബ്ലോഗ്" : "Blog", url: `${prefix}/blog` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <main className="bg-brand-linen min-h-screen">
      {/* Hero */}
      <section className="bg-brand-midnight text-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href={prefix || "/"} className="hover:text-white transition-colors">
                  {isMl ? "ഹോം" : "Home"}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white font-medium">
                {isMl ? "ബ്ലോഗ്" : "Blog"}
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-gold">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              {isMl ? "രോഗീ വിദ്യാഭ്യാസം" : "Patient Education & Guides"}
            </span>
            <h1 className="mt-4 font-display text-3xl font-medium sm:text-5xl text-white">
              {isMl
                ? "ദന്താരോഗ്യ ബ്ലോഗ് & വിവരങ്ങൾ"
                : "Dental Health & Treatment Guides"}
            </h1>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/80">
              {isMl
                ? "വായയുടെ ശുചിത്വം, സ്മൈൽ കെയർ, ഓർത്തോഡോണ്ടിക്സ് എന്നിവയെക്കുറിച്ചുള്ള ആധികാരിക ലേഖനങ്ങൾ."
                : "Insights, recovery advice, and comprehensive guides curated by Chief Dental Surgeon Dr. Haseeb to help you make informed decisions about your oral health."}
            </p>
          </div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto rounded-2xl bg-white p-8 border border-brand-charcoal/10 shadow-sm">
                <BookOpen className="h-10 w-10 text-brand-gold mx-auto mb-4" aria-hidden="true" />
                <h2 className="font-display text-xl font-semibold text-brand-charcoal">
                  {isMl ? "ലേഖനങ്ങൾ ഉടൻ ലഭ്യമാകും" : "Articles In Editorial Review"}
                </h2>
                <p className="mt-2 text-sm text-brand-charcoal/70 leading-relaxed">
                  {isMl
                    ? "പുതിയ ദന്താരോഗ്യ ലേഖനങ്ങൾ ഉടൻ പ്രസിദ്ധീകരിക്കുന്നതാണ്. സംശയങ്ങൾക്ക് ക്ലിനിക്കിൽ ബന്ധപ്പെടാം."
                    : "Dr. Haseeb and the editorial team publish regular patient guides. Check back shortly or book an in-person consultation."}
                </p>
                <div className="mt-6 flex justify-center">
                  <Link
                    href={`${prefix}/booking`}
                    className="inline-flex items-center gap-2 rounded-md bg-brand-gold px-4 py-2 text-sm font-semibold text-brand-charcoal hover:bg-brand-gold/90 transition-colors"
                  >
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                    {isMl ? "അപ്പോയിന്റ്മെന്റ് ബുക്ക് ചെയ്യുക" : "Book Consultation"}
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const title = isMl && post.title_ml ? post.title_ml : post.title_en;
                const excerpt = isMl && post.excerpt_ml ? post.excerpt_ml : post.excerpt_en;
                const date = post.published_at ? new Date(post.published_at).toLocaleDateString(locale === "ml" ? "ml-IN" : "en-IN", { month: "short", day: "numeric", year: "numeric" }) : "";

                return (
                  <article
                    key={post.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-brand-charcoal/10 bg-white shadow-sm transition-all hover:shadow-md"
                  >
                    {post.cover_image_url && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-charcoal/10">
                        <Image
                          src={post.cover_image_url}
                          alt={title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between text-xs text-brand-charcoal/60 mb-3">
                        <span className="rounded-full bg-brand-linen px-2.5 py-0.5 font-medium text-brand-gold">
                          {post.category || (isMl ? "ദന്താരോഗ്യം" : "Dental Health")}
                        </span>
                        {date && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            {date}
                          </span>
                        )}
                      </div>

                      <h2 className="font-display text-xl font-semibold text-brand-charcoal hover:text-brand-gold transition-colors">
                        <Link href={`${prefix}/blog/${post.slug}`}>
                          {title}
                        </Link>
                      </h2>

                      {excerpt && (
                        <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70 flex-1 line-clamp-3">
                          {excerpt}
                        </p>
                      )}

                      <div className="mt-6 pt-4 border-t border-brand-charcoal/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-medium text-brand-charcoal/80">
                          <User className="h-3.5 w-3.5 text-brand-gold" aria-hidden="true" />
                          <span>Dr. Haseeb</span>
                        </div>

                        <Link
                          href={`${prefix}/blog/${post.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-gold hover:text-brand-charcoal transition-colors"
                        >
                          {isMl ? "വായിക്കുക" : "Read guide"}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
