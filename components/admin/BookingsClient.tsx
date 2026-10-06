"use client";

import { useState } from "react";
import StatusBadge, { type AppointmentStatus } from "./StatusBadge";
import BookingDetailModal, { type AppointmentRecord } from "./BookingDetailModal";
import RescheduleModal from "./RescheduleModal";
import ManualBookingModal from "./ManualBookingModal";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Plus,
  Eye,
  CalendarDays,
  XCircle,
  CheckCircle,
} from "lucide-react";
import type { ServiceOption } from "@/app/actions/booking";

interface BookingsClientProps {
  initialAppointments: AppointmentRecord[];
  services: ServiceOption[];
  patients: { id: string; full_name: string; phone: string; email?: string | null }[];
  doctors: { id: string; name: string; specialization?: string }[];
}

export default function BookingsClient({
  initialAppointments,
  services,
  patients,
  doctors,
}: BookingsClientProps) {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<AppointmentRecord | null>(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);

  // Filtered appointments
  const filteredAppointments = appointments.filter((appt) => {
    // 1. Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const patientMatch = appt.patient.full_name.toLowerCase().includes(q);
      const phoneMatch = appt.patient.phone.includes(q);
      const refMatch = appt.reference_code.toLowerCase().includes(q);
      if (!patientMatch && !phoneMatch && !refMatch) return false;
    }

    // 2. Status filter
    if (statusFilter !== "all" && appt.status !== statusFilter) {
      return false;
    }

    // 3. Service filter
    if (serviceFilter !== "all" && appt.service.id !== serviceFilter) {
      return false;
    }

    // 4. Date filter
    if (dateFilter && appt.appointment_date !== dateFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Appointments Directory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage, confirm, triage, and reschedule patient dental bookings
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsManualBookingOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Appointment</span>
        </button>
      </div>

      {/* Filters row */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient, phone, or ref code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50 capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          {/* Service Filter */}
          <div>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            >
              <option value="all">All Dental Services</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Date Filter */}
          <div>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Active Filter Clear Tag */}
        {(searchQuery || statusFilter !== "all" || serviceFilter !== "all" || dateFilter) && (
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            <span>Filtering {filteredAppointments.length} of {appointments.length} appointments</span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setServiceFilter("all");
                setDateFilter("");
              }}
              className="text-teal-600 hover:text-teal-800 font-semibold underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Appointments Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <div>No appointments found matching your criteria.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Ref Code</th>
                  <th className="px-6 py-3.5">Patient</th>
                  <th className="px-4 py-3.5">Service</th>
                  <th className="px-4 py-3.5">Date & Time</th>
                  <th className="px-4 py-3.5">Source</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 font-mono font-semibold text-slate-900">
                      {appt.reference_code}
                    </td>
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
                    <td className="px-4 py-3.5 capitalize text-slate-500">
                      {appt.source}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={appt.status} size="sm" />
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedAppointment(appt)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                        >
                          View / Manage
                        </button>
                      </div>
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
    </div>
  );
}
