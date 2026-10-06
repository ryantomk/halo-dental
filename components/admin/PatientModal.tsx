"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { createPatientAction, updatePatientAction } from "@/app/actions/admin";
import { type PatientInput } from "@/lib/validations/adminSchema";
import { AlertCircle, Loader2 } from "lucide-react";

export interface PatientData {
  id?: string;
  full_name: string;
  phone: string;
  email?: string | null;
  date_of_birth?: string | null;
  gender?: "male" | "female" | "other" | "undisclosed" | null;
  notes?: string | null;
}

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: PatientData | null;
  onSuccess?: () => void;
}

export default function PatientModal({
  isOpen,
  onClose,
  patient,
  onSuccess,
}: PatientModalProps) {
  const isEditing = !!patient?.id;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "undisclosed">("undisclosed");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (patient) {
      setFullName(patient.full_name || "");
      setPhone(patient.phone || "");
      setEmail(patient.email || "");
      setDateOfBirth(patient.date_of_birth || "");
      setGender(patient.gender || "undisclosed");
      setNotes(patient.notes || "");
    } else {
      setFullName("");
      setPhone("");
      setEmail("");
      setDateOfBirth("");
      setGender("undisclosed");
      setNotes("");
    }
    setErrorMessage("");
  }, [patient, isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    const payload: PatientInput = {
      fullName,
      phone,
      email: email.trim() || undefined,
      dateOfBirth: dateOfBirth || undefined,
      gender,
      notes: notes.trim() || undefined,
    };

    try {
      if (isEditing && patient?.id) {
        const res = await updatePatientAction(patient.id, payload);
        if (!res.success) {
          setErrorMessage(res.error || "Failed to update patient.");
          setSubmitting(false);
          return;
        }
      } else {
        const res = await createPatientAction(payload);
        if (!res.success) {
          setErrorMessage(res.error || "Failed to create patient.");
          setSubmitting(false);
          return;
        }
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to save patient record.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Patient Record" : "Add New Patient"}
      description={
        isEditing
          ? "Update contact info and clinical background notes."
          : "Register a patient for appointment scheduling and history tracking."
      }
      maxWidth="lg"
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
            Full Name *
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Anjali Nair"
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98470 12345"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Email Address (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient@example.com"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Date of Birth (optional)
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Gender (optional)
            </label>
            <select
              value={gender}
              onChange={(e: any) => setGender(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
            >
              <option value="undisclosed">Undisclosed / Prefer not to say</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
            Clinical Notes / Allergies / Remarks
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Penicillin allergy, wears retainers, prefers evening appointments..."
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
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
            <span>{isEditing ? "Save Changes" : "Create Patient"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
