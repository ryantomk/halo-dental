import { z } from "zod";

// Mirrors the `appointments` insert shape from the technical spec,
// Section 10. Used both client-side (react-hook-form) and server-side
// (re-validated before the Supabase insert — never trust the client alone).
export const bookingSchema = z.object({
  serviceId: z.string().uuid(),
  preferredDate: z.string(), // ISO date, validated against clinic hours server-side
  preferredTime: z.string(), // "HH:mm"
  patientName: z.string().min(2).max(120),
  patientPhone: z.string().min(7).max(20),
  patientEmail: z.string().email().optional().or(z.literal("")),
  note: z.string().max(500).optional(),
  // TODO: add bot-deterrent field (Cloudflare Turnstile token / honeypot)
  // per technical spec Section 14 before wiring this to the live form.
});

export type BookingInput = z.infer<typeof bookingSchema>;
