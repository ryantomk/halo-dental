"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import BookingDetailModal, { type AppointmentRecord } from "./BookingDetailModal";
import RescheduleModal from "./RescheduleModal";
import ManualBookingModal from "./ManualBookingModal";
import PatientModal from "./PatientModal";
import { updateAppointmentStatusAction } from "@/app/actions/admin";
import {
  Calendar,
  Clock,
  User,
  Plus,
  UserPlus,
  CheckCircle,
  XCircle,
  Eye,
  CalendarDays,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Loader2,
  Stethoscope,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  UserCog,
} from "lucide-react";
import type { ServiceOption } from "@/app/actions/booking";

interface DashboardClientProps {
  stats: {
    totalToday: number;
    pendingToday: number;
    confirmedToday: number;
    completedToday: number;
    cancelledToday: number;
    totalPatients: number;
    totalPending: number;
    totalConfirmed: number;
    upcomingConfirmed: number;
    totalCompleted: number;
  };
  upcomingAppointments: AppointmentRecord[];
  pendingAppointments: AppointmentRecord[];
  services: ServiceOption[];
  patients: { id: string; full_name: string; phone: string; email?: string | null }[];
  doctors: { id: string; name: string; specialization?: string }[];
}

export default function DashboardClient({
  stats,
  upcomingAppointments,
  pendingAppointments,
  services,
  patients,
  doctors,
}: DashboardClientProps) {
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<AppointmentRecord | null>(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  async function handleQuickConfirm(id: string) {
    setActionLoadingId(id);
    try {
      await updateAppointmentStatusAction(id, "confirmed");
      window.location.reload();
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleQuickCancel(id: string) {
    if (!confirm("Are you sure you want to cancel this booking? The slot will be freed.")) return;
    setActionLoadingId(id);
    try {
      await updateAppointmentStatusAction(id, "cancelled");
      window.location.reload();
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-teal-950 p-6 rounded-3xl text-white shadow-lg border border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Today&apos;s Clinic Overview</h2>
          <p className="text-xs text-teal-300 mt-1">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsManualBookingOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddPatientOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-teal-400" />
            <span>Add Patient</span>
          </button>

          <Link
            href="/admin/availability"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs border border-slate-700 transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5 text-teal-400" />
            <span>Manage Availability</span>
          </Link>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Quick Actions
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Reception &amp; Content Management Shortcuts</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
          <button
            type="button"
            onClick={() => setIsManualBookingOpen(true)}
            className="flex items-center gap-2 p-3 rounded-2xl bg-teal-50 hover:bg-teal-100/80 text-teal-900 border border-teal-200/70 font-semibold text-xs transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Plus className="w-4 h-4" />
            </div>
            <span className="truncate">New Appointment</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddPatientOpen(true)}
            className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs transition-all hover:shadow-xs group cursor-pointer"
          >
            <div className="w-7 h-7 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <UserPlus className="w-4 h-4 text-teal-400" />
            </div>
            <span className="truncate">Add Patient</span>
          </button>

          <Link
            href="/admin/staff"
            className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs transition-all hover:shadow-xs group"
          >
            <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <UserCog className="w-4 h-4" />
            </div>
            <span className="truncate">Manage Staff</span>
          </Link>

          <Link
            href="/admin/services?new=1"
            className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs transition-all hover:shadow-xs group"
          >
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Stethoscope className="w-4 h-4" />
            </div>
            <span className="truncate">Add Service</span>
          </Link>

          <Link
            href="/admin/blog?new=1"
            className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs transition-all hover:shadow-xs group"
          >
            <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="truncate">Write Blog</span>
          </Link>

          <Link
            href="/admin/gallery?new=1"
            className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs transition-all hover:shadow-xs group"
          >
            <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="truncate">Upload Gallery</span>
          </Link>

          <Link
            href="/admin/testimonials?new=1"
            className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-xs transition-all hover:shadow-xs group"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="truncate">Add Testimonial</span>
          </Link>
        </div>
      </div>

      {/* Practice Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Link
          href="/admin/bookings?status=pending"
          className="p-4 bg-white border border-amber-200/80 rounded-2xl shadow-2xs bg-gradient-to-br from-white to-amber-50/40 hover:border-amber-300 transition-all group block"
        >
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center justify-between">
            <span>Pending Action</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-2 flex items-baseline gap-2">
            <span>{stats.totalPending}</span>
            {stats.pendingToday > 0 && (
              <span className="text-xs font-semibold text-amber-600">
                ({stats.pendingToday} today)
              </span>
            )}
          </div>
          <div className="text-[11px] text-amber-700/80 mt-1">
            {stats.totalPending === 1
              ? "1 booking awaiting confirmation"
              : `${stats.totalPending} bookings awaiting confirmation`}
          </div>
        </Link>

        <Link
          href="/admin/bookings?status=confirmed"
          className="p-4 bg-white border border-emerald-200/80 rounded-2xl shadow-2xs bg-gradient-to-br from-white to-emerald-50/40 hover:border-emerald-300 transition-all group block"
        >
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center justify-between">
            <span>Confirmed</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-900 mt-2 flex items-baseline gap-2">
            <span>{stats.totalConfirmed}</span>
            {stats.confirmedToday > 0 && (
              <span className="text-xs font-semibold text-emerald-600">
                ({stats.confirmedToday} today)
              </span>
            )}
          </div>
          <div className="text-[11px] text-emerald-700/80 mt-1">
            {stats.upcomingConfirmed} upcoming on calendar
          </div>
        </Link>

        <Link
          href="/admin/calendar"
          className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:border-slate-300 transition-all group block"
        >
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Today&apos;s Schedule</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {stats.totalToday}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {stats.confirmedToday > 0
              ? `${stats.confirmedToday} confirmed for today`
              : "No visits scheduled today"}
          </div>
        </Link>

        <Link
          href="/admin/bookings?status=completed"
          className="p-4 bg-white border border-teal-200/80 rounded-2xl shadow-2xs bg-gradient-to-br from-white to-teal-50/40 hover:border-teal-300 transition-all group block"
        >
          <div className="text-xs font-semibold text-teal-700 uppercase tracking-wider flex items-center justify-between">
            <span>Completed</span>
            <span className="w-2 h-2 rounded-full bg-teal-500" />
          </div>
          <div className="text-2xl font-bold text-teal-900 mt-2 flex items-baseline gap-2">
            <span>{stats.totalCompleted}</span>
            {stats.completedToday > 0 && (
              <span className="text-xs font-semibold text-teal-600">
                ({stats.completedToday} today)
              </span>
            )}
          </div>
          <div className="text-[11px] text-teal-700/80 mt-1">Treated consultations</div>
        </Link>

        <Link
          href="/admin/patients"
          className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs hover:border-slate-300 transition-all group block"
        >
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Total Patients</span>
            <User className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">
            {stats.totalPatients}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">In clinic registry</div>
        </Link>
      </div>

      {/* Actionable Pending Bookings Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50/30">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              !
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Action Required: Pending Bookings ({pendingAppointments.length})
              </h3>
              <p className="text-xs text-slate-500">
                Review and confirm incoming public requests or phone inquiries
              </p>
            </div>
          </div>

          <Link
            href="/admin/bookings?status=pending"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {pendingAppointments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No pending bookings requiring confirmation right now.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {pendingAppointments.map((appt) => (
              <div
                key={appt.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {appt.patient.full_name}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ({appt.reference_code})
                    </span>
                    <StatusBadge status={appt.status} size="sm" />
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                    <span className="font-medium text-teal-800">
                      {appt.service.name_en}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {appt.appointment_date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {appt.appointment_time}
                    </span>
                  </div>
                  {appt.patient_notes && (
                    <div className="text-xs text-slate-500 italic mt-1 line-clamp-1">
                      &quot;{appt.patient_notes}&quot;
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setSelectedAppointment(appt)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoadingId === appt.id}
                    onClick={() => handleQuickConfirm(appt.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 rounded-lg shadow-2xs transition-colors"
                  >
                    {actionLoadingId === appt.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}
                    <span>Confirm</span>
                  </button>

                  <button
                    type="button"
                    disabled={actionLoadingId === appt.id}
                    onClick={() => handleQuickCancel(appt.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Cancel Booking"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Appointments List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Upcoming Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Next scheduled patient visits
            </p>
          </div>

          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
          >
            <span>All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No upcoming appointments scheduled.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-4 py-3">Service</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Doctor</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {upcomingAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900">{appt.patient.full_name}</div>
                      <div className="text-[11px] font-mono text-slate-400">{appt.patient.phone}</div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800">
                      {appt.service.name_en}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{appt.appointment_date}</div>
                      <div className="text-[11px] text-teal-700 font-semibold">{appt.appointment_time}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {appt.doctor?.name || "Dr. Haseeb"}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={appt.status} size="sm" />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedAppointment(appt)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      <BookingDetailModal
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
        onRescheduleClick={(appt) => setRescheduleAppointment(appt)}
        onUpdated={() => window.location.reload()}
      />

      <RescheduleModal
        isOpen={!!rescheduleAppointment}
        onClose={() => setRescheduleAppointment(null)}
        appointment={rescheduleAppointment}
        onSuccess={() => window.location.reload()}
      />

      <ManualBookingModal
        isOpen={isManualBookingOpen}
        onClose={() => setIsManualBookingOpen(false)}
        patients={patients}
        services={services}
        doctors={doctors}
        onSuccess={() => window.location.reload()}
      />

      <PatientModal
        isOpen={isAddPatientOpen}
        onClose={() => setIsAddPatientOpen(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
