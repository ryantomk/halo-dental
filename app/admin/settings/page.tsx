import { requireRole } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import SettingsClient from "@/components/admin/SettingsClient";

export const metadata = {
  title: "Clinic Settings | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await requireRole(["admin"]);
  const adminClient = createAdminClient();

  const clinicId = session.staffUser.clinic_id || "22c7e5ce-340d-4c33-a83f-dda41af69843";

  const { data: clinic } = await adminClient
    .from("clinics")
    .select("id, name, phone, whatsapp, email, address_line1, address_line2, opening_hours")
    .eq("id", clinicId)
    .single();

  const defaultClinic = {
    id: clinicId,
    name: "Halo Dental Cosmetic & Orthodontic Centre",
    phone: "+91 85470 85403",
    whatsapp: "+91 85470 85403",
    email: "info@halodental.in",
    address_line1: "Opp. Govt Polytechnic College, Valanchery Road",
    address_line2: "Angadipuram, Perinthalmanna, Malappuram, Kerala 679321",
    opening_hours: {
      mon_sat: "09:00 - 20:00",
      sun: "Closed",
    },
  };

  return <SettingsClient clinic={(clinic as any) || defaultClinic} />;
}
