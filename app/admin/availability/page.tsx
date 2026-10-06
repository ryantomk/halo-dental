import { requireAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import AvailabilityClient from "@/components/admin/AvailabilityClient";
import type { AppointmentRecord } from "@/components/admin/BookingDetailModal";
import type { AvailabilityBlock } from "@/lib/booking/availability";

export const metadata = {
  title: "Availability & Schedule | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  await requireAdminSession();
  const adminClient = createAdminClient();

  const today = new Date().toISOString().slice(0, 10);

  // 1. Fetch appointments around today
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 3);
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 30);

  const { data: rawAppointments } = await adminClient
    .from("appointments")
    .select(
      `id, reference_code, appointment_date, appointment_time, duration_minutes, status, source, patient_notes, admin_notes, created_at,
       patient:patients(id, full_name, phone, email),
       service:services(id, name_en, name_ml, category),
       doctor:doctors(id, name, specialization)`
    )
    .gte("appointment_date", pastDate.toISOString().slice(0, 10))
    .lte("appointment_date", futureDate.toISOString().slice(0, 10))
    .neq("status", "cancelled");

  // 2. Fetch all availability blocks
  let allBlocks: AvailabilityBlock[] = [];
  const { data: rawBlocks, error: blockErr } = await adminClient
    .from("availability_blocks" as any)
    .select("*")
    .order("block_date", { ascending: true });

  if (!blockErr && Array.isArray(rawBlocks)) {
    allBlocks = rawBlocks as unknown as AvailabilityBlock[];
  } else {
    // Fallback to site_settings store
    const { data: settingData } = await adminClient
      .from("site_settings")
      .select("value")
      .eq("key", "availability_blocks")
      .maybeSingle();

    if (settingData && Array.isArray(settingData.value)) {
      allBlocks = settingData.value as unknown as AvailabilityBlock[];
    }
  }

  // 3. Preload doctors
  const { data: doctors } = await adminClient
    .from("doctors")
    .select("id, name")
    .eq("is_active", true);

  return (
    <AvailabilityClient
      initialDate={today}
      appointments={(rawAppointments as unknown as AppointmentRecord[]) || []}
      allBlocks={allBlocks}
      doctors={doctors || []}
    />
  );
}
