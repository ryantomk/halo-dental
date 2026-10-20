"use server";

/**
 * Booking Server Action
 *
 * WHAT THIS FILE DOES:
 * Handles secure, server-side appointment creation and slot booking for patients.
 *
 * WHY THIS FILE EXISTS:
 * Protects database integrity by:
 * 1. Running Zod validation on all input data on the server
 * 2. Enforcing bot-prevention checks (honeypot)
 * 3. Verifying appointment slot availability server-side to prevent double-booking
 * 4. Upserting the patient record and inserting a pending appointment into Supabase
 *
 * WHAT PART OF THE WEBSITE USES IT:
 * Invoked by components/booking/BookingForm.tsx and public booking routes.
 *
 * SAFE TO CHANGE:
 * Success messages, user-facing error strings, reference code prefix.
 *
 * BE CAREFUL:
 * Never bypass checkSlotAvailable or remove Zod validation.
 */

import { bookingSchema, type BookingInput, type BookingResult } from "@/lib/validations/bookingSchema";
import { checkSlotAvailable, getDailySlotAvailability, type TimeSlot } from "@/lib/booking/availability";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/security/rateLimiter";

export interface ServiceOption {
  id: string;
  name: string;
  category?: string;
  durationMinutes?: number;
}

/**
 * Retrieves active services from Supabase ordered by sort_order.
 * Displays English or Malayalam name based on requested locale.
 */
export async function getActiveServices(locale: string = "en"): Promise<{
  success: boolean;
  services: ServiceOption[];
  error?: string;
}> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("services")
      .select("id, name_en, name_ml, category, duration_minutes, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[booking] Error fetching active services:", error.message);
      return {
        success: false,
        services: [],
        error: "Unable to load services at this time. Please contact our reception.",
      };
    }

    const services: ServiceOption[] = (data || []).map((s) => ({
      id: s.id,
      name: locale === "ml" && s.name_ml ? s.name_ml : s.name_en,
      category: s.category,
      durationMinutes: s.duration_minutes,
    }));

    return {
      success: true,
      services,
    };
  } catch (err) {
    console.error("[booking] Unexpected error fetching services:", err);
    return {
      success: false,
      services: [],
      error: "Unexpected error loading services.",
    };
  }
}

/**
 * Retrieves slot availability for a specified date and optional doctor.
 */
export async function getAvailableSlots(
  date: string,
  doctorId?: string | null
): Promise<{
  success: boolean;
  slots: TimeSlot[];
  isClosed?: boolean;
  reason?: string;
  error?: string;
}> {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return {
      success: false,
      slots: [],
      error: "Invalid date format. Please select a valid date (YYYY-MM-DD).",
    };
  }

  try {
    const slots = await getDailySlotAvailability(date, doctorId);
    const isClosed = slots.length > 0 && slots.every((s) => !s.available && s.reason?.toLowerCase().includes("sunday"));
    return {
      success: true,
      slots,
      isClosed,
      reason: isClosed ? "Halo Dental is closed on Sundays. Please select Monday to Saturday." : undefined,
    };
  } catch (err) {
    console.error("[booking] Error checking slots for date", date, err);
    return {
      success: false,
      slots: [],
      error: "Unable to verify schedule availability. Please try again or call the clinic.",
    };
  }
}

/**
 * Generates an alphanumeric, human-friendly appointment reference code.
 * Example: "HD-2026-X9K2"
 */
function generateReferenceCode(): string {
  const year = new Date().getFullYear();
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HD-${year}-${randomChars}`;
}

/**
 * Creates an appointment booking.
 *
 * Input:
 * - rawInput: unvalidated form values from client
 *
 * Returns:
 * - BookingResult: { success, referenceCode?, message?, error?, fieldErrors?, appointmentDetails? }
 */
export async function createBooking(rawInput: BookingInput): Promise<BookingResult> {
  // 1. Server-side validation via Zod
  const validationResult = bookingSchema.safeParse(rawInput);
  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      error: "Please correct the errors in the booking form.",
      fieldErrors,
    };
  }

  const {
    serviceId,
    preferredDate,
    preferredTime,
    patientName,
    patientPhone,
    patientEmail,
    note,
    honeypot,
  } = validationResult.data;

  // 2. Bot Deterrent Check
  if (honeypot && honeypot.length > 0) {
    // Silently reject bot submissions without providing feedback
    return {
      success: false,
      error: "Invalid submission.",
    };
  }

  // 3. Sliding-window rate limiting: max 5 bookings per 10 minutes per phone
  const cleanPhone = patientPhone.replace(/\D/g, "");
  const rateLimit = checkRateLimit(`booking:${cleanPhone}`, 5, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many booking requests from this phone number. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again or call our clinic directly.`,
    };
  }

  // 4. Server-side Slot Availability Verification (Race condition prevention)
  const isAvailable = await checkSlotAvailable(preferredDate, preferredTime);
  if (!isAvailable) {
    return {
      success: false,
      error: "This appointment slot was just reserved by another patient. Please choose another time.",
    };
  }

  const supabase = createAdminClient();
  const referenceCode = generateReferenceCode();

  // If Supabase credentials are not configured (local development / preview mode)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      success: true,
      referenceCode,
      message: "Appointment request received (preview mode). Clinic staff will contact you to confirm.",
      appointmentDetails: {
        appointmentDate: preferredDate,
        appointmentTime: preferredTime,
        patientName,
        patientPhone,
      },
    };
  }

  try {
    // 5. Find or create patient record by phone number
    let patientId: string | null = null;

    const { data: existingPatient, error: patientLookupError } = await supabase
      .from("patients")
      .select("id")
      .eq("phone", patientPhone)
      .maybeSingle();

    if (patientLookupError && patientLookupError.code !== "PGRST116") {
      console.error("[booking] Patient lookup error:", patientLookupError.message);
    }

    if (existingPatient) {
      patientId = existingPatient.id;
    } else {
      const { data: newPatient, error: patientCreateError } = await supabase
        .from("patients")
        .insert({
          full_name: patientName,
          phone: patientPhone,
          email: patientEmail || null,
        })
        .select("id")
        .single();

      if (patientCreateError || !newPatient) {
        console.error("[booking] Error creating patient record:", patientCreateError?.message);
        return {
          success: false,
          error: "Unable to process patient details. Please contact the clinic directly.",
        };
      }
      patientId = newPatient.id;
    }

    // 6. Idempotency Check: Prevent duplicate bookings if submitted repeatedly
    const { data: duplicateAppt } = await supabase
      .from("appointments")
      .select("id, reference_code")
      .eq("patient_id", patientId)
      .eq("appointment_date", preferredDate)
      .eq("appointment_time", preferredTime)
      .neq("status", "cancelled")
      .maybeSingle();

    // Lookup service details to get duration and human-readable name
    const { data: serviceRow } = await supabase
      .from("services")
      .select("name_en, duration_minutes")
      .eq("id", serviceId)
      .maybeSingle();

    const durationMinutes = serviceRow?.duration_minutes || 30;
    const serviceName = serviceRow?.name_en || "Dental Service";

    if (duplicateAppt) {
      return {
        success: true,
        referenceCode: duplicateAppt.reference_code,
        message: `Your appointment request (${duplicateAppt.reference_code}) has already been recorded! Our team will contact you shortly to confirm.`,
        appointmentDetails: {
          serviceName,
          appointmentDate: preferredDate,
          appointmentTime: preferredTime,
          patientName,
          patientPhone,
        },
      };
    }

    // Lookup primary active clinic ID
    const { data: clinicRow } = await supabase
      .from("clinics")
      .select("id")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    const clinicId = clinicRow?.id || null;

    // 5. Insert appointment with 'pending' status
    const { error: appointmentError } = await supabase
      .from("appointments")
      .insert({
        reference_code: referenceCode,
        patient_id: patientId,
        service_id: serviceId,
        clinic_id: clinicId,
        appointment_date: preferredDate,
        appointment_time: preferredTime,
        duration_minutes: durationMinutes,
        status: "pending",
        patient_notes: note || null,
        source: "website",
      });

    if (appointmentError) {
      console.error("[booking] Error creating appointment:", appointmentError.message);
      return {
        success: false,
        error: "Unable to complete booking. Please try again or call the clinic.",
      };
    }

    return {
      success: true,
      referenceCode,
      message: `Your appointment request (${referenceCode}) has been received! Our team will contact you shortly to confirm.`,
      appointmentDetails: {
        serviceName,
        appointmentDate: preferredDate,
        appointmentTime: preferredTime,
        patientName,
        patientPhone,
      },
    };
  } catch (err) {
    console.error("[booking] Unexpected error during booking transaction:", err);
    return {
      success: false,
      error: "An unexpected error occurred while booking. Please try again later.",
    };
  }
}
