import { requireAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import ServicesClient from "@/components/admin/ServicesClient";
import type { ServiceData } from "@/components/admin/ServiceEditorModal";

export const metadata = {
  title: "Clinical Services Management | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  await requireAdminSession();
  const adminClient = createAdminClient();

  const { data: services } = await adminClient
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });

  return <ServicesClient initialServices={(services as unknown as ServiceData[]) || []} />;
}
