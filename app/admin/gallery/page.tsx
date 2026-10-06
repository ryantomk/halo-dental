import { requireAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import GalleryClient, { type GalleryItemRecord } from "@/components/admin/GalleryClient";

export const metadata = {
  title: "Gallery Management | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  await requireAdminSession();
  const adminClient = createAdminClient();

  const [itemsRes, servicesRes] = await Promise.all([
    adminClient
      .from("gallery_items")
      .select("*, services(name_en)")
      .order("display_order", { ascending: true }),
    adminClient
      .from("services")
      .select("id, name_en")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  return (
    <GalleryClient
      initialGalleryItems={(itemsRes.data as unknown as GalleryItemRecord[]) || []}
      services={servicesRes.data || []}
    />
  );
}
