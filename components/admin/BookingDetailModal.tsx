"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import StatusBadge from "./StatusBadge";
import WhatsAppModal from "./WhatsAppModal";
import { type WhatsAppTemplateType } from "@/lib/utils/whatsapp";
import { updateAppointmentStatusAction } from "@/app/actions/admin";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Stethoscope,
  FileText,
  MessageCircle,
  CheckCircle,
  XCircle,
  PlayCircle,
  AlertTriangle,
  Loader2,
  CalendarDays,
} from "lucide-react";

export interface AppointmentRecord {
  id: string;
  reference_code: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  status: "pending" | "confirmed" | "completed" | "cancelled" | "no_show";
  source: string;
  patient_notes: string | null;
  admin_notes: string | null;
  created_at: string;
  patient: {
    id: string;
    full_name: string;
    phone: string;
    email: string | null;
  };
  service: {
    id: string;
    name_en: string;
    name_ml?: string;
    category?: string;
  };
  doctor?: {
    id: string;
    name: string;
    specialization?: string;
  } | null;
}

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRecord | null;
  onRescheduleClick: (appointment: AppointmentRecord) => void;
  onUpdated?: () => void;
}

export default function BookingDetailModal({
  isOpen,
  onClose,
  appointment,
  onRescheduleClick,
  onUpdated,
}: BookingDetailModalProps) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState(false);
  const [notesValue, setNotesValue] = useState(appointment?.admin_notes || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [whatsAppTemplate, setWhatsAppTemplate] = useState<WhatsAppTemplateType>("confirmation");

  if (!appointment) return null;

  async function handleStatusChange(
    newStatus: "pending" | "confirmed" | "completed" | "cancelled" | "no_show"
  ) {
    if (!appointment) return;
    setLoadingAction(newStatus);
    setErrorMessage("");

    try {
      const res = await updateAppointmentStatusAction(
        appointment.id,
        newStatus,
        notesValue !== appointment.admin_notes ? notesValue : undefined
      );

      if (!res.success) {
        setErrorMessage(res.error || "Failed to update appointment status.");
      } else {
        appointment.status = newStatus;
        if (onUpdated) onUpdated();

        // Prompt appropriate WhatsApp message when confirmed or cancelled
        if (newStatus === "confirmed") {
          setWhatsAppTemplate("confirmation");
          setIsWhatsAppOpen(true);
        } else if (newStatus === "cancelled") {
          setWhatsAppTemplate("cancellation");
          setIsWhatsAppOpen(true);
        } else {
          onClose();
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Error updating status.");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Appointment Details: ${appointment.reference_code}`}
      description={`Created on ${new Date(appointment.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        {/* Status & Quick Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Status:
            </span>
            <StatusBadge status={appointment.status} />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {appointment.status === "confirmed" && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setWhatsAppTemplate("confirmation");
                    setIsWhatsAppOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                  title="Send official appointment confirmation via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Send Confirmation</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setWhatsAppTemplate("reminder");
                    setIsWhatsAppOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                  title="Send friendly appointment reminder"
                >
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Send Reminder</span>
                </button>
              </>
            )}

            {appointment.status === "cancelled" && (
              <button
                type="button"
                onClick={() => {
                  setWhatsAppTemplate("cancellation");
                  setIsWhatsAppOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                title="Send cancellation notice via WhatsApp"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Send Cancellation Notice</span>
              </button>
            )}

            {appointment.status !== "confirmed" && appointment.status !== "cancelled" && (
              <button
                type="button"
                onClick={() => {
                  setWhatsAppTemplate("reminder");
                  setIsWhatsAppOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Patient</span>
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Patient Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <User className="w-4 h-4 text-teal-600" />
              <span>Patient Information</span>
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                {appointment.patient.full_name}
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <a
                  href={`tel:${appointment.patient.phone}`}
                  className="hover:text-teal-700 font-mono"
                >
                  {appointment.patient.phone}
                </a>
              </div>
              {appointment.patient.email && (
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{appointment.patient.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Schedule & Procedure Card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span>Schedule & Procedure</span>
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">
                {appointment.service.name_en}
              </div>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-700 font-medium">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {appointment.appointment_date} at {appointment.appointment_time} ({appointment.duration_minutes} min)
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Doctor: {appointment.doctor ? appointment.doctor.name : "Dr. Haseeb / Specialist"}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Source: <span className="capitalize font-medium text-slate-600">{appointment.source}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Notes */}
        {appointment.patient_notes && (
          <div className="p-3.5 bg-amber-50/50 border border-amber-200/60 rounded-xl">
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Notes Provided by Patient</span>
            </div>
            <p className="text-sm text-slate-700">{appointment.patient_notes}</p>
          </div>
        )}

        {/* Admin Notes */}
        <div className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Admin / Clinic Notes
            </label>
            <button
              type="button"
              onClick={() => setEditNotes(!editNotes)}
              className="text-xs text-teal-600 hover:text-teal-700 font-medium"
            >
              {editNotes ? "Cancel" : "Edit"}
            </button>
          </div>
          {editNotes ? (
            <textarea
              rows={3}
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
              placeholder="Internal clinic remarks..."
            />
          ) : (
            <p className="text-sm text-slate-600 italic">
              {notesValue || "No administrative notes entered yet."}
            </p>
          )}
        </div>

        {/* State Transition Actions */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {/* Confirm action for pending */}
            {appointment.status === "pending" && (
              <button
                type="button"
                disabled={!!loadingAction}
                onClick={() => handleStatusChange("confirmed")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                {loadingAction === "confirmed" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                <span>Confirm Booking</span>
              </button>
            )}

            {/* Mark Completed */}
            {appointment.status === "confirmed" && (
              <button
                type="button"
                disabled={!!loadingAction}
                onClick={() => handleStatusChange("completed")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                {loadingAction === "completed" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                <span>Mark Completed</span>
              </button>
            )}

            {/* Reschedule Button */}
            {appointment.status !== "completed" && appointment.status !== "cancelled" && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRescheduleClick(appointment);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold border border-slate-200 transition-colors"
              >
                <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                <span>Reschedule Slot</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mark No Show */}
            {appointment.status === "confirmed" && (
              <button
                type="button"
                disabled={!!loadingAction}
                onClick={() => handleStatusChange("no_show")}
                className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Mark No-Show
              </button>
            )}

            {/* Cancel Appointment */}
            {appointment.status !== "cancelled" && appointment.status !== "completed" && (
              <button
                type="button"
                disabled={!!loadingAction}
                onClick={() => {
                  if (confirm("Are you sure you want to cancel this appointment? The slot will be freed for other patients.")) {
                    handleStatusChange("cancelled");
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                {loadingAction === "cancelled" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <XCircle className="w-3.5 h-3.5" />
                )}
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* WhatsApp Message Composer & Link Generator */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        appointment={appointment}
        initialTemplate={whatsAppTemplate}
      />
    </Modal>
  );
}

