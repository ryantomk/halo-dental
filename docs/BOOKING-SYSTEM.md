# Halo Dental Booking System

This document describes the end-to-end architecture, validation pipeline, database operations, and double-booking prevention mechanisms for Halo Dental.

> **STATUS: LIVE & VERIFIED (P1)**
> Verified on live Supabase instance with active slot conflict checks, patient upsert, reference generation, and status management.

---

## 1. Booking Flow Overview

```
[ Patient in Browser ]
         │
         ├── 1. Selects Service (UUID from `services`)
         ├── 2. Selects Date (YYYY-MM-DD, Mon-Sat)
         │       └─► `getDailySlotAvailability()` queries booked appointments
         ├── 3. Selects Available Time Slot (09:00 - 19:30)
         ├── 4. Fills Name, Phone, Email (optional), Notes (optional)
         │       └─► Client-side Zod validation (`bookingSchema.ts`)
         ▼
[ Server Action: `createBooking()` ] (`app/actions/booking.ts`)
         │
         ├── 5. Server-side Zod re-validation
         ├── 6. Honeypot check (bot-trap silently drops spam)
         ├── 7. Slot Collision Verification (`checkSlotAvailable()`)
         │       └─► Returns error if slot became occupied
         ├── 8. Patient Directory Upsert (`lib/supabase/admin.ts`)
         │       ├─► Check `patients` table for existing phone
         │       └─► If absent: insert new patient row
         ├── 9. Insert Appointment Record
         │       ├─► Reference Code generated: `HD-YYYY-XXXX`
         │       ├─► Initial status: `'pending'`
         │       ├─► Source: `'website'`
         │       └─► Duration: 30 minutes
         ▼
[ Supabase PostgreSQL ]
         │
         ├── Row stored in `appointments` with FKs to `patients`, `services`, `clinics`
         ▼
[ Client Confirmation UI ]
         │
         └─► Displays success message and reference code to patient
```

---

## 2. Double-Booking Protection

Double-booking prevention is enforced at multiple layers:

### A. Dynamic Client-Side Slot Filtering
When a user selects an appointment date:
1. `getDailySlotAvailability(date, doctorId)` in `lib/booking/availability.ts` generates all valid operating slots for the clinic (09:00 to 20:00 at 30-minute intervals).
2. It queries existing appointments for that date:
   ```sql
   SELECT appointment_time FROM appointments
   WHERE appointment_date = :date
     AND status != 'cancelled';
   ```
3. Any booked time slot is marked `available: false` with reason `"Slot already reserved"`.
4. The UI disables reserved slots so users cannot click them.

### B. Server-Side Pre-Insert Verification (Race Condition Mitigation)
Client-side disabling is insufficient because two users could load the page simultaneously. Therefore, the Server Action performs an immediate server-side collision check inside `createBooking()`:

```typescript
// app/actions/booking.ts (Step 3)
const isAvailable = await checkSlotAvailable(preferredDate, preferredTime);
if (!isAvailable) {
  return {
    success: false,
    error: "This appointment slot was just reserved by another patient. Please choose another time.",
  };
}
```

The `checkSlotAvailable()` function queries:
```typescript
const { data } = await supabase
  .from("appointments")
  .select("id")
  .eq("appointment_date", date)
  .eq("appointment_time", time)
  .neq("status", "cancelled");

return !data || data.length === 0;
```

---

## 3. Validation Pipeline (`lib/validations/bookingSchema.ts`)

Every booking submission is validated against strict constraints:

| Field | Validation Rules | Error Message |
|---|---|---|
| `serviceId` | Valid UUID format | *"Please select a valid dental service."* |
| `preferredDate` | `YYYY-MM-DD` format, not in the past, not on Sundays (`day !== 0`) | *"The clinic is closed on Sundays. Please select Monday to Saturday."* |
| `preferredTime` | `HH:mm` format, between `09:00` and `20:00` | *"Appointment time must be between 09:00 and 20:00."* |
| `patientName` | Trimmed string, min 2 chars, max 120 chars | *"Name must be at least 2 characters."* |
| `patientPhone` | Regex `^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$`, min 7 digits, max 20 | *"Please provide a valid contact phone number."* |
| `patientEmail` | Valid email format (optional or empty string) | *"Please provide a valid email address."* |
| `note` | Max 500 characters (optional) | *"Notes cannot exceed 500 characters."* |
| `honeypot` | Must be empty (`max(0)`) | Bot trap: submission silently rejected |

---

## 4. Patient Directory Upsert

Appointments are linked to a normalized `patients` table:
1. Patient lookup queries the unique phone number:
   ```typescript
   const { data: existingPatient } = await supabase
     .from("patients")
     .select("id")
     .eq("phone", patientPhone)
     .maybeSingle();
   ```
2. If the patient exists, their `id` is reused.
3. If new, a patient record is created with `full_name`, `phone`, and `email`.

This ensures patient treatment history across multiple visits remains unified without creating duplicate patient entities.

---

## 5. Reference Code Format

Every booking generates a human-friendly, uppercase alphanumeric tracking code:
- Format: `HD-YYYY-XXXX`
- Example: `HD-2026-X9K2`
- Stored in the `reference_code` unique column in `appointments`.
- Displayed to the patient for WhatsApp or phone inquiries.

---

## 6. Lifecycle & Status Transition

Appointments follow a controlled lifecycle governed by PostgreSQL check constraints (`CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show'))`):

```
[ pending ] ──► [ confirmed ] ──► [ completed ]
     │                │
     └────────────────┴──────────► [ cancelled ] / [ no_show ]
```

- **`pending`**: Default state upon public website booking submission.
- **`confirmed`**: Receptionist or clinic staff confirms patient slot after phone/WhatsApp contact.
- **`completed`**: Dental consultation or procedure completed.
- **`cancelled`**: Appointment cancelled by patient or clinic (frees the time slot for new bookings).
- **`no_show`**: Patient did not attend scheduled appointment.

---

## 7. Stage 5: Admin & Clinical Operations

### A. Manual Phone/Walk-in Intake (`createAdminAppointmentAction`)
- Staff can search for existing patients or create a new patient inline.
- Inserts directly into the **same** `appointments` table used by public bookings.
- Undergoes identical server-authoritative collision checks:
  1. Operating hours validation (09:00 - 20:00).
  2. Sunday restriction enforcement.
  3. Overlap check against all non-cancelled appointments.
  4. Block check against active `availability_blocks`.

### B. Rescheduling (`rescheduleAppointmentAction`)
- Allows moving an appointment to a new date and time slot.
- Verifies slot availability at the target time before applying mutation.
- Maintains audit logs and updates `admin_notes` with rescheduling trail.
- Frees the previous slot immediately.

### C. Availability Blocking (`createAvailabilityBlockAction` / `deleteAvailabilityBlockAction`)
- Blocks doctor-specific or clinic-wide time periods (e.g. 14:00 - 16:00).
- Immediately disables matching 30-minute intervals in both the public booking form and admin manual booking wizard.
- Backed by `availability_blocks` table with seamless fallback to `site_settings` store for high reliability.
