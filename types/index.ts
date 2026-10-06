/**
 * Application-level Shared Types
 *
 * WHAT THIS FILE DOES:
 * Re-exports common domain types (Appointments, Doctors, Services, etc.) derived from
 * the central Supabase database schema for easy import across components and server actions.
 */

import type { Database } from "./database.types";

export * from "./database.types";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Domain Types
export type Clinic = Tables<"clinics">;
export type Doctor = Tables<"doctors">;
export type Service = Tables<"services">;
export type Patient = Tables<"patients">;
export type Appointment = Tables<"appointments">;
export type Testimonial = Tables<"testimonials">;
export type BlogPost = Tables<"blog_posts">;
export type GalleryItem = Tables<"gallery_items">;
export type StaffUser = Tables<"staff_users">;
export type AuditLog = Tables<"audit_logs">;
export type SiteSetting = Tables<"site_settings">;

// Enums & Statuses
export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
export type StaffRole = "admin" | "staff" | "doctor";
export type ServiceCategory = "cosmetic" | "orthodontics" | "general" | "restorative" | "implants" | "pediatric";
export type BlogStatus = "draft" | "published" | "archived";
export type AppointmentSource = "website" | "whatsapp" | "phone" | "walk_in";
