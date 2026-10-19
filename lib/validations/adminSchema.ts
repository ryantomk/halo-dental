import { z } from "zod";

export const patientSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters.").max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/, "Please provide a valid contact phone number.")
    .min(7)
    .max(20),
  email: z.string().trim().email("Please provide a valid email address.").optional().or(z.literal("")),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD).").optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other", "undisclosed"]).optional(),
  notes: z.string().max(1000, "Notes cannot exceed 1000 characters.").optional().or(z.literal("")),
});

export type PatientInput = z.infer<typeof patientSchema>;

export const adminAppointmentSchema = z.object({
  patientId: z.string().uuid("Please select a valid patient."),
  serviceId: z.string().uuid("Please select a valid service."),
  doctorId: z.string().uuid().optional().or(z.literal("")).nullable(),
  appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)."),
  appointmentTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm)."),
  source: z.enum(["phone", "walk_in", "whatsapp", "website"]).default("phone"),
  adminNotes: z.string().max(1000).optional().or(z.literal("")),
  patientNotes: z.string().max(1000).optional().or(z.literal("")),
});

export type AdminAppointmentInput = z.infer<typeof adminAppointmentSchema>;

export const rescheduleAppointmentSchema = z.object({
  appointmentId: z.string().uuid("Invalid appointment ID."),
  newDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)."),
  newTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:mm)."),
  doctorId: z.string().uuid().optional().or(z.literal("")).nullable(),
});

export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;

export const availabilityBlockSchema = z.object({
  blockDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)."),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format (HH:mm)."),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format (HH:mm)."),
  doctorId: z.string().uuid().optional().or(z.literal("")).nullable(),
  reason: z.string().max(250).optional().or(z.literal("")),
}).refine((data) => data.endTime > data.startTime, {
  message: "End time must be after start time.",
  path: ["endTime"],
});

export type AvailabilityBlockInput = z.infer<typeof availabilityBlockSchema>;

export const serviceFormSchema = z.object({
  name: z.string().trim().min(2, "Service name is required.").optional(),
  nameEn: z.string().trim().optional(),
  nameMl: z.string().trim().optional(),
  slug: z.string().trim().optional(),
  category: z.string().default("general"),
  durationMinutes: z.coerce.number().int().min(15).max(240).default(30),
  priceDisplay: z.string().optional().or(z.literal("")),
  priceStartingAt: z.coerce.number().int().min(0).optional().nullable(),
  shortDescription: z.string().optional().or(z.literal("")),
  shortDescriptionEn: z.string().optional().or(z.literal("")),
  shortDescriptionMl: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  descriptionEn: z.string().optional().or(z.literal("")),
  descriptionMl: z.string().optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
});

export type ServiceFormInput = z.infer<typeof serviceFormSchema>;

export const blogPostFormSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  excerpt: z.string().optional().or(z.literal("")),
  content: z.string().trim().min(10, "Content must be at least 10 characters."),
  category: z.string().default("Dental Health"),
  coverImageUrl: z.string().optional().or(z.literal("")),
  authorId: z.string().uuid().optional().or(z.literal("")).nullable(),
  seoTitle: z.string().optional().or(z.literal("")),
  seoDescription: z.string().optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
});

export type BlogPostFormInput = z.infer<typeof blogPostFormSchema>;

export const galleryItemFormSchema = z.object({
  title: z.string().trim().min(2, "Title is required."),
  description: z.string().optional().or(z.literal("")),
  isBeforeAfter: z.boolean().default(false),
  beforeImageUrl: z.string().min(1, "Please provide an image."),
  afterImageUrl: z.string().optional().or(z.literal("")),
  serviceId: z.string().uuid().optional().or(z.literal("")).nullable(),
  treatmentDuration: z.string().optional().or(z.literal("")),
  isPublished: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
});

export type GalleryItemFormInput = z.infer<typeof galleryItemFormSchema>;

export const testimonialFormSchema = z.object({
  patientName: z.string().trim().min(2, "Patient name is required."),
  quote: z.string().trim().min(5, "Testimonial text must be at least 5 characters."),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  treatment: z.string().trim().min(2, "Treatment name is required."),
  serviceId: z.string().uuid().optional().or(z.literal("")).nullable(),
  photoUrl: z.string().optional().or(z.literal("")),
  isApproved: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  displayOrder: z.coerce.number().int().default(0),
});

export type TestimonialFormInput = z.infer<typeof testimonialFormSchema>;

export const staffCreateSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters.").max(120),
  email: z.string().trim().email("Please provide a valid email address."),
  role: z.enum(["admin", "staff", "doctor"], {
    errorMap: () => ({ message: "Role must be admin, staff, or doctor." }),
  }),
  password: z.string().min(8, "Temporary password must be at least 8 characters.").max(100),
  isActive: z.boolean().default(true),
});

export type StaffCreateInput = z.infer<typeof staffCreateSchema>;

export const staffUpdateSchema = z.object({
  id: z.string().uuid("Invalid staff user ID."),
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters.").max(120),
  role: z.enum(["admin", "staff", "doctor"], {
    errorMap: () => ({ message: "Role must be admin, staff, or doctor." }),
  }),
  isActive: z.boolean(),
});

export type StaffUpdateInput = z.infer<typeof staffUpdateSchema>;

export const clinicSettingsSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/, "Please provide a valid contact phone number."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/, "Please provide a valid WhatsApp phone number."),
  email: z.string().trim().email("Please provide a valid clinic email address."),
  address_line1: z.string().trim().min(5, "Address Line 1 is required."),
  address_line2: z.string().trim().optional(),
  opening_hours: z.record(z.string()).optional(),
});

export type ClinicSettingsInput = z.infer<typeof clinicSettingsSchema>;

