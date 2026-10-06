"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";
import BookingDetailModal, { type AppointmentRecord } from "./BookingDetailModal";
import RescheduleModal from "./RescheduleModal";
import ManualBookingModal from "./ManualBookingModal";
import AvailabilityBlockModal from "./AvailabilityBlockModal";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  ShieldAlert,
  User,
} from "lucide-react";
import type { ServiceOption } from "@/app/actions/booking";
import type { AvailabilityBlock } from "@/lib/booking/availability";

interface CalendarClientProps {
  initialDate: string;
  appointments: AppointmentRecord[];
  availabilityBlocks: AvailabilityBlock[];
  services: ServiceOption[];
  patients: { id: string; full_name: string; phone: string; email?: string | null }[];
  doctors: { id: string; name: string; specialization?: string }[];
}

export default function CalendarClient({
  initialDate,
  appointments,
  availabilityBlocks,
  services,
  patients,
  doctors,
}: CalendarClientProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [viewMode, setViewMode] = useState<"day" | "week">("day");

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRecord | null>(null);
  const [rescheduleAppointment, setRescheduleAppointment] = useState<AppointmentRecord | null>(null);
  const [isManualBookingOpen, setIsManualBookingOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);

  // Daily hours slots (09:00 to 19:30)
  const HOURS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30"
  ];

  // Helper to adjust day
  function changeDate(days: number) {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d.toISOString().slice(0, 10));
  }

  // Week days calculation for week view
  function getWeekDays(centerDateStr: string): string[] {
    const d = new Date(centerDateStr);
    const dayOfWeek = d.getDay(); // 0 is Sun
    const startOfWeek = new Date(d);
    // Move to Monday
    const diff = d.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const week: string[] = [];
    for (let i = 0; i < 6; i++) { // Mon - Sat (excluding Sun)
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day.toISOString().slice(0, 10));
    }
    return week;
  }

  const weekDays = getWeekDays(currentDate);

  // Check appointments on specific date & time
  function getAppointmentAt(date: string, time: string) {
    return appointments.find(
      (a) =>
        a.appointment_date === date &&
        a.appointment_time.slice(0, 5) === time &&
        a.status !== "cancelled"
    );
  }

  // Check blocks on specific date & time
  function getBlockAt(date: string, time: string) {
    return availabilityBlocks.find((b) => {
      if (b.block_date !== date) return false;
      const start = b.start_time.slice(0, 5);
      const end = b.end_time.slice(0, 5);
      return time >= start && time < end;
    });
  }

  return (
    <div className="space-y-6">
      {/* Calendar Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-slate-200 p-0.5 bg-slate-50">
            <button
              type="button"
              onClick={() => changeDate(viewMode === "day" ? -1 : -7)}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date().toISOString().slice(0, 10))}
              className="px-3 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => changeDate(viewMode === "day" ? 1 : 7)}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-sm font-bold text-slate-900">
            {new Date(currentDate).toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Day / Week View Toggle */}
          <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === "day"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Day View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === "week"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Week View
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsBlockModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Block Time</span>
          </button>

          <button
            type="button"
            onClick={() => setIsManualBookingOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Calendar Grid View */}
      {viewMode === "day" ? (
        /* DAY VIEW */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200/80 font-bold text-xs uppercase tracking-wider text-slate-600 flex items-center justify-between">
            <span>Daily Schedule Timeline ({currentDate})</span>
            <span className="text-[11px] font-normal text-slate-500">Operating hours 09:00 - 20:00</span>
          </div>

          <div className="divide-y divide-slate-100">
            {HOURS.map((hour) => {
              const appt = getAppointmentAt(currentDate, hour);
              const block = getBlockAt(currentDate, hour);

              return (
                <div
                  key={hour}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-slate-50/60 transition-colors gap-3"
                >
                  <div className="w-24 flex items-center gap-2 text-xs font-bold text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{hour}</span>
                  </div>

                  <div className="flex-1">
                    {appt ? (
                      <div
                        onClick={() => setSelectedAppointment(appt)}
                        className="cursor-pointer p-3 rounded-xl bg-teal-50/60 border border-teal-200/80 hover:border-teal-400 transition-all flex flex-wrap items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">
                              {appt.patient.full_name}
                            </span>
                            <span className="font-mono text-[11px] text-slate-400">
                              ({appt.reference_code})
                            </span>
                            <StatusBadge status={appt.status} size="sm" />
                          </div>
                          <div className="text-[11px] text-slate-600">
                            {appt.service.name_en} • Dr. {appt.doctor?.name || "Haseeb"}
                          </div>
                        </div>

                        <span className="text-[11px] font-semibold text-teal-700 underline">
                          View Details
                        </span>
                      </div>
                    ) : block ? (
                      <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <div>
                          <span className="font-bold">Time Blocked: </span>
                          <span>{block.reason || "Clinic blocked slot"}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-400 p-2 rounded-lg border border-dashed border-slate-200">
                        <span>Slot Available</span>
                        <button
                          type="button"
                          onClick={() => setIsManualBookingOpen(true)}
                          className="text-[11px] font-semibold text-teal-600 hover:text-teal-800"
                        >
                          + Book Patient
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* WEEK VIEW (Mon - Sat) */
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[11px]">
              <tr>
                <th className="p-3 w-16 text-center font-bold">Time</th>
                {weekDays.map((d) => (
                  <th key={d} className="p-3 font-bold border-l border-slate-100">
                    <div>
                      {new Date(d).toLocaleDateString("en-IN", { weekday: "short" })}
                    </div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      {d.slice(5)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {HOURS.map((hour) => (
                <tr key={hour}>
                  <td className="p-2 text-center font-mono font-semibold text-slate-500 bg-slate-50/50">
                    {hour}
                  </td>
                  {weekDays.map((d) => {
                    const appt = getAppointmentAt(d, hour);
                    const block = getBlockAt(d, hour);

                    return (
                      <td
                        key={d}
                        className="p-1.5 border-l border-slate-100 align-top h-14"
                      >
                        {appt ? (
                          <div
                            onClick={() => setSelectedAppointment(appt)}
                            className="cursor-pointer p-1.5 bg-teal-100/70 border border-teal-200 rounded-lg hover:border-teal-400 transition-colors h-full flex flex-col justify-between"
                          >
                            <div className="font-bold text-slate-900 truncate text-[11px]">
                              {appt.patient.full_name}
                            </div>
                            <div className="text-[10px] text-teal-800 truncate">
                              {appt.service.name_en}
                            </div>
                          </div>
                        ) : block ? (
                          <div className="p-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[10px] h-full flex items-center justify-center">
                            Blocked
                          </div>
                        ) : (
                          <div className="h-full rounded-lg hover:bg-slate-50/80 transition-colors" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

      <AvailabilityBlockModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        doctors={doctors}
        initialDate={currentDate}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
