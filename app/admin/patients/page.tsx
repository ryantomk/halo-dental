import { requireAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import PatientsClient from "@/components/admin/PatientsClient";

export const metadata = {
  title: "Patient Registry | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminPatientsPage() {
  await requireAdminSession();
  const adminClient = createAdminClient();

  // 1. Fetch patients with joined appointment history
  const { data: rawPatients } = await adminClient
    .from("patients")
    .select(
      `id, full_name, phone, email, date_of_birth, gender, notes, created_at,
       appointments:appointments(id, reference_code, appointment_date, appointment_time, status, service:services(name_en))`
    )
    .order("created_at", { ascending: false });

  // 2. Preload services and doctors
  const [{ data: services }, { data: doctors }] = await Promise.all([
    adminClient
      .from("services")
      .select("id, name_en, category, duration_minutes")
      .eq("is_active", true)
      .order("sort_order"),
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

  const formattedPatients = (rawPatients || []).map((p: any) => ({
    id: p.id,
    full_name: p.full_name,
    phone: p.phone,
    email: p.email,
    date_of_birth: p.date_of_birth,
    gender: p.gender,
    notes: p.notes,
    created_at: p.created_at,
    appointments: (p.appointments || []).map((a: any) => ({
      id: a.id,
      reference_code: a.reference_code,
      appointment_date: a.appointment_date,
      appointment_time: a.appointment_time,
      status: a.status,
      service_name: a.service?.name_en || "Dental Service",
    })),
  }));

  return (
    <PatientsClient
      initialPatients={formattedPatients}
      services={serviceOptions}
      doctors={doctors || []}
    />
  );
}
