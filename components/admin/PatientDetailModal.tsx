"use client";

import Modal from "@/components/ui/Modal";
import StatusBadge from "./StatusBadge";
import { User, Phone, Mail, Calendar, FileText, Plus, Edit } from "lucide-react";
import type { PatientData } from "./PatientModal";

interface PatientHistoryItem {
  id: string;
  reference_code: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service_name: string;
}

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: (PatientData & { created_at?: string }) | null;
  appointments?: PatientHistoryItem[];
  onBookAppointment: (patientId: string) => void;
  onEditPatient: (patient: PatientData) => void;
}

export default function PatientDetailModal({
  isOpen,
  onClose,
  patient,
  appointments = [],
  onBookAppointment,
  onEditPatient,
}: PatientDetailModalProps) {
  if (!patient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={patient.full_name}
      description={`Patient record details & visit timeline`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Contact Info Header */}
        <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg">
                {patient.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {patient.full_name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                  <span className="capitalize">{patient.gender || "Undisclosed"}</span>
                  {patient.date_of_birth && <span>DOB: {patient.date_of_birth}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditPatient(patient);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Info</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (patient.id) {
                    onClose();
                    onBookAppointment(patient.id);
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Booking</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-teal-600" />
              <a href={`tel:${patient.phone}`} className="font-mono hover:underline">
                {patient.phone}
              </a>
            </div>
            {patient.email ? (
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-teal-600" />
                <span>{patient.email}</span>
              </div>
            ) : (
              <span className="text-slate-400">No email registered</span>
            )}
          </div>
        </div>

        {/* Clinical Notes */}
        {patient.notes && (
          <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs space-y-1">
            <div className="font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Medical Notes & History</span>
            </div>
            <p className="text-slate-700 text-sm">{patient.notes}</p>
          </div>
        )}

        {/* Appointment Timeline */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Appointment History ({appointments.length})
            </h4>
          </div>

          {appointments.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
              No appointments recorded for this patient yet.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="flex items-center justify-between p-3 border border-slate-100 hover:border-slate-200 rounded-xl bg-slate-50/50 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-900">
                      {appt.service_name}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appt.appointment_date} at {appt.appointment_time}</span>
                      <span className="font-mono text-slate-400">({appt.reference_code})</span>
                    </div>
                  </div>
                  <div>
                    <StatusBadge status={appt.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
