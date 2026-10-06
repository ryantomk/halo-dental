/**
 * Booking Slot Calculator (Client-Safe)
 *
 * WHAT THIS FILE DOES:
 * Generates formatted time slot strings between clinic opening and closing hours.
 *
 * WHY THIS FILE EXISTS:
 * Pure utility function free of server-side dependencies (next/headers, Supabase)
 * so it can be safely imported by Client Components ("use client") like BookingForm.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * - components/booking/BookingForm.tsx
 * - lib/booking/availability.ts
 *
 * SAFE TO CHANGE:
 * Default slot interval (e.g., 30 vs 45 minutes).
 *
 * BE CAREFUL:
 * Do not import server-only modules into this file.
 */

import { CLINIC_OPENING_TIME, CLINIC_CLOSING_TIME } from "@/lib/validations/bookingSchema";

export interface TimeSlot {
  time: string; // "09:00"
  available: boolean;
  reason?: string;
}

/**
 * Generates an array of formatted time slots between start and end hours.
 *
 * Input:
 * - startTime: e.g. "09:00"
 * - endTime: e.g. "20:00"
 * - intervalMinutes: e.g. 30
 *
 * Returns:
 * - Array of string times ["09:00", "09:30", "10:00", ...]
 */
export function generateTimeSlots(
  startTime = CLINIC_OPENING_TIME,
  endTime = CLINIC_CLOSING_TIME,
  intervalMinutes = 30
): string[] {
  const slots: string[] = [];
  const [startHour = 9, startMin = 0] = startTime.split(":").map(Number);
  const [endHour = 20, endMin = 0] = endTime.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const finishMinutes = endHour * 60 + endMin;

  while (currentMinutes + intervalMinutes <= finishMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    const formatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    slots.push(formatted);
    currentMinutes += intervalMinutes;
  }

  return slots;
}
