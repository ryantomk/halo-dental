import { requireAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import BlogClient, { type BlogPostRecord } from "@/components/admin/BlogClient";

export const metadata = {
  title: "Blog Management | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdminSession();
  const adminClient = createAdminClient();

  const [postsRes, doctorsRes] = await Promise.all([
    adminClient
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false }),
    adminClient
      .from("doctors")
      .select("id, name, title, specialization")
      .eq("is_active", true)
      .order("display_order", { ascending: true }),
  ]);

  return (
    <BlogClient
      initialPosts={(postsRes.data as unknown as BlogPostRecord[]) || []}
      doctors={doctorsRes.data || []}
    />
  );
}
