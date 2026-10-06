"use client";

import { useState } from "react";
import AvailabilityBlockModal from "./AvailabilityBlockModal";
import { deleteAvailabilityBlockAction } from "@/app/actions/admin";
import {
  Calendar,
  Clock,
  Plus,
  ShieldAlert,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  Stethoscope,
} from "lucide-react";
import type { AvailabilityBlock } from "@/lib/booking/availability";
import type { AppointmentRecord } from "./BookingDetailModal";

interface AvailabilityClientProps {
  initialDate: string;
  appointments: AppointmentRecord[];
  allBlocks: AvailabilityBlock[];
  doctors: { id: string; name: string }[];
}

export default function AvailabilityClient({
  initialDate,
  appointments,
  allBlocks,
  doctors,
}: AvailabilityClientProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Daily hours slots (09:00 to 19:30)
  const HOURS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30",
  ];

  // Blocks for current selected date
  const dateBlocks = allBlocks.filter((b) => b.block_date === selectedDate);

  // Appointments on selected date
  const dateAppointments = appointments.filter(
    (a) => a.appointment_date === selectedDate && a.status !== "cancelled"
  );

  async function handleUnblock(blockId: string) {
    if (!confirm("Are you sure you want to unblock this time period? The slots will become available for booking.")) {
      return;
    }

    setDeletingId(blockId);
    try {
      const res = await deleteAvailabilityBlockAction(blockId);
      if (!res.success) {
        alert("Failed to unblock time period.");
      } else {
        window.location.reload();
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Schedule & Availability Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage clinic operating hours, block doctor leave, and see live slot states
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsBlockModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>+ Block Time Period</span>
        </button>
      </div>

      {/* Date Navigator */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
            View Schedule For:
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Available</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <span>Booked ({dateAppointments.length})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Blocked ({dateBlocks.length})</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Slot Timeline */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 font-bold text-xs uppercase tracking-wider text-slate-600 flex items-center justify-between">
            <span>Slots on {selectedDate}</span>
            <span className="text-[11px] font-normal text-slate-500">30-min intervals</span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {HOURS.map((hour) => {
              const appt = dateAppointments.find(
                (a) => a.appointment_time.slice(0, 5) === hour
              );
              const block = dateBlocks.find((b) => {
                const s = b.start_time.slice(0, 5);
                const e = b.end_time.slice(0, 5);
                return hour >= s && hour < e;
              });

              return (
                <div
                  key={hour}
                  className="flex items-center justify-between p-3.5 hover:bg-slate-50/60 transition-colors gap-3"
                >
                  <div className="w-20 font-mono text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{hour}</span>
                  </div>

                  <div className="flex-1">
                    {appt ? (
                      <div className="p-2 bg-teal-50 border border-teal-200/80 rounded-lg text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900">
                            Booked: {appt.patient.full_name}
                          </span>
                          <span className="text-[11px] text-teal-800 ml-2">
                            ({appt.service.name_en})
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-slate-500">
                          {appt.reference_code}
                        </span>
                      </div>
                    ) : block ? (
                      <div className="p-2 bg-amber-50 border border-amber-200 text-amber-900 rounded-lg text-xs flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            <strong>Blocked:</strong> {block.reason || "Doctor unavailable / clinic closed"}
                          </span>
                        </div>
                        <button
                          type="button"
                          disabled={deletingId === block.id}
                          onClick={() => handleUnblock(block.id)}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-800 underline"
                        >
                          Unblock
                        </button>
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 flex items-center justify-between">
                        <span className="text-emerald-700 font-medium">Available for booking</span>
                        <button
                          type="button"
                          onClick={() => setIsBlockModalOpen(true)}
                          className="text-[11px] font-semibold text-amber-700 hover:text-amber-800"
                        >
                          Block Slot
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Active Availability Blocks List */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Active Time Blocks ({allBlocks.length})</span>
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            These blocked intervals are automatically disabled in both public booking and manual scheduling.
          </p>

          {allBlocks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
              No active time blocks configured. All operating hours are open.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto">
              {allBlocks.map((block) => (
                <div
                  key={block.id}
                  className="p-3 border border-amber-200/80 bg-amber-50/40 rounded-xl text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {block.block_date}
                    </span>
                    <button
                      type="button"
                      disabled={deletingId === block.id}
                      onClick={() => handleUnblock(block.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Unblock Time Period"
                    >
                      {deletingId === block.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>
                      {block.start_time.slice(0, 5)} → {block.end_time.slice(0, 5)}
                    </span>
                  </div>

                  {block.reason && (
                    <div className="text-[11px] text-slate-600 italic">
                      &quot;{block.reason}&quot;
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for adding a block */}
      <AvailabilityBlockModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        doctors={doctors}
        initialDate={selectedDate}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
