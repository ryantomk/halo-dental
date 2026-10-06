# Halo Dental Project Decisions Record

This document records the architectural, technical, and security decisions made during the development of Halo Dental.

---

## 1. Routing & Internationalization (P0)

### Decision: `next-intl` with `localePrefix: "as-needed"`
- **Context**: The clinic serves both English and Malayalam speakers in Kerala.
- **Decision**:
  - English is served at the root URL (e.g., `/`, `/services`, `/about`).
  - Malayalam is served with the prefix `/ml` (e.g., `/ml`, `/ml/services`, `/ml/about`).
- **Rationale**: Keeps English URLs clean and canonical while providing localized Malayalam pages for patients who prefer their native language.
- **SSG Implementation**: Next.js 14 requires `setRequestLocale(locale)` at the start of every page and layout component to ensure all 45 pages are statically generated at build time (`npm run build`).

### Decision: Separate `/admin` Route Outside `[locale]`
- **Context**: Clinic administrative staff operate in English.
- **Decision**: `/admin` is placed at the root level of `app/`, outside the `[locale]` dynamic segment.
- **Rationale**: Prevents `/admin` from being prefixed (e.g. `/ml/admin`), avoids loading unnecessary translation bundles for administrative dashboards, and isolates admin session refresh middleware.
- **Dual HTML Shell**: `app/[locale]/layout.tsx` renders `<html lang={locale}>`, while `app/admin/layout.tsx` renders `<html lang="en">`. The root `app/layout.tsx` renders children without an extra outer `<html>` tag.

---

## 2. Database Schema & RLS Architecture (P1)

### Decision: 11 Core Normalized Tables
- **Context**: The clinic needs structured management for appointments, patients, services, staff, doctors, reviews, blog posts, gallery transformations, and audit logs.
- **Decision**: Implemented 11 core tables in `supabase/migrations/20260930000001_initial_schema.sql`:
  - `clinics`, `staff_users`, `doctors`, `services`, `patients`, `appointments`, `testimonials`, `blog_posts`, `gallery_items`, `audit_logs`, `site_settings`.
- **Rationale**: Normalized data model ensures referential integrity (foreign keys with cascade rules), accurate analytics, and multi-branch readiness.

### Decision: Security Definer Helper Functions (`is_staff`, `is_admin`)
- **Context**: RLS policies querying user roles can encounter infinite recursion or performance degradation if they self-reference the `staff_users` table directly.
- **Decision**: Created `public.is_staff()` and `public.is_admin()` as `SECURITY DEFINER STABLE` functions.
- **Rationale**: Executes with owner privileges in a stable snapshot, preventing recursion and speeding up policy evaluation.

### Decision: Storage Bucket Segregation
- **Context**: The clinic stores public images (doctor photos, clinic gallery) and private medical records (X-rays, prescriptions).
- **Decision**: Created two distinct buckets:
  - `clinic-public`: `public: true`, max 5 MB, image MIME types only.
  - `patient-records`: `public: false`, max 20 MB, authenticated staff access only.
- **Rationale**: Strict isolation ensures patient health information (PHI) cannot be discovered or scraped via public CDN URLs.

---

## 3. Booking System Architecture (P1)

### Decision: Server Action with Service-Role Execution
- **Context**: Patients must be able to submit bookings without creating user accounts, but patient directories and appointments must not be readable by the public.
- **Decision**: Direct client inserts and selects on `patients` and `appointments` are blocked by RLS for anonymous users. The booking flow runs via a Next.js Server Action (`app/actions/booking.ts`) using `createAdminClient()` from `lib/supabase/admin.ts`.
- **Rationale**: Enforces complete server-side control over validation, bot deterrence, slot verification, and patient upserting without exposing database tables to public scraping.

### Decision: Server-Side Double-Booking Protection
- **Context**: Two patients selecting the same slot at the same time could cause a race condition.
- **Decision**: Added two-stage availability check:
  1. Client-side slot query disables already occupied slots.
  2. Server action re-queries `appointments` table for date/time conflicts immediately before inserting the booking record.
- **Rationale**: Guarantees zero duplicate appointments even under concurrent patient submissions.

### Decision: Patient Phone-Based Directory Normalization
- **Context**: Returning patients may book new appointments over time.
- **Decision**: The booking action looks up the patient by phone number. If an existing record exists, its UUID is reused; otherwise, a new patient record is created.
- **Rationale**: Maintains a clean patient history across multiple visits without requiring the patient to manage a password or remember login credentials.

---

## 4. Security & Environment Variable Isolation (P1)

### Decision: Strict Server-Only Boundary for `SUPABASE_SERVICE_ROLE_KEY`
- **Context**: The service role key bypasses PostgreSQL Row Level Security.
- **Decision**:
  - Service role key is loaded only in `lib/supabase/admin.ts`.
  - Never given the `NEXT_PUBLIC_` prefix.
  - Never imported in `"use client"` components.
  - `.env.local` is strictly ignored in `.gitignore`.
- **Key Rotation Protocol**: During an earlier session, an older key was displayed in a command log; it was declared compromised and rotated. Keys must never be printed to console or logs.

### Decision: Fail-Safe Middleware & Client Singletons
- **Context**: Missing environment variables during local setup or staging previews shouldn't cause hard HTTP 500 crashes.
- **Decision**: `lib/supabase/middleware.ts` and Supabase client singletons return neutral fallbacks when variables are unconfigured.
- **Rationale**: Preserves developer ergonomics and ensures Next.js build processes (`next build`) compile without requiring live credentials during static site generation.

---

## 5. Framework & Typing Conventions (P0/P1)

### Decision: Next.js 14 Parameter Typing
- **Context**: Next.js 15 introduced Promise-based `params`, but the project is standardized on Next.js 14.2.35.
- **Decision**: Route parameters across all slug routes (`app/[locale]/(public)/services/[slug]/page.tsx`, `blog/[slug]/page.tsx`) use synchronous parameter objects:
  ```typescript
  interface PageProps {
    params: {
      locale: string;
      slug: string;
    };
  }
  ```
- **Rationale**: Maintains type compatibility and eliminates build warnings.

---

## 6. Stage 5: Complete Admin Dashboard & Availability Architecture

### Decision: Single Authoritative Appointments Table
- **Context**: The clinic requires manual appointment booking from staff phone inquiries alongside public website bookings.
- **Decision**: Manual bookings made by admin/staff insert into the exact same `appointments` table with `source: 'phone'` (or `'walk_in'`) and reference code `HD-YYYY-XXXX`. No secondary or parallel table is used.
- **Rationale**: Completely prevents double-booking discrepancies, ensures the calendar displays a unified schedule, and ensures both public and internal tools calculate slot availability from a single source of truth.

### Decision: Server-Side Authoritative Collision Prevention
- **Context**: Admin users booking appointments via telephone intake could accidentally select overlapping slots.
- **Decision**: `createAdminAppointmentAction` executes the full `checkSlotAvailable()` validation pipeline server-side before inserting, rejecting any overlapping time slot with a clear user message.
- **Rationale**: Browser checks can experience race conditions or stale client state; the server/database must remain strictly authoritative.

### Decision: Availability Blocking with High-Reliability Dual-Store
- **Context**: Clinic managers need to block time windows (e.g., seminars, surgery hours, emergency coverage) across the whole clinic or for specific doctors, instantly disabling corresponding public booking slots.
- **Decision**: Implemented `availability_blocks` schema in `supabase/migrations/20261004000001_availability_blocks.sql` with RLS. To guarantee zero downtime even if migrations are pending on remote staging databases, `lib/booking/availability.ts` automatically queries the table and falls back seamlessly to `site_settings` under key `'availability_blocks'`.
- **Rationale**: Eliminates runtime fragility while maintaining a clean, indexed relational schema.

### Decision: Safe WhatsApp Contact Protocol
- **Context**: Staff need quick WhatsApp outreach to patients from the booking details view.
- **Decision**: WhatsApp launcher pre-fills only a safe, generic message (`"Hello, this is Halo Dental regarding your appointment."`) without appending medical notes or sensitive diagnoses into the public URL.
- **Rationale**: Complies with patient privacy and health data standards while providing receptionist convenience.
