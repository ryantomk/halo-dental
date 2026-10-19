import { requireRole } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import StaffClient from "@/components/admin/StaffClient";
import type { StaffData } from "@/components/admin/StaffModal";

export const metadata = {
  title: "Staff Management | Halo Dental Staff Portal",
};

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const session = await requireRole(["admin"]);
  const adminClient = createAdminClient();

  // 1. Fetch all staff_users
  const { data: staffList, error: staffError } = await adminClient
    .from("staff_users")
    .select("id, email, full_name, role, is_active, created_at")
    .order("created_at", { ascending: false });

  if (staffError) {
    console.error("[AdminStaffPage] Error fetching staff_users:", staffError);
  }

  // 2. Fetch auth users to correlate last_sign_in_at
  const authMap = new Map<string, string | null>();
  try {
    const { data: authData } = await adminClient.auth.admin.listUsers({
      perPage: 100,
    });
    if (authData?.users) {
      authData.users.forEach((u) => {
        authMap.set(u.id, u.last_sign_in_at || null);
      });
    }
  } catch (err) {
    console.warn("[AdminStaffPage] Could not fetch auth users for last_sign_in:", err);
  }

  const formattedStaff: StaffData[] = (staffList || []).map((s) => ({
    id: s.id,
    email: s.email,
    full_name: s.full_name,
    role: s.role as "admin" | "staff" | "doctor",
    is_active: s.is_active,
    created_at: s.created_at,
    last_sign_in_at: authMap.get(s.id) || null,
  }));

  return (
    <StaffClient
      initialStaff={formattedStaff}
      currentUserId={session.staffUser.id}
    />
  );
}
