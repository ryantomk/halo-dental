/**
 * HALO DENTAL — WhatsApp Messaging Utilities
 *
 * Provides phone number normalization, official click-to-chat URL generation,
 * and prewritten clinical appointment templates for authorized staff use.
 *
 * Complies with ITU E.164 standards and WhatsApp Click-to-Chat protocol (wa.me).
 * Does not require external APIs or third-party tracking.
 */

export type WhatsAppTemplateType =
  | "confirmation"
  | "reminder"
  | "reschedule"
  | "cancellation";

export interface WhatsAppAppointmentData {
  patientName: string;
  phone: string;
  appointmentDate: string;
  appointmentTime: string;
  referenceCode: string;
  clinicName?: string;
}

export interface NormalizedPhoneResult {
  isValid: boolean;
  normalized: string; // Digits only with international country code, suitable for wa.me
  formatted: string; // Human-friendly display, e.g. "+91 98460 12345"
  error?: string;
}

/**
 * Normalizes patient contact numbers into valid international format for WhatsApp.
 * Handles Indian domestic 10-digit numbers, domestic trunk prefixes (0),
 * and existing international formats (e.g. GCC/UK numbers popular with clinic visitors).
 */
export function normalizePhoneNumber(rawPhone?: string | null): NormalizedPhoneResult {
  if (!rawPhone || typeof rawPhone !== "string") {
    return {
      isValid: false,
      normalized: "",
      formatted: "",
      error: "Phone number is missing or empty.",
    };
  }

  // Strip all non-digit characters
  let digits = rawPhone.replace(/\D/g, "");

  if (!digits) {
    return {
      isValid: false,
      normalized: "",
      formatted: "",
      error: "Phone number contains no numeric digits.",
    };
  }

  // Handle international dialing prefix '00'
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  // Handle single leading 0 (domestic trunk prefix in India/UK, e.g. 09846012345)
  if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }

  // If 10 digits starting with 6, 7, 8, or 9: Standard Indian domestic mobile
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    digits = `91${digits}`;
  }

  // Validate E.164 length (between 10 and 15 digits)
  if (digits.length < 10) {
    return {
      isValid: false,
      normalized: digits,
      formatted: rawPhone,
      error: "Phone number is too short to be a valid international number.",
    };
  }

  if (digits.length > 15) {
    return {
      isValid: false,
      normalized: digits,
      formatted: rawPhone,
      error: "Phone number exceeds maximum international standard length (15 digits).",
    };
  }

  // Generate clean display format
  let formatted = `+${digits}`;
  if (digits.startsWith("91") && digits.length === 12) {
    formatted = `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }

  return {
    isValid: true,
    normalized: digits,
    formatted,
  };
}

/**
 * Formats ISO date (YYYY-MM-DD) into readable clinical format (e.g., "Monday, 27 October 2026").
 */
export function formatAppointmentDate(dateStr: string): string {
  if (!dateStr) return "Scheduled Date";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    if (!year || !month || !day) return dateStr;
    const d = new Date(year, month - 1, day);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Formats 24h time string (HH:mm) into 12h format (e.g., "10:30 AM").
 */
export function formatAppointmentTime(timeStr: string): string {
  if (!timeStr) return "Scheduled Time";
  try {
    const parts = timeStr.split(":");
    const hourStr = parts[0];
    const minuteStr = parts[1];
    if (!hourStr || !minuteStr) return timeStr;
    const hour = parseInt(hourStr, 10);
    if (isNaN(hour)) return timeStr;
    const period = hour >= 12 ? "PM" : "AM";
    const h12 = hour % 12 || 12;
    return `${h12}:${minuteStr} ${period}`;
  } catch {
    return timeStr;
  }
}

const DEFAULT_CLINIC_NAME = "Halo Dental Cosmetic & Orthodontic Centre";

/**
 * Template A: Appointment Confirmation
 * Used strictly when an appointment has been confirmed by authorized staff.
 */
export function getConfirmationMessage(data: WhatsAppAppointmentData): string {
  const patient = data.patientName?.trim() || "Patient";
  const date = formatAppointmentDate(data.appointmentDate);
  const time = formatAppointmentTime(data.appointmentTime);
  const ref = data.referenceCode || "N/A";
  const clinic = data.clinicName || DEFAULT_CLINIC_NAME;

  return [
    `Hello ${patient},`,
    "",
    `Your appointment at ${clinic} has been confirmed.`,
    "",
    `Date: ${date}`,
    `Time: ${time}`,
    `Booking reference: ${ref}`,
    "",
    "Please arrive a few minutes before your appointment.",
    "If you need to reschedule, please contact our clinic.",
    "",
    "Thank you,",
    clinic,
  ].join("\n");
}

/**
 * Template B: Appointment Reminder
 * Staff-initiated friendly reminder for confirmed appointments.
 */
export function getReminderMessage(data: WhatsAppAppointmentData): string {
  const patient = data.patientName?.trim() || "Patient";
  const date = formatAppointmentDate(data.appointmentDate);
  const time = formatAppointmentTime(data.appointmentTime);
  const ref = data.referenceCode || "N/A";
  const clinic = data.clinicName || DEFAULT_CLINIC_NAME;

  return [
    `Hello ${patient},`,
    "",
    `This is a friendly reminder about your appointment at ${clinic}.`,
    "",
    `Date: ${date}`,
    `Time: ${time}`,
    `Booking reference: ${ref}`,
    "",
    "Please contact us if you need assistance.",
    "",
    "Thank you,",
    clinic,
  ].join("\n");
}

/**
 * Template C: Rescheduled Appointment
 * Used when appointment schedule is updated to notify patient of new date and time.
 */
export function getRescheduleMessage(data: WhatsAppAppointmentData): string {
  const patient = data.patientName?.trim() || "Patient";
  const date = formatAppointmentDate(data.appointmentDate);
  const time = formatAppointmentTime(data.appointmentTime);
  const ref = data.referenceCode || "N/A";
  const clinic = data.clinicName || DEFAULT_CLINIC_NAME;

  return [
    `Hello ${patient},`,
    "",
    `Your appointment at ${clinic} has been rescheduled.`,
    "",
    `New date: ${date}`,
    `New time: ${time}`,
    `Booking reference: ${ref}`,
    "",
    "Please contact our clinic if you have any questions.",
    "",
    "Thank you,",
    clinic,
  ].join("\n");
}

/**
 * Template D: Appointment Cancellation
 * Used when a cancellation has successfully been recorded in the database.
 */
export function getCancellationMessage(data: WhatsAppAppointmentData): string {
  const patient = data.patientName?.trim() || "Patient";
  const ref = data.referenceCode || "N/A";
  const clinic = data.clinicName || DEFAULT_CLINIC_NAME;

  return [
    `Hello ${patient},`,
    "",
    `Your appointment at ${clinic} has been cancelled.`,
    "",
    `Booking reference: ${ref}`,
    "",
    "Please contact our clinic if you would like to arrange another appointment.",
    "",
    "Thank you,",
    clinic,
  ].join("\n");
}

/**
 * Master dispatcher for WhatsApp message templates
 */
export function buildWhatsAppMessage(
  template: WhatsAppTemplateType,
  data: WhatsAppAppointmentData
): string {
  switch (template) {
    case "confirmation":
      return getConfirmationMessage(data);
    case "reminder":
      return getReminderMessage(data);
    case "reschedule":
      return getRescheduleMessage(data);
    case "cancellation":
      return getCancellationMessage(data);
    default:
      return getConfirmationMessage(data);
  }
}

/**
 * Generates official click-to-chat URL (wa.me) with fully encoded prewritten message.
 */
export function generateWhatsAppUrl(
  rawPhone: string,
  message: string
): {
  url: string;
  normalizedPhone: string;
  formattedPhone: string;
  isValid: boolean;
  error?: string;
} {
  const phoneResult = normalizePhoneNumber(rawPhone);

  if (!phoneResult.isValid) {
    return {
      url: "",
      normalizedPhone: phoneResult.normalized,
      formattedPhone: phoneResult.formatted,
      isValid: false,
      error: phoneResult.error,
    };
  }

  const encodedText = encodeURIComponent(message);
  const url = `https://wa.me/${phoneResult.normalized}?text=${encodedText}`;

  return {
    url,
    normalizedPhone: phoneResult.normalized,
    formattedPhone: phoneResult.formatted,
    isValid: true,
  };
}
