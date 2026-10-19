import { requireAdminSession } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import DashboardClient from "@/components/admin/DashboardClient";
import type { AppointmentRecord } from "@/components/admin/BookingDetailModal";

export const metadata = {
  title: "Dashboard Overview | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdminSession();
  const adminClient = createAdminClient();

  // Clinic date in Indian Standard Time (Asia/Kolkata)
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

  // 1. Fetch All Active Appointments for Global & Today Status Metrics
  const { data: allAppointments } = await adminClient
    .from("appointments")
    .select("status, appointment_date");

  const list = allAppointments || [];

  // Today's specific breakdown
  const todayList = list.filter((a) => a.appointment_date === today);
  const totalToday = todayList.length;
  const pendingToday = todayList.filter((a) => a.status === "pending").length;
  const confirmedToday = todayList.filter((a) => a.status === "confirmed").length;
  const completedToday = todayList.filter((a) => a.status === "completed").length;
  const cancelledToday = todayList.filter((a) => a.status === "cancelled").length;

  // Clinic-wide actionable metrics
  const totalPending = list.filter((a) => a.status === "pending").length;
  const totalConfirmed = list.filter((a) => a.status === "confirmed").length;
  const upcomingConfirmed = list.filter(
    (a) => a.status === "confirmed" && a.appointment_date >= today
  ).length;
  const totalCompleted = list.filter((a) => a.status === "completed").length;

  // 2. Fetch Total Patient Registry Count
  const { count: patientCount } = await adminClient
    .from("patients")
    .select("id", { count: "exact", head: true });

  // 3. Fetch Pending Bookings Requiring Action (up to 10)
  const { data: pendingRaw } = await adminClient
    .from("appointments")
    .select(
      `id, reference_code, appointment_date, appointment_time, duration_minutes, status, source, patient_notes, admin_notes, created_at,
       patient:patients(id, full_name, phone, email),
       service:services(id, name_en, name_ml, category),
       doctor:doctors(id, name, specialization)`
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(10);

  // 4. Fetch Upcoming Appointments (from today onwards, excluding cancelled, up to 10)
  const { data: upcomingRaw } = await adminClient
    .from("appointments")
    .select(
      `id, reference_code, appointment_date, appointment_time, duration_minutes, status, source, patient_notes, admin_notes, created_at,
       patient:patients(id, full_name, phone, email),
       service:services(id, name_en, name_ml, category),
       doctor:doctors(id, name, specialization)`
    )
    .gte("appointment_date", today)
    .neq("status", "cancelled")
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true })
    .limit(10);

  // 5. Preload dropdowns for manual booking & patient creation
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
    <DashboardClient
      stats={{
        totalToday,
        pendingToday,
        confirmedToday,
        completedToday,
        cancelledToday,
        totalPatients: patientCount || 0,
        totalPending,
        totalConfirmed,
        upcomingConfirmed,
        totalCompleted,
      }}
      pendingAppointments={(pendingRaw as unknown as AppointmentRecord[]) || []}
      upcomingAppointments={(upcomingRaw as unknown as AppointmentRecord[]) || []}
      services={serviceOptions}
      patients={patients || []}
      doctors={doctors || []}
    />
  );
}
