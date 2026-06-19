import type { ReactNode } from "react";

// TODO: Auth guard — verify the Supabase session server-side (never rely
// on hidden UI alone, per technical spec Section 14), redirect to
// /admin/login if absent, then compose AdminSidebar + RoleGuard around
// {children}.

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <AdminSidebar /> */}
        {children}
      </body>
    </html>
  );
}
