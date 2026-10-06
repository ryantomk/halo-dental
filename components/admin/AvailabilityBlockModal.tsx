"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { createAvailabilityBlockAction } from "@/app/actions/admin";
import { AlertCircle, Loader2 } from "lucide-react";

interface DoctorOption {
  id: string;
  name: string;
}

interface AvailabilityBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctors?: DoctorOption[];
  initialDate?: string;
  onSuccess?: () => void;
}

export default function AvailabilityBlockModal({
  isOpen,
  onClose,
  doctors = [],
  initialDate,
  onSuccess,
}: AvailabilityBlockModalProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [blockDate, setBlockDate] = useState<string>(initialDate || today);
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("16:00");
  const [doctorId, setDoctorId] = useState("");
  const [reason, setReason] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    if (endTime <= startTime) {
      setErrorMessage("End time must be later than start time.");
      setSubmitting(false);
      return;
    }

    try {
      const res = await createAvailabilityBlockAction({
        blockDate,
        startTime,
        endTime,
        doctorId: doctorId || null,
        reason: reason.trim() || undefined,
      });

      if (!res.success) {
        setErrorMessage(res.error || "Failed to block time period.");
        setSubmitting(false);
        return;
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to save availability block.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Block Clinic / Doctor Availability"
      description="Prevent public and manual bookings during this time period."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Date to Block *
          </label>
          <input
            type="date"
            required
            value={blockDate}
            onChange={(e) => setBlockDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Start Time *
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              End Time *
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Doctor (optional)
          </label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
          >
            <option value="">Clinic-Wide Block (All Doctors)</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Reason for Blocking
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Doctor on emergency surgery, Sterilization session..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 bg-white"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 rounded-xl shadow-sm transition-colors"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Block Time Period</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
