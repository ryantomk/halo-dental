"use client";

import { useState } from "react";
import PatientModal, { type PatientData } from "./PatientModal";
import PatientDetailModal from "./PatientDetailModal";
import ManualBookingModal from "./ManualBookingModal";
import { deletePatientAction } from "@/app/actions/admin";
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  Eye,
  Edit,
  Trash2,
  CalendarPlus,
  Loader2,
} from "lucide-react";
import type { ServiceOption } from "@/app/actions/booking";

interface PatientWithStats extends PatientData {
  id: string;
  created_at: string;
  appointments: {
    id: string;
    reference_code: string;
    appointment_date: string;
    appointment_time: string;
    status: string;
    service_name: string;
  }[];
}

interface PatientsClientProps {
  initialPatients: PatientWithStats[];
  services: ServiceOption[];
  doctors: { id: string; name: string; specialization?: string }[];
}

export default function PatientsClient({
  initialPatients,
  services,
  doctors,
}: PatientsClientProps) {
  const [patients, setPatients] = useState<PatientWithStats[]>(initialPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientForView, setSelectedPatientForView] = useState<PatientWithStats | null>(null);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<PatientData | null>(null);
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false);

  // Manual booking triggered for specific patient
  const [bookingPatientId, setBookingPatientId] = useState<string | null>(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const filteredPatients = patients.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.full_name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q))
    );
  });

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete patient "${name}"? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoadingId(id);
    try {
      const res = await deletePatientAction(id);
      if (!res.success) {
        alert(res.error || "Cannot delete patient.");
      } else {
        window.location.reload();
      }
    } finally {
      setDeleteLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Patient Registry ({patients.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Directory of registered patients, clinical history, and contact profiles
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddPatientOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-semibold rounded-xl text-xs transition-colors shadow-xs self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patients by full name, phone number, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No patient records found matching &quot;{searchQuery}&quot;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Patient Name</th>
                  <th className="px-4 py-3.5">Contact Phone</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">Visits / Bookings</th>
                  <th className="px-4 py-3.5">Registered Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-slate-900">{patient.full_name}</div>
                      {patient.gender && (
                        <div className="text-[11px] text-slate-400 capitalize">
                          {patient.gender}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-700">
                      <a href={`tel:${patient.phone}`} className="hover:text-teal-700">
                        {patient.phone}
                      </a>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">
                      {patient.email || "—"}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {patient.appointments.length} visit{patient.appointments.length === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">
                      {new Date(patient.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedPatientForView(patient)}
                          className="p-1.5 text-slate-600 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View Patient Details & History"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setBookingPatientId(patient.id);
                          }}
                          className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Book Appointment for Patient"
                        >
                          <CalendarPlus className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedPatientForEdit(patient)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Patient Info"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          disabled={deleteLoadingId === patient.id}
                          onClick={() => handleDelete(patient.id, patient.full_name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Patient Record"
                        >
                          {deleteLoadingId === patient.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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
      <PatientDetailModal
        isOpen={!!selectedPatientForView}
        onClose={() => setSelectedPatientForView(null)}
        patient={selectedPatientForView}
        appointments={selectedPatientForView?.appointments || []}
        onBookAppointment={(patientId) => {
          setBookingPatientId(patientId);
        }}
        onEditPatient={(p) => {
          setSelectedPatientForEdit(p);
        }}
      />

      <PatientModal
        isOpen={isAddPatientOpen || !!selectedPatientForEdit}
        onClose={() => {
          setIsAddPatientOpen(false);
          setSelectedPatientForEdit(null);
        }}
        patient={selectedPatientForEdit}
        onSuccess={() => window.location.reload()}
      />

      <ManualBookingModal
        isOpen={!!bookingPatientId}
        onClose={() => setBookingPatientId(null)}
        initialPatientId={bookingPatientId || undefined}
        patients={patients.map((p) => ({
          id: p.id,
          full_name: p.full_name,
          phone: p.phone,
          email: p.email,
        }))}
        services={services}
        doctors={doctors}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
}
