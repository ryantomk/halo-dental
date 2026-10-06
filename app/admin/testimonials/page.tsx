import { requireAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import TestimonialsClient, { type TestimonialRecord } from "@/components/admin/TestimonialsClient";

export const metadata = {
  title: "Testimonial Moderation | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminTestimonialsPage() {
  await requireAdminSession();
  const adminClient = createAdminClient();

  const [testimonialsRes, servicesRes] = await Promise.all([
    adminClient
      .from("testimonials")
      .select("*, services(name_en)")
      .order("created_at", { ascending: false }),
    adminClient
      .from("services")
      .select("id, name_en")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <TestimonialsClient
      initialTestimonials={(testimonialsRes.data as unknown as TestimonialRecord[]) || []}
      services={servicesRes.data || []}
    />
  );
}
