/**
 * Booking Slot Availability Engine
 *
 * WHAT THIS FILE DOES:
 * Computes available appointment slots for a given date and service by checking clinic hours,
 * doctor working schedules, existing confirmed/pending appointments, and active availability blocks.
 *
 * WHY THIS FILE EXISTS:
 * Ensures the website never double-books an appointment slot and enforces server-side
 * availability verification before inserting new bookings or admin reservations.
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * - components/booking/AvailabilityCalendar.tsx
 * - components/booking/BookingForm.tsx
 * - app/actions/booking.ts (Public Server Action)
 * - app/actions/admin.ts (Admin Server Actions)
 * - app/admin/availability/page.tsx (Admin Availability Management)
 */

import { createAdminClient } from "@/lib/supabase/admin";
import { generateTimeSlots, type TimeSlot } from "./slots";
export { generateTimeSlots, type TimeSlot };

export interface AvailabilityBlock {
  id: string;
  clinic_id?: string | null;
  doctor_id?: string | null;
  block_date: string;
  start_time: string;
  end_time: string;
  reason?: string | null;
  created_by?: string | null;
  created_at?: string;
}

/**
 * Fetches all active availability blocks for a given date and optional doctor.
 * Tries the dedicated `availability_blocks` table first; falls back gracefully to `site_settings`
 * under key "availability_blocks".
 */
export async function getAvailabilityBlocksForDate(
  date: string,
  doctorId?: string | null
): Promise<AvailabilityBlock[]> {
  const supabase = createAdminClient();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return [];
  }

  try {
    // 1. Try dedicated table first
    const { data, error } = await supabase
      .from("availability_blocks" as any)
      .select("*")
      .eq("block_date", date);

    if (!error && Array.isArray(data)) {
      return (data as unknown as AvailabilityBlock[]).filter((b) => {
        if (!doctorId) return true;
        return !b.doctor_id || b.doctor_id === doctorId;
      });
    }

    // 2. Fallback to site_settings store if table is not yet migrated in Supabase
    const { data: settingData, error: settingErr } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "availability_blocks")
      .maybeSingle();

    if (!settingErr && settingData && Array.isArray(settingData.value)) {
      const allBlocks = settingData.value as unknown as AvailabilityBlock[];
      return allBlocks.filter((b) => {
        if (b.block_date !== date) return false;
        if (!doctorId) return true;
        return !b.doctor_id || b.doctor_id === doctorId;
      });
    }

    return [];
  } catch (err) {
    console.error("[availability] Error querying availability blocks:", err);
    return [];
  }
}

/**
 * Checks whether a specific date and time slot is available for booking.
 *
 * Input:
 * - date: YYYY-MM-DD
 * - time: HH:mm
 * - doctorId: optional UUID of assigned doctor
 * - excludeAppointmentId: optional UUID to ignore when rescheduling existing appointment
 *
 * Returns:
 * - true if slot is free
 * - false if slot is already occupied or blocked
 */
export async function checkSlotAvailable(
  date: string,
  time: string,
  doctorId?: string | null,
  excludeAppointmentId?: string | null
): Promise<boolean> {
  // Check if clinic is open on this day (Sunday = 0)
  const parts = date.split("-").map(Number);
  const year = parts[0] ?? 1970;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  if (dayOfWeek === 0) {
    return false;
  }

  const supabase = createAdminClient();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return true;
  }

  try {
    const formattedTime = time.length === 5 ? time : time.slice(0, 5);

    // 1. Check if slot falls into any active availability blocks
    const blocks = await getAvailabilityBlocksForDate(date, doctorId);
    for (const block of blocks) {
      const blockStart = block.start_time.slice(0, 5);
      const blockEnd = block.end_time.slice(0, 5);
      if (formattedTime >= blockStart && formattedTime < blockEnd) {
        return false;
      }
    }

    // 2. Check existing non-cancelled appointments
    let query = supabase
      .from("appointments")
      .select("id")
      .eq("appointment_date", date)
      .eq("appointment_time", formattedTime)
      .neq("status", "cancelled");

    if (doctorId) {
      query = query.eq("doctor_id", doctorId);
    }

    if (excludeAppointmentId) {
      query = query.neq("id", excludeAppointmentId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("[availability] Error checking slot availability:", error.message);
      return false;
    }

    return !data || data.length === 0;
  } catch (err) {
    console.error("[availability] Unexpected error checking slot:", err);
    return false;
  }
}

/**
 * Retrieves the full availability list of time slots for a given date.
 * Combines booked appointments and admin availability blocks.
 *
 * Input:
 * - date: YYYY-MM-DD
 * - doctorId: optional UUID
 * - excludeAppointmentId: optional UUID when rescheduling
 */
export async function getDailySlotAvailability(
  date: string,
  doctorId?: string | null,
  excludeAppointmentId?: string | null
): Promise<TimeSlot[]> {
  const allSlots = generateTimeSlots();

  // Check if clinic is open on this day (Sunday = 0)
  const parts = date.split("-").map(Number);
  const year = parts[0] ?? 1970;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const dayOfWeek = new Date(year, month - 1, day).getDay();
  if (dayOfWeek === 0) {
    return allSlots.map((time) => ({
      time,
      available: false,
      reason: "Clinic is closed on Sundays",
    }));
  }

  const supabase = createAdminClient();

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return allSlots.map((time) => ({ time, available: true }));
  }

  try {
    // 1. Fetch booked appointments
    let query = supabase
      .from("appointments")
      .select("id, appointment_time")
      .eq("appointment_date", date)
      .neq("status", "cancelled");

    if (doctorId) {
      query = query.eq("doctor_id", doctorId);
    }

    if (excludeAppointmentId) {
      query = query.neq("id", excludeAppointmentId);
    }

    const { data: bookedAppointments, error } = await query;

    if (error) {
      console.error("[availability] Error fetching appointments:", error.message);
      return allSlots.map((time) => ({ time, available: false, reason: "Unable to verify schedule" }));
    }

    const bookedList = (bookedAppointments as { appointment_time: string }[] | null) || [];
    const bookedTimes = new Set(bookedList.map((b) => b.appointment_time.slice(0, 5)));

    // 2. Fetch admin availability blocks
    const blocks = await getAvailabilityBlocksForDate(date, doctorId);

    return allSlots.map((time) => {
      // Check if booked by an appointment
      if (bookedTimes.has(time)) {
        return {
          time,
          available: false,
          reason: "Slot already reserved",
        };
      }

      // Check if blocked by admin / doctor leave
      for (const block of blocks) {
        const blockStart = block.start_time.slice(0, 5);
        const blockEnd = block.end_time.slice(0, 5);
        if (time >= blockStart && time < blockEnd) {
          return {
            time,
            available: false,
            reason: block.reason || "Time blocked by clinic",
          };
        }
      }

      return {
        time,
        available: true,
      };
    });
  } catch (err) {
    console.error("[availability] Unexpected error:", err);
    return allSlots.map((time) => ({ time, available: false, reason: "Error checking schedule" }));
  }
}
