import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  // Core static public routes present in both English and Malayalam
  const staticRoutes = [
    { path: "", changeFrequency: "weekly" as const, priority: 1.0 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/services", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/services/smile-makeovers", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/services/clear-aligners", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/services/dental-implants", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/services/root-canal-treatment", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/services/teeth-whitening", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/services/general-dentistry", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/services/veneers", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/gallery", changeFrequency: "weekly" as const, priority: 0.8 },
    { path: "/blog", changeFrequency: "daily" as const, priority: 0.8 },
    { path: "/booking", changeFrequency: "monthly" as const, priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/faq", changeFrequency: "monthly" as const, priority: 0.7 },
    { path: "/privacy-policy", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Add static routes in English and Malayalam
  for (const route of staticRoutes) {
    // English
    sitemapEntries.push({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });

    // Malayalam
    sitemapEntries.push({
      url: `${baseUrl}/ml${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority * 0.9,
    });
  }

  // Fetch dynamic active services & published blog posts
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      // 1. Dynamic active services
      const { data: services } = await supabase
        .from("services")
        .select("slug, updated_at")
        .eq("is_active", true);

      if (services) {
        // Exclude slugs that were already added via static routes above
        const staticServiceSlugs = new Set([
          "smile-makeovers",
          "clear-aligners",
          "dental-implants",
          "root-canal-treatment",
          "teeth-whitening",
          "general-dentistry",
          "veneers",
        ]);

        for (const svc of services) {
          if (!staticServiceSlugs.has(svc.slug)) {
            const lastMod = svc.updated_at ? new Date(svc.updated_at) : now;
            sitemapEntries.push({
              url: `${baseUrl}/services/${svc.slug}`,
              lastModified: lastMod,
              changeFrequency: "monthly",
              priority: 0.8,
            });
            sitemapEntries.push({
              url: `${baseUrl}/ml/services/${svc.slug}`,
              lastModified: lastMod,
              changeFrequency: "monthly",
              priority: 0.7,
            });
          }
        }
      }

      // 2. Published blog posts
      const { data: posts } = await supabase
        .from("blog_posts")
        .select("slug, updated_at, published_at")
        .eq("status", "published");

      if (posts) {
        for (const post of posts) {
          const lastMod = post.updated_at
            ? new Date(post.updated_at)
            : post.published_at
            ? new Date(post.published_at)
            : now;

          sitemapEntries.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: lastMod,
            changeFrequency: "weekly",
            priority: 0.7,
          });
          sitemapEntries.push({
            url: `${baseUrl}/ml/blog/${post.slug}`,
            lastModified: lastMod,
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
    }
  } catch (err) {
    console.error("Error generating dynamic sitemap from database:", err);
  }

  return sitemapEntries;
}
