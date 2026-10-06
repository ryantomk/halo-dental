import type { ReactNode } from "react";
import { getAdminSession } from "@/lib/admin/auth";
import AdminClientLayout from "@/components/admin/AdminClientLayout";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Staff & Doctor Portal | Halo Dental",
  description: "Halo Dental Administrative and Clinical Management Dashboard",
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();

  // If no active session (such as on /admin/login), render clean container
  if (!session) {
    return (
      <html lang="en">
        <body className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100">
          {children}
        </body>
      </html>
    );
  }

  // Preload services, patients, and doctors for global quick action modal
  const adminClient = createAdminClient();
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
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
        <AdminClientLayout
          staffUser={session.staffUser}
          services={serviceOptions}
          patients={patients || []}
          doctors={doctors || []}
        >
          {children}
        </AdminClientLayout>
      </body>
    </html>
  );
}
