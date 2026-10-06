import { requireAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import BookingsClient from "@/components/admin/BookingsClient";
import type { AppointmentRecord } from "@/components/admin/BookingDetailModal";

export const metadata = {
  title: "Appointments Directory | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  await requireAdminSession();
  const adminClient = createAdminClient();

  // 1. Fetch all appointments with joined patient, service, and doctor info
  const { data: rawAppointments } = await adminClient
    .from("appointments")
    .select(
      `id, reference_code, appointment_date, appointment_time, duration_minutes, status, source, patient_notes, admin_notes, created_at,
       patient:patients(id, full_name, phone, email),
       service:services(id, name_en, name_ml, category),
       doctor:doctors(id, name, specialization)`
    )
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  // 2. Preload services, patients, and doctors
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
    <BookingsClient
      initialAppointments={(rawAppointments as unknown as AppointmentRecord[]) || []}
      services={serviceOptions}
      patients={patients || []}
      doctors={doctors || []}
    />
  );
}
