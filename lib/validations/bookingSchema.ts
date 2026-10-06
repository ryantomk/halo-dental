/**
 * Booking Validation Schemas (Zod)
 *
 * WHAT THIS FILE DOES:
 * Defines validation rules and types for public appointment booking submissions.
 *
 * WHY THIS FILE EXISTS:
 * Ensures patient inputs (phone format, appointment dates, clinic hours) are strictly validated
 * both on the client-side for user feedback and on the server-side before database operations.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * - components/booking/BookingForm.tsx (client form validation)
 * - app/actions/booking.ts (server-side action validation)
 *
 * SAFE TO CHANGE:
 * Error messages, maximum note length, honeypot field name.
 *
 * BE CAREFUL:
 * Changing field names or relaxing date/time constraints can cause invalid database records.
 */

import { z } from "zod";

export const CLINIC_OPENING_TIME = "09:00";
export const CLINIC_CLOSING_TIME = "20:00";

// Regex for YYYY-MM-DD format
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
// Regex for HH:mm 24-hour time format
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
// Clean phone regex accepting optional + followed by digits, spaces, or hyphens (min 7 digits)
const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;

export const bookingSchema = z.object({
  serviceId: z
    .string()
    .uuid({ message: "Please select a valid dental service." }),

  preferredDate: z
    .string()
    .regex(dateRegex, { message: "Date must be in YYYY-MM-DD format." })
    .refine((val) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const parts = val.split("-").map(Number);
      const year = parts[0] ?? 1970;
      const month = parts[1] ?? 1;
      const day = parts[2] ?? 1;
      const inputDate = new Date(year, month - 1, day);
      return !isNaN(inputDate.getTime()) && inputDate >= today;
    }, { message: "Appointment date cannot be in the past." })
    .refine((val) => {
      const parts = val.split("-").map(Number);
      const year = parts[0] ?? 1970;
      const month = parts[1] ?? 1;
      const day = parts[2] ?? 1;
      const inputDate = new Date(year, month - 1, day);
      // Clinic closed on Sundays (day 0)
      return inputDate.getDay() !== 0;
    }, { message: "The clinic is closed on Sundays. Please select Monday to Saturday." }),

  preferredTime: z
    .string()
    .regex(timeRegex, { message: "Time must be in HH:mm format." })
    .refine((val) => {
      return val >= CLINIC_OPENING_TIME && val < CLINIC_CLOSING_TIME;
    }, {
      message: `Appointment time must be between ${CLINIC_OPENING_TIME} and ${CLINIC_CLOSING_TIME}.`,
    }),

  patientName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters." })
    .max(120, { message: "Name must not exceed 120 characters." }),

  patientPhone: z
    .string()
    .trim()
    .regex(phoneRegex, { message: "Please provide a valid contact phone number." })
    .min(7, { message: "Phone number is too short." })
    .max(20, { message: "Phone number is too long." }),

  patientEmail: z
    .string()
    .trim()
    .email({ message: "Please provide a valid email address." })
    .optional()
    .or(z.literal("")),

  note: z
    .string()
    .trim()
    .max(500, { message: "Notes cannot exceed 500 characters." })
    .optional()
    .or(z.literal("")),

  // Bot-deterrent honeypot: hidden input that automated spam bots fill out
  honeypot: z
    .string()
    .max(0, { message: "Bot submission detected." })
    .optional()
    .or(z.literal("")),
});

export type BookingInput = z.infer<typeof bookingSchema>;

export interface BookingResult {
  success: boolean;
  referenceCode?: string;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  appointmentDetails?: {
    serviceName?: string;
    appointmentDate: string;
    appointmentTime: string;
    patientName: string;
    patientPhone: string;
  };
}
