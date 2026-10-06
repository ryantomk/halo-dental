"use client";

import { Menu, Plus, UserPlus } from "lucide-react";
import type { StaffUser } from "@/lib/admin/auth";

interface AdminHeaderProps {
  staffUser: StaffUser;
  onOpenSidebar: () => void;
  onNewAppointment?: () => void;
  onNewPatient?: () => void;
  title?: string;
}

export default function AdminHeader({
  staffUser,
  onOpenSidebar,
  onNewAppointment,
  onNewPatient,
  title,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 md:px-8 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <h1 className="text-lg md:text-xl font-semibold text-slate-900 tracking-tight">
            {title}
          </h1>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-2.5">
        {onNewPatient && (
          <button
            type="button"
            onClick={onNewPatient}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Add Patient</span>
          </button>
        )}

        {onNewAppointment && (
          <button
            type="button"
            onClick={onNewAppointment}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        )}
      </div>
    </header>
  );
}
