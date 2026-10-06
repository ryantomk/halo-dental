import { requireAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import CalendarClient from "@/components/admin/CalendarClient";
import type { AppointmentRecord } from "@/components/admin/BookingDetailModal";
import type { AvailabilityBlock } from "@/lib/booking/availability";

export const metadata = {
  title: "Clinical Calendar | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  await requireAdminSession();
  const adminClient = createAdminClient();

  const today = new Date().toISOString().slice(0, 10);

  // 1. Fetch appointments for the current period (from 7 days ago to 30 days ahead)
  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 7);
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
    .neq("status", "cancelled")
    .order("appointment_time", { ascending: true });

  // 2. Fetch active availability blocks
  let blocks: AvailabilityBlock[] = [];
  const { data: rawBlocks, error: blockErr } = await adminClient
    .from("availability_blocks" as any)
    .select("*")
    .gte("block_date", pastDate.toISOString().slice(0, 10));

  if (!blockErr && Array.isArray(rawBlocks)) {
    blocks = rawBlocks as unknown as AvailabilityBlock[];
  } else {
    // Fallback to site_settings store
    const { data: settingData } = await adminClient
      .from("site_settings")
      .select("value")
      .eq("key", "availability_blocks")
      .maybeSingle();

    if (settingData && Array.isArray(settingData.value)) {
      blocks = settingData.value as unknown as AvailabilityBlock[];
    }
  }

  // 3. Preload services, patients, doctors
  const [{ data: services }, { data: patients }, { data: doctors }] = await Promise.all([
    adminClient
      .from("services")
      .select("id, name_en, category, duration_minutes")
      .eq("is_active", true)
      .order("sort_order"),
    adminClient
      .from("patients")
      .select("id, full_name, phone, email")
      .order("full_name"),
    adminClient
      .from("doctors")
      .select("id, name, specialization")
      .eq("is_active", true),
  ]);

  const serviceOptions = (services || []).map((s) => ({
    id: s.id,
    name: s.name_en,
    category: s.category,
    durationMinutes: s.duration_minutes,
  }));

  return (
    <CalendarClient
      initialDate={today}
      appointments={(rawAppointments as unknown as AppointmentRecord[]) || []}
      availabilityBlocks={blocks}
      services={serviceOptions}
      patients={patients || []}
      doctors={doctors || []}
    />
  );
}
