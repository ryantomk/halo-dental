"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import WhatsAppModal from "./WhatsAppModal";
import { rescheduleAppointmentAction } from "@/app/actions/admin";
import { getAvailableSlots } from "@/app/actions/booking";
import { type TimeSlot } from "@/lib/booking/availability";
import type { AppointmentRecord } from "./BookingDetailModal";
import { Calendar, Clock, AlertCircle, Loader2 } from "lucide-react";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRecord | null;
  onSuccess?: () => void;
}

export default function RescheduleModal({
  isOpen,
  onClose,
  appointment,
  onSuccess,
}: RescheduleModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(
    appointment?.appointment_date || today
  );
  const [selectedTime, setSelectedTime] = useState("");
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSundayClosed, setIsSundayClosed] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [rescheduledAppt, setRescheduledAppt] = useState<AppointmentRecord | null>(null);

  // Sync date when appointment changes
  useEffect(() => {
    if (appointment) {
      setSelectedDate(appointment.appointment_date);
      setSelectedTime("");
    }
  }, [appointment]);

  // Load available slots
  useEffect(() => {
    if (!selectedDate || !isOpen) return;

    let isMounted = true;
    setLoadingSlots(true);
    setErrorMessage("");
    setSelectedTime("");

    getAvailableSlots(selectedDate, appointment?.doctor?.id || null)
      .then((res) => {
        if (!isMounted) return;
        setLoadingSlots(false);
        if (res.success) {
          setSlots(res.slots);
          setIsSundayClosed(!!res.isClosed);
        } else {
          setErrorMessage(res.error || "Unable to load schedule.");
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadingSlots(false);
        setErrorMessage("Error checking schedule availability.");
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, appointment, isOpen]);

  if (!appointment) return null;

  async function handleReschedule(e: React.FormEvent) {
    e.preventDefault();
    if (!appointment || !selectedDate || !selectedTime) return;

    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await rescheduleAppointmentAction({
        appointmentId: appointment.id,
        newDate: selectedDate,
        newTime: selectedTime,
        doctorId: appointment.doctor?.id || null,
      });

      if (!res.success) {
        setErrorMessage(
          res.error ||
            "This time slot is no longer available. Please choose another time."
        );
        // Refresh slots
        const refreshed = await getAvailableSlots(selectedDate, appointment.doctor?.id || null);
        if (refreshed.success) setSlots(refreshed.slots);
        setSubmitting(false);
        return;
      }

      setRescheduledAppt({
        ...appointment,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
      });
      setIsWhatsAppOpen(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to reschedule appointment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reschedule: ${appointment.reference_code}`}
      description={`Patient: ${appointment.patient.full_name} (${appointment.service.name_en})`}
      maxWidth="lg"
    >
      <form onSubmit={handleReschedule} className="space-y-5">
        {errorMessage && (
          <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>{errorMessage}</div>
          </div>
        )}

        {/* Current Schedule Summary */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <div className="font-semibold text-slate-500 uppercase tracking-wider">
            Current Booking
          </div>
          <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{appointment.appointment_date}</span>
            <Clock className="w-4 h-4 text-slate-400 ml-2" />
            <span>{appointment.appointment_time}</span>
          </div>
        </div>

        {/* New Date Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
            Select New Date *
          </label>
          <input
            type="date"
            min={today}
            required
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* New Time Slot Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              Select New Time Slot *
            </label>
            {loadingSlots && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                <span>Checking available slots...</span>
              </div>
            )}
          </div>

          {isSundayClosed ? (
            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl">
              Clinic is closed on Sundays. Please select a date from Monday to Saturday.
            </div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
              {slots.map((slot) => {
                const isSelected = selectedTime === slot.time;
                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    title={slot.reason || (slot.available ? "Available" : "Occupied")}
                    className={`px-2 py-2 rounded-lg text-xs font-semibold text-center transition-all ${
                      isSelected
                        ? "bg-teal-600 text-white shadow-sm ring-2 ring-teal-600"
                        : slot.available
                        ? "bg-white text-slate-800 border border-slate-200 hover:border-teal-500 hover:bg-teal-50"
                        : "bg-slate-200/70 text-slate-400 border border-slate-200 cursor-not-allowed line-through"
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Actions */}
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
            disabled={submitting || !selectedTime || isSundayClosed}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-colors"
          >
            {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Confirm Reschedule</span>
          </button>
        </div>
      </form>

      {/* Post-Reschedule WhatsApp Composer */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => {
          setIsWhatsAppOpen(false);
          onClose();
        }}
        appointment={rescheduledAppt}
        initialTemplate="reschedule"
      />
    </Modal>
  );
}

