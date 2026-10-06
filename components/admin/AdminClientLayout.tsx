"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import ManualBookingModal from "./ManualBookingModal";
import PatientModal from "./PatientModal";
import type { StaffUser } from "@/lib/admin/auth";
import type { ServiceOption } from "@/app/actions/booking";

interface AdminClientLayoutProps {
  staffUser: StaffUser;
  services: ServiceOption[];
  patients: { id: string; full_name: string; phone: string; email?: string | null }[];
  doctors: { id: string; name: string; specialization?: string }[];
  children: ReactNode;
}

export default function AdminClientLayout({
  staffUser,
  services,
  patients,
  doctors,
  children,
}: AdminClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [patientModalOpen, setPatientModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        staffUser={staffUser}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <AdminHeader
          staffUser={staffUser}
          onOpenSidebar={() => setSidebarOpen(true)}
          onNewAppointment={() => setBookingModalOpen(true)}
          onNewPatient={() => setPatientModalOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Quick Action Modals */}
      <ManualBookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        patients={patients}
        services={services}
        doctors={doctors}
        onSuccess={() => {
          // Window reload or router refresh handled inside modal
        }}
      />

      <PatientModal
        isOpen={patientModalOpen}
        onClose={() => setPatientModalOpen(false)}
        onSuccess={() => {
          // Refreshed
        }}
      />
    </div>
  );
}
