"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { createAdminAppointmentAction, createPatientAction } from "@/app/actions/admin";
import { getAvailableSlots, type ServiceOption } from "@/app/actions/booking";
import { type TimeSlot } from "@/lib/booking/availability";
import { Calendar, Clock, User, Phone, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PatientOption {
  id: string;
  full_name: string;
  phone: string;
  email?: string | null;
}

interface DoctorOption {
  id: string;
  name: string;
  specialization?: string;
}

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: PatientOption[];
  services: ServiceOption[];
  doctors?: DoctorOption[];
  onSuccess?: () => void;
  initialPatientId?: string;
}

export default function ManualBookingModal({
  isOpen,
  onClose,
  patients,
  services,
  doctors = [],
  onSuccess,
  initialPatientId,
}: ManualBookingModalProps) {
  // Mode: select existing patient vs inline new patient
  const [patientMode, setPatientMode] = useState<"existing" | "new">(
    initialPatientId ? "existing" : "existing"
  );

  // Existing patient state
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId || "");
  const [patientSearch, setPatientSearch] = useState("");

  // New patient state
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientPhone, setNewPatientPhone] = useState("");
  const [newPatientEmail, setNewPatientEmail] = useState("");

  // Appointment parameters
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");
  const [selectedDoctorId, setSelectedDoctorId] = useState(doctors[0]?.id || "");

  // Default to tomorrow or today if not Sunday
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState("");
  const [source, setSource] = useState<"phone" | "walk_in" | "whatsapp" | "website">("phone");
  const [adminNotes, setAdminNotes] = useState("");

  // Slots state
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSundayClosed, setIsSundayClosed] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successCode, setSuccessCode] = useState("");

  // Sync initial patient if provided
  useEffect(() => {
    if (initialPatientId) {
      setSelectedPatientId(initialPatientId);
      setPatientMode("existing");
    }
  }, [initialPatientId]);

  // Load available slots whenever date or doctor changes
  useEffect(() => {
    if (!selectedDate || !isOpen) return;

    let isMounted = true;
    setLoadingSlots(true);
    setErrorMessage("");
    setSelectedTime("");

    getAvailableSlots(selectedDate, selectedDoctorId || null)
      .then((res) => {
        if (!isMounted) return;
        setLoadingSlots(false);
        if (res.success) {
          setSlots(res.slots);
          setIsSundayClosed(!!res.isClosed);
        } else {
          setErrorMessage(res.error || "Unable to check available slots.");
        }
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadingSlots(false);
        setErrorMessage("Error communicating with slot server.");
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, selectedDoctorId, isOpen]);

  // Filtered patients for dropdown search
  const filteredPatients = patients.filter((p) => {
    if (!patientSearch.trim()) return true;
    const q = patientSearch.toLowerCase();
    return p.full_name.toLowerCase().includes(q) || p.phone.includes(q);
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    let finalPatientId = selectedPatientId;

    setSubmitting(true);

    try {
      // 1. If in new patient mode, create patient first
      if (patientMode === "new") {
        const createRes = await createPatientAction({
          fullName: newPatientName,
          phone: newPatientPhone,
          email: newPatientEmail,
        });

        if (!createRes.success || !createRes.patient) {
          setErrorMessage(createRes.error || "Failed to create patient.");
          setSubmitting(false);
          return;
        }
        finalPatientId = createRes.patient.id;
      }

      if (!finalPatientId) {
        setErrorMessage("Please select or enter a patient.");
        setSubmitting(false);
        return;
      }

      if (!selectedServiceId) {
        setErrorMessage("Please select a dental service.");
        setSubmitting(false);
        return;
      }

      if (!selectedDate) {
        setErrorMessage("Please select an appointment date.");
        setSubmitting(false);
        return;
      }

      if (!selectedTime) {
        setErrorMessage("Please choose an available time slot.");
        setSubmitting(false);
        return;
      }

      // 2. Insert appointment with strict server-side collision validation
      const result = await createAdminAppointmentAction({
        patientId: finalPatientId,
        serviceId: selectedServiceId,
        doctorId: selectedDoctorId || null,
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        source,
        adminNotes,
      });

      if (!result.success) {
        setErrorMessage(
          result.error ||
            "This time slot is no longer available. Please choose another time."
        );
        // Refresh slots to show newly occupied slot
        const refreshed = await getAvailableSlots(selectedDate, selectedDoctorId || null);
        if (refreshed.success) setSlots(refreshed.slots);
        setSubmitting(false);
        return;
      }

      setSuccessCode(result.referenceCode || "Confirmed");
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setSuccessCode("");
    setErrorMessage("");
    setSelectedTime("");
    setAdminNotes("");
    setNewPatientName("");
    setNewPatientPhone("");
    setNewPatientEmail("");
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title="Create Manual Appointment"
      description="Book an appointment for a walk-in, phone caller, or WhatsApp inquiry."
      maxWidth="xl"
    >
      {successCode ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Appointment Created!</h3>
          <p className="text-sm text-slate-600">
            The appointment has been confirmed in the schedule.
          </p>
          <div className="inline-block px-4 py-2 bg-slate-100 rounded-xl font-mono font-bold text-slate-800 text-base border border-slate-200">
            {successCode}
          </div>
          <div className="pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
              <div>{errorMessage}</div>
            </div>
          )}

          {/* Patient Selection Segment */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
              1. Patient
            </label>
            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-100/80">
              <button
                type="button"
                onClick={() => setPatientMode("existing")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  patientMode === "existing"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Existing Patient ({patients.length})
              </button>
              <button
                type="button"
                onClick={() => setPatientMode("new")}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  patientMode === "new"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                + New Patient (Create On-the-Fly)
              </button>
            </div>

            {patientMode === "existing" ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Search patient by name or phone..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                >
                  <option value="">-- Choose patient --</option>
                  {filteredPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      placeholder="+91 98470 12345"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      value={newPatientEmail}
                      onChange={(e) => setNewPatientEmail(e.target.value)}
                      placeholder="patient@example.com"
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Service & Doctor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                2. Dental Service *
              </label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.durationMinutes || 30} min)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Assigned Doctor
              </label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              >
                <option value="">Any Available Specialist / Dr. Haseeb</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} {d.specialization ? `(${d.specialization})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date & Source */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                3. Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={today}
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Booking Source
              </label>
              <select
                value={source}
                onChange={(e: any) => setSource(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="phone">Phone Call</option>
                <option value="walk_in">Walk-in at Clinic</option>
                <option value="whatsapp">WhatsApp Outreach</option>
                <option value="website">Website Direct</option>
              </select>
            </div>
          </div>

          {/* Time Slot Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                4. Available Time Slot *
              </label>
              {loadingSlots && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-600" />
                  <span>Checking live schedule...</span>
                </div>
              )}
            </div>

            {isSundayClosed ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
                Clinic is closed on Sundays. Please select a date from Monday to Saturday.
              </div>
            ) : slots.length === 0 && !loadingSlots ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm text-center">
                Select a valid operating date to view available appointment slots.
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

          {/* Admin Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Internal Admin Notes (optional)
            </label>
            <textarea
              rows={2}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="e.g. Referred by Dr. Ali, requires scaling before alignment scan..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedTime || isSundayClosed}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-sm transition-colors"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Confirm & Book Appointment</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
