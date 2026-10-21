import { redirect } from "next/navigation";
import { createClient as createServerSupabase } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database.types";

export type StaffUser = Database["public"]["Tables"]["staff_users"]["Row"];

export interface AdminSession {
  user: {
    id: string;
    email?: string;
  };
  staffUser: StaffUser;
}

/**
 * Retrieves the current authenticated admin/staff session from server cookies.
 * Verifies both the Supabase Auth session and the corresponding `staff_users` record.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const supabase = createServerSupabase();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return null;
    }

    // Verify staff_users record
    const adminClient = createAdminClient();
    const { data: staffUser, error: staffError } = await adminClient
      .from("staff_users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (staffError || !staffUser || !staffUser.is_active) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      staffUser,
    };
  } catch (err: any) {
    if (err?.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("[admin/auth] Error verifying session:", err);
    return null;
  }
}

/**
 * Enforces an active staff/admin session for Server Components and Server Actions.
 * Redirects to `/admin/login` if the user is unauthenticated or deactivated.
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Enforces specific role authorization (e.g. 'admin', 'staff', 'doctor').
 */
export async function requireRole(allowedRoles: ("admin" | "staff" | "doctor")[]): Promise<AdminSession> {
  const session = await requireAdminSession();
  const userRole = session.staffUser.role as "admin" | "staff" | "doctor";

  if (!allowedRoles.includes(userRole)) {
    redirect("/admin?error=forbidden");
  }

  return session;
}

/**
 * Helper to log an administrative action in the `audit_logs` table.
 */
export async function logAdminAction(params: {
  staffUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
}) {
  try {
    const supabase = createAdminClient();
    const isUuid = params.entityId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.entityId);
    const enrichedDetails = {
      ...(params.details || {}),
      ...(!isUuid && params.entityId ? { entityIdentifier: params.entityId } : {}),
    };

    await supabase.from("audit_logs").insert({
      staff_user_id: params.staffUserId || null,
      action: params.action,
      entity_type: params.entityType,
      entity_id: isUuid ? params.entityId : null,
      details: enrichedDetails as any,
      ip_address: params.ipAddress || null,
    });
  } catch (err) {
    console.error("[audit_logs] Failed to write audit log:", err);
  }
}
