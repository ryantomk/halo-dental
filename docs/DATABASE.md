# Halo Dental Database Architecture

This document provides the complete database design for Halo Dental using PostgreSQL on Supabase.

> **DEPLOYMENT STATUS: LIVE & VERIFIED (P1 & STAGE 5)**
> Migrations deployed and active against Supabase:
> 1. `supabase/migrations/20260930000001_initial_schema.sql` (11 core tables, triggers, indexes, check constraints)
> 2. `supabase/migrations/20260930000002_rls_and_policies.sql` (Row Level Security on all tables + helper functions)
> 3. `supabase/migrations/20260930000003_storage_buckets.sql` (Storage buckets `clinic-public` and `patient-records`)
> 4. `supabase/migrations/20261004000001_availability_blocks.sql` (Availability blocking schema with staff RLS & indexes)

---

## 1. Entity Relationship Diagram

```
                 ┌──────────────────┐
                 │     clinics      │
                 │ (id, name, slug) │
                 └────────┬─────────┘
                          │ 1
       ┌──────────────────┼──────────────────┐
       │ ∞                │ ∞                │ ∞
┌──────┴─────────┐ ┌──────┴─────────┐ ┌──────┴─────────┐
│  staff_users   │ │    doctors     │ │  appointments  │
│(id, email, role│ │(id, name, spec)│ │(id, date, slot)│
└────────────────┘ └──────┬─────────┘ └──────┬──┬──────┘
                          │ 1                │  │
                          │ ∞                │  │
                          └──────────────────┤  │
                                             │  │
                 ┌──────────────────┐        │  │
                 │     patients     │        │  │
                 │ (id, name, phone)│        │  │
                 └────────┬─────────┘        │  │
                          │ 1                │  │
                          │ ∞                │  │
                          └──────────────────┘  │
                                                │ ∞
                 ┌──────────────────┐           │
                 │     services     │           │
                 │ (id, name, price)│           │
                 └────────┬─────────┘           │
                          │ 1                   │
                          └─────────────────────┘
```

### Supporting Tables:
- `testimonials`: Patient reviews and ratings (moderated before public display via `is_approved`).
- `gallery_items`: Before/after clinical photos categorized by treatment service.
- `blog_posts`: Dental health educational articles with English and Malayalam content (`published_at`, `is_published`).
- `audit_logs`: System audit trail recording actions, timestamps, and staff identity.
- `site_settings`: Single-row key-value store for clinic hours, phone numbers, and operational flags.

---

## 2. Table Specifications (11 Core Tables)

### Table 1: `clinics`
- **Purpose**: Multi-clinic/branch ready configuration for clinic contact details, address, and operating hours.
- **Columns**:
  - `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `name`: `text NOT NULL`
  - `slug`: `text UNIQUE NOT NULL`
  - `phone`: `text NOT NULL`
  - `whatsapp`: `text NOT NULL`
  - `email`: `text NOT NULL`
  - `address_line1`: `text NOT NULL`
  - `address_line2`: `text`
  - `city`: `text NOT NULL DEFAULT 'Perinthalmanna'`
  - `state`: `text NOT NULL DEFAULT 'Kerala'`
  - `postal_code`: `text NOT NULL`
  - `country`: `text NOT NULL DEFAULT 'India'`
  - `google_maps_url`: `text`
  - `opening_hours`: `jsonb NOT NULL DEFAULT '{"mon_sat": "09:00 - 20:00", "sun": "Closed"}'`
  - `is_active`: `boolean NOT NULL DEFAULT true`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
  - `updated_at`: `timestamptz NOT NULL DEFAULT now()`
- **RLS**:
  - **SELECT**: Public (active clinics).
  - **INSERT/UPDATE/DELETE**: Staff with `admin` role only.

---

### Table 2: `staff_users`
- **Purpose**: Extends Supabase `auth.users` to associate clinic staff with authorization roles.
- **Columns**:
  - `id`: `uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
  - `email`: `text UNIQUE NOT NULL`
  - `full_name`: `text NOT NULL`
  - `role`: `text NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'doctor'))`
  - `clinic_id`: `uuid REFERENCES clinics(id) ON DELETE SET NULL`
  - `is_active`: `boolean NOT NULL DEFAULT true`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
  - `updated_at`: `timestamptz NOT NULL DEFAULT now()`
- **RLS**:
  - **SELECT**: Authenticated staff can view their own profile; `admin` can view all staff.
  - **INSERT/UPDATE/DELETE**: `admin` role only. Public access is completely denied.

---

### Table 3: `doctors`
- **Purpose**: Dentist and specialist profiles associated with Halo Dental.
- **Columns**:
  - `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `clinic_id`: `uuid REFERENCES clinics(id) ON DELETE SET NULL`
  - `staff_user_id`: `uuid REFERENCES staff_users(id) ON DELETE SET NULL`
  - `name_en`: `text NOT NULL`
  - `name_ml`: `text NOT NULL`
  - `slug`: `text UNIQUE NOT NULL`
  - `specialty_en`: `text NOT NULL`
  - `specialty_ml`: `text NOT NULL`
  - `qualification`: `text NOT NULL`
  - `bio_en`: `text`
  - `bio_ml`: `text`
  - `image_url`: `text`
  - `experience_years`: `integer CHECK (experience_years >= 0)`
  - `working_days`: `jsonb NOT NULL DEFAULT '["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]'`
  - `working_hours_start`: `time NOT NULL DEFAULT '09:00'`
  - `working_hours_end`: `time NOT NULL DEFAULT '20:00'`
  - `is_active`: `boolean NOT NULL DEFAULT true`
  - `sort_order`: `integer NOT NULL DEFAULT 0`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
  - `updated_at`: `timestamptz NOT NULL DEFAULT now()`
- **RLS**:
  - **SELECT**: Public (active doctors).
  - **INSERT/UPDATE/DELETE**: Staff with `admin` role only.

---

### Table 4: `services`
- **Purpose**: Dental procedures offered by the clinic (e.g., Teeth Whitening, Clear Aligners, Root Canal Treatment).
- **Columns**:
  - `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `slug`: `text UNIQUE NOT NULL`
  - `name_en`: `text NOT NULL`
  - `name_ml`: `text NOT NULL`
  - `category`: `text NOT NULL CHECK (category IN ('cosmetic', 'orthodontics', 'general', 'restorative', 'implants', 'pediatric'))`
  - `short_description_en`: `text`
  - `short_description_ml`: `text`
  - `description_en`: `text`
  - `description_ml`: `text`
  - `price_display`: `text`
  - `price_starting_at`: `integer CHECK (price_starting_at IS NULL OR price_starting_at >= 0)`
  - `duration_minutes`: `integer NOT NULL DEFAULT 30 CHECK (duration_minutes > 0)`
  - `image_url`: `text`
  - `is_featured`: `boolean NOT NULL DEFAULT false`
  - `is_active`: `boolean NOT NULL DEFAULT true`
  - `sort_order`: `integer NOT NULL DEFAULT 0`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
  - `updated_at`: `timestamptz NOT NULL DEFAULT now()`
- **RLS**:
  - **SELECT**: Public (active services).
  - **INSERT/UPDATE/DELETE**: Staff with `admin` role only.

---

### Table 5: `patients`
- **Purpose**: Directory of patients who have requested or booked appointments.
- **Columns**:
  - `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `full_name`: `text NOT NULL`
  - `phone`: `text NOT NULL`
  - `email`: `text`
  - `gender`: `text CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'undisclosed'))`
  - `date_of_birth`: `date`
  - `notes`: `text`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
  - `updated_at`: `timestamptz NOT NULL DEFAULT now()`
- **RLS**:
  - **SELECT**: Authenticated staff only. Public queries are blocked.
  - **INSERT**: Managed via server actions utilizing the service role client. Direct public queries return 0 rows.
  - **UPDATE/DELETE**: Staff only.

---

### Table 6: `appointments`
- **Purpose**: Stores patient appointment bookings and tracks their lifecycle.
- **Columns**:
  - `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `reference_code`: `text UNIQUE NOT NULL` (e.g. `"HD-2026-X9K2"`)
  - `clinic_id`: `uuid REFERENCES clinics(id) ON DELETE SET NULL`
  - `patient_id`: `uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE`
  - `doctor_id`: `uuid REFERENCES doctors(id) ON DELETE SET NULL`
  - `service_id`: `uuid NOT NULL REFERENCES services(id) ON DELETE RESTRICT`
  - `appointment_date`: `date NOT NULL`
  - `appointment_time`: `time NOT NULL` (e.g. `"11:00"`)
  - `duration_minutes`: `integer NOT NULL DEFAULT 30`
  - `status`: `text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show'))`
  - `patient_notes`: `text`
  - `admin_notes`: `text`
  - `source`: `text NOT NULL DEFAULT 'website' CHECK (source IN ('website', 'phone', 'walk_in', 'whatsapp'))`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
  - `updated_at`: `timestamptz NOT NULL DEFAULT now()`
- **Indexes**:
  - `idx_appointments_date_time`: On `(appointment_date, appointment_time)`
  - `idx_appointments_doctor_date`: On `(doctor_id, appointment_date)`
  - `idx_appointments_patient`: On `patient_id`
  - `idx_appointments_status`: On `status`
  - `idx_appointments_ref_code`: On `reference_code`
- **RLS**:
  - **SELECT**: Staff only. Public queries return 0 rows.
  - **INSERT/UPDATE**: Managed securely via Server Action / Staff portal.

---

### Table 7: `testimonials`
- **Purpose**: Patient reviews and testimonials displayed on the homepage and service pages.
- **Columns**:
  - `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `patient_name`: `text NOT NULL`
  - `patient_location`: `text`
  - `service_id`: `uuid REFERENCES services(id) ON DELETE SET NULL`
  - `rating`: `integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5)`
  - `quote_en`: `text NOT NULL`
  - `quote_ml`: `text`
  - `source`: `text NOT NULL DEFAULT 'website' CHECK (source IN ('google', 'website', 'direct', 'practo'))`
  - `is_featured`: `boolean NOT NULL DEFAULT false`
  - `is_approved`: `boolean NOT NULL DEFAULT false`
  - `sort_order`: `integer NOT NULL DEFAULT 0`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
  - `updated_at`: `timestamptz NOT NULL DEFAULT now()`
- **RLS**:
  - **SELECT**: Public can read rows where `is_approved = true`.
  - **INSERT**: Authenticated staff or moderation pipeline.
  - **UPDATE/DELETE**: Staff only.

---

### Table 8: `blog_posts`
- **Purpose**: Articles published to educate patients and boost organic search ranking (SEO).
- **Columns**:
  - `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `slug`: `text UNIQUE NOT NULL`
  - `title_en`: `text NOT NULL`
  - `title_ml`: `text NOT NULL`
  - `content_en`: `text NOT NULL`
  - `content_ml`: `text NOT NULL`
  - `excerpt_en`: `text`
  - `excerpt_ml`: `text`
  - `author_id`: `uuid REFERENCES staff_users(id) ON DELETE SET NULL`
  - `cover_image_url`: `text`
  - `tags`: `jsonb DEFAULT '[]'`
  - `is_published`: `boolean NOT NULL DEFAULT false`
  - `published_at`: `timestamptz`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
  - `updated_at`: `timestamptz NOT NULL DEFAULT now()`
- **RLS**:
  - **SELECT**: Public can view where `is_published = true`.
  - **INSERT/UPDATE/DELETE**: Staff only.

---

### Table 9: `gallery_items`
- **Purpose**: Before-and-after case studies showcasing clinical transformations.
- **Columns**:
  - `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `service_id`: `uuid REFERENCES services(id) ON DELETE SET NULL`
  - `title_en`: `text NOT NULL`
  - `title_ml`: `text`
  - `description_en`: `text`
  - `description_ml`: `text`
  - `before_image_url`: `text NOT NULL`
  - `after_image_url`: `text NOT NULL`
  - `treatment_duration`: `text`
  - `case_category`: `text NOT NULL DEFAULT 'cosmetic' CHECK (case_category IN ('cosmetic', 'orthodontics', 'implants', 'restorative', 'whitening'))`
  - `is_featured`: `boolean NOT NULL DEFAULT false`
  - `is_active`: `boolean NOT NULL DEFAULT true`
  - `sort_order`: `integer NOT NULL DEFAULT 0`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
  - `updated_at`: `timestamptz NOT NULL DEFAULT now()`
- **RLS**:
  - **SELECT**: Public can view where `is_active = true`.
  - **INSERT/UPDATE/DELETE**: Staff only.

---

### Table 10: `audit_logs`
- **Purpose**: Regulatory and security audit logging for administrative actions.
- **Columns**:
  - `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `staff_user_id`: `uuid REFERENCES staff_users(id) ON DELETE SET NULL`
  - `action`: `text NOT NULL` (e.g. `'appointment.status_update'`, `'doctor.create'`)
  - `entity_type`: `text NOT NULL` (e.g. `'appointments'`, `'services'`)
  - `entity_id`: `uuid`
  - `details`: `jsonb NOT NULL DEFAULT '{}'`
  - `ip_address`: `text`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
- **RLS**:
  - **SELECT**: Staff with `admin` role only. Public queries return 0 rows.
  - **INSERT**: Authenticated staff actions or system services.

---

### Table 11: `site_settings`
- **Purpose**: Single-row store for clinic configuration, contact numbers, and emergency alerts.
- **Columns**:
  - `id`: `uuid PRIMARY KEY DEFAULT gen_random_uuid()`
  - `key`: `text UNIQUE NOT NULL`
  - `value`: `jsonb NOT NULL`
  - `description`: `text`
  - `created_at`: `timestamptz NOT NULL DEFAULT now()`
  - `updated_at`: `timestamptz NOT NULL DEFAULT now()`
- **RLS**:
  - **SELECT**: Public.
  - **INSERT/UPDATE/DELETE**: Staff with `admin` role only.

---

## 3. Storage Buckets (Verified Live)

| Bucket Name | Access | Max File Size | Allowed MIME Types | Purpose |
|---|---|---|---|---|
| `clinic-public` | **Public** (`public: true`) | 5 MB | `image/jpeg`, `image/png`, `image/webp`, `image/svg+xml` | Doctor photos, clinic tour pictures, blog illustrations, before/after gallery cases |
| `patient-records` | **Private** (`public: false`) | 20 MB | `image/jpeg`, `image/png`, `image/webp`, `application/pdf` | Patient X-rays, treatment plans, prescriptions (accessible to authenticated staff only) |

---

## 4. Row Level Security (RLS) Helper Functions

The database implements security definer helper functions to ensure safe, performant authorization checks without recursive policy queries:

```sql
-- Checks if the authenticated user is an active staff member
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_users
    WHERE id = auth.uid()
      AND is_active = true
  );
$$;

-- Checks if the authenticated user is an active administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_users
    WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = true
  );
$$;
```
