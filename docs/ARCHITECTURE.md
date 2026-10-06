# Halo Dental Architecture

Welcome to the Halo Dental project architecture guide. This document explains how the entire website works, how all components fit together, and where to make changes when you want to update or expand the website.

---

## 1. Project Structure

The project follows the standard Next.js App Router structure with clean boundaries between routing, UI components, business logic, translations, and database configuration.

```
halo-dental/
├── app/                  # Application routing & page layouts
│   ├── [locale]/         # User-facing bilingual pages (/ for English, /ml for Malayalam)
│   │   ├── (public)/     # Public marketing & informational pages
│   │   │   ├── about/    # /about page
│   │   │   ├── blog/     # /blog list and /blog/[slug] dynamic articles
│   │   │   ├── booking/  # /booking appointment page
│   │   │   ├── contact/  # /contact page
│   │   │   ├── faq/      # /faq page
│   │   │   ├── gallery/  # /gallery before-and-after photo showcase
│   │   │   ├── services/ # /services overview and 11 individual treatment pages
│   │   │   └── page.tsx  # Homepage
│   │   └── layout.tsx    # Locale provider and root <html> tag for public site
│   ├── actions/          # Next.js Server Actions
│   │   ├── booking.ts    # Secure public appointment booking transaction & validation
│   │   └── admin.ts      # Authoritative administrative mutations & role-checked actions
│   ├── admin/            # Staff management dashboard (English only, server-protected)
│   │   ├── login/        # Luxury staff login portal
│   │   ├── bookings/     # Appointment review, filters, status lifecycle & rescheduling
│   │   ├── patients/     # Patient directory, intake, editing & visit history
│   │   ├── calendar/     # Clinical Day and Week schedule views
│   │   ├── availability/ # Slot availability grid & time blocking management
│   │   ├── services/     # Clinic services CRUD & bilingual editor
│   │   ├── blog/         # Content editor for articles
│   │   ├── gallery/      # Before/after smile case management
│   │   ├── testimonials/ # Patient review moderation
│   │   ├── settings/     # Clinic contact, hours & social settings
│   │   ├── page.tsx      # Dashboard overview metrics & pending triage
│   │   └── layout.tsx    # Admin shell with session resolution and modal preload
│   ├── globals.css       # Tailwind base, brand color tokens, Malayalam font rules
│   ├── sitemap.ts        # Dynamic XML sitemap generator for search engines
│   └── robots.ts         # Search engine crawl rules
├── components/           # Reusable React UI components
│   ├── layout/           # Global chrome (Header, Footer, LanguageSwitcher, MobileNav)
│   ├── ui/               # Design system primitives (Button, Card, Modal, Input, Badge, Select)
│   ├── marketing/        # Landing page sections (Hero, ServiceGrid, TestimonialCarousel, FAQ)
│   ├── booking/          # Booking wizard (BookingForm, FloatingBookingWidget, AvailabilityCalendar)
│   └── admin/            # Admin UI (AdminSidebar, AdminHeader, AdminClientLayout, StatusBadge, Modals)
├── lib/                  # Core helpers, clients, and business logic
│   ├── admin/            # Administrative authentication & audit logging
│   │   └── auth.ts       # getAdminSession, requireAdminSession, requireRole, logAdminAction
│   ├── supabase/         # Supabase client singletons
│   │   ├── client.ts     # Browser client (anon key)
│   │   ├── server.ts     # SSR client with cookies (anon key)
│   │   ├── admin.ts      # Server-only admin client (service-role key)
│   │   └── middleware.ts # Session refresh & route protection middleware
│   ├── booking/          # Availability and scheduling logic
│   │   ├── availability.ts # Slot collision detection, active blocks & availability queries
│   │   └── slots.ts      # Daily time slot generation (09:00 - 20:00)
│   ├── validations/      # Zod schemas (bookingSchema.ts, adminSchema.ts)
│   ├── notifications/    # WhatsApp, SMS, and Email delivery triggers
│   ├── i18n.ts           # Supported languages and default locale definition
│   ├── i18n-request.ts   # next-intl server request configuration
│   └── utils.ts          # Utility functions (cn() helper)
├── messages/             # JSON translation files
│   ├── en.json           # English user-facing text strings
│   └── ml.json           # Malayalam user-facing text strings
├── public/               # Static assets (images, icons, doctor photos, clinic logo)
├── supabase/             # Database schema migrations and Edge Functions
│   ├── migrations/       # Numbered SQL migration files (01 schema, 02 RLS, 03 storage)
│   └── functions/        # Edge Functions for asynchronous notifications
├── types/                # TypeScript type definitions and generated database types (database.types.ts)
├── docs/                 # Developer manuals and architecture documentation
├── middleware.ts         # Edge routing middleware (locale routing + admin session refresh)
└── tailwind.config.ts    # Brand color palette, typography, and theme styling
```

---

## 2. Request Flow

When a user opens a page or performs an action (such as submitting an appointment), here is the step-by-step path the request takes:

```
Browser Request
      │
      ▼
Edge Middleware (`middleware.ts`)
      │
      ├── If path starts with `/admin/*` ──► `updateSession()` in `lib/supabase/middleware.ts`
      │                                       (Refreshes Supabase session cookie)
      │
      └── If public route ──────────────────► `intlMiddleware`
                                              (Checks locale: "/" for English, "/ml/*" for Malayalam)
      │
      ▼
Next.js App Router (`app/[locale]/(public)/...`)
      │
      ▼
Server Component (Layout / Page)
      │
      ├── Calls `setRequestLocale(locale)` for static rendering
      └── Loads translation bundle via `getTranslations()` or `messages/[locale].json`
      │
      ▼
Client Interaction (e.g., Patient Booking Form)
      │
      ▼
Client-Side Validation (`lib/validations/bookingSchema.ts` via Zod)
      │
      ▼
Server Action (`app/actions/booking.ts`)
      │
      ├── 1. Server-side validation via Zod (ensures phone regex, dates, operating hours)
      ├── 2. Bot Deterrent Check (honeypot field)
      ├── 3. Server-side Slot Availability Verification (`lib/booking/availability.ts`)
      │      - Checks `appointments` table for conflicting non-cancelled bookings
      ├── 4. Server-Side Admin Client (`lib/supabase/admin.ts`)
      │      - Finds existing patient by phone or inserts new patient
      └── 5. Inserts appointment record with unique code `HD-YYYY-XXXX` and `status: 'pending'`
      │
      ▼
Supabase Database (PostgreSQL with Row Level Security - RLS)
      │
      ├── Verified via security definer helpers (`public.is_staff()`, `public.is_admin()`)
      └── Stores data securely in 11 core tables
      │
      ▼
Post-Insert Trigger / Notification Pipeline
      │
      └── Automated confirmation (WhatsApp/SMS notification triggers)
      │
      ▼
Response returned to browser with confirmation UI & reference code
```

---

## 3. Localization (i18n)

The website is bilingual, serving patients in both **English** and **Malayalam**:

- **English (Default)**: Served at the root URL (e.g. `/`, `/about`, `/services/teeth-whitening`).
- **Malayalam**: Served with the `/ml` prefix (e.g. `/ml`, `/ml/about`, `/ml/services/teeth-whitening`).

### How next-intl Works:
1. **Routing**: `middleware.ts` uses `localePrefix: "as-needed"`. Requests to `/` serve English without adding `/en`. Requests to `/ml` serve Malayalam.
2. **Translation Bundles**:
   - English strings are in `messages/en.json`.
   - Malayalam strings are in `messages/ml.json`.
3. **Static Generation (SSG)**:
   - Every layout and page calls `setRequestLocale(locale)` at the top of the component.
   - `app/[locale]/layout.tsx` exports `generateStaticParams()` to pre-render both `en` and `ml` versions into static HTML for maximum speed.
4. **Typography**:
   - Malayalam text requires clear typography. `app/globals.css` specifies `:lang(ml)` font rules using *Noto Sans Malayalam* to ensure natural script rendering.

---

## 4. Database Architecture (11 Core Tables)

The backend database runs on **PostgreSQL via Supabase** with Row Level Security (RLS) enabled across all tables:

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

### Core Tables:
1. **`clinics`**: Multi-clinic/branch configuration, contact numbers, address, and operating hours.
2. **`staff_users`**: Extends `auth.users` with clinic authorization roles (`admin`, `staff`, `doctor`).
3. **`doctors`**: Dentists and specialists (name, qualifications, specialty, working hours, bio).
4. **`services`**: Clinic treatments (name_en, name_ml, slug, category, price, duration).
5. **`patients`**: Directory of patients (full_name, phone, email, notes).
6. **`appointments`**: Bookings linking a patient, service, doctor, date, time slot, and status.
7. **`testimonials`**: Verified patient reviews and ratings (moderated via `is_approved`).
8. **`blog_posts`**: Informational dental health articles with localized content (`en` / `ml`).
9. **`gallery_items`**: Before-and-after smile makeover transformation photos.
10. **`audit_logs`**: System audit trail of administrative modifications.
11. **`site_settings`**: Key clinic metadata, contact info, and configuration flags.

---

## 5. Authentication & Authorization

The website separates public visitors from clinic staff:

- **Public Visitors**: Do not need an account. They can browse services, read articles, view the gallery, and submit appointment requests.
- **Clinic Staff & Doctors**: Log in at `/admin/login` using Supabase Auth.
- **Staff Roles**:
  - `admin`: Full access to clinic settings, staff management, services catalog, and all appointments.
  - `staff`: Can view, confirm, reschedule, and manage daily bookings and patient records.
  - `doctor`: Can view their assigned appointments and patient clinical notes.
- **Database Functions**:
  - `public.is_staff()`: Security definer SQL function checking active staff status.
  - `public.is_admin()`: Security definer SQL function checking administrator status.

---

## 6. Booking System & Double-Booking Protection

The appointment booking flow is safeguarded against race conditions:

1. **Service Selection**: Patient selects procedure (e.g. Teeth Whitening, Clear Aligners).
2. **Date & Time Verification**: Dynamic query against `appointments` checks for already occupied slots.
3. **Bot Trap**: Honeypot field silently discards automated spam submissions.
4. **Server-Side Conflict Check**: `checkSlotAvailable()` verifies that the selected slot has not been reserved during form completion.
5. **Transaction Execution**: Upserts patient by unique phone number and inserts appointment with `status = "pending"` and unique code `HD-YYYY-XXXX`.

*For detailed specifications, see [docs/BOOKING-SYSTEM.md](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/docs/BOOKING-SYSTEM.md).*

---

## 7. Admin System

The `/admin` dashboard provides clinic staff with full control:

- **Bookings Management**: Real-time calendar and table view of all appointments.
- **Service Catalog**: Manage active treatments, adjust starting prices, and update durations.
- **Doctor Profiles**: Update doctor working hours, add dentists, or edit specialties.
- **Testimonial Moderation**: Review incoming patient reviews before approving for public display.
- **Blog Editor**: Compose and publish dental health articles in English and Malayalam.
- **Before/After Gallery**: Upload and categorize clinical case photos.
- **Clinic Settings**: Edit operational hours, contact details, and emergency notifications.

---

## 8. Security Principles

1. **Environment Variables**:
   - Public variables (`NEXT_PUBLIC_`) are bundled safely for browser use.
   - Secret variables (`SUPABASE_SERVICE_ROLE_KEY`) are kept strictly on the server and never exposed in client bundles.
2. **Row Level Security (RLS)**:
   - Every Supabase table has RLS enabled by default.
   - Public visitors cannot read private patient records or appointments.
3. **Fail-Safe Middleware**:
   - Handled gracefully without throwing HTTP 500 errors if credentials are temporarily unconfigured.
4. **Input Sanitization**:
   - All forms and server actions validate inputs using Zod schemas.

---

## 9. Where To Make Common Changes

| I want to change... | Main file or folder |
|---|---|
| **Website brand colors & fonts** | `tailwind.config.ts` and `app/globals.css` |
| **Clinic Logo** | `public/images/logo.svg` or `components/layout/Header.tsx` |
| **Header navigation menu** | `components/layout/Header.tsx` |
| **Footer links & copyright** | `components/layout/Footer.tsx` |
| **WhatsApp chat number** | `components/marketing/FloatingWhatsAppButton.tsx` and `messages/en.json` |
| **Clinic phone number** | `messages/en.json` (under contact keys) and `app/[locale]/(public)/contact/page.tsx` |
| **Clinic email address** | `messages/en.json` and `messages/ml.json` |
| **Clinic address & hours** | `messages/en.json`, `components/layout/Footer.tsx`, and `app/[locale]/(public)/contact/page.tsx` |
| **Service card display** | `components/marketing/ServiceGrid.tsx` and `components/marketing/ServiceCard.tsx` |
| **Service landing page template**| `app/[locale]/(public)/services/[slug]/page.tsx` |
| **English text & copy** | `messages/en.json` |
| **Malayalam text & copy** | `messages/ml.json` |
| **Booking form fields & rules** | `lib/validations/bookingSchema.ts` and `components/booking/BookingForm.tsx` |
| **Booking availability & slots** | `lib/booking/availability.ts` and `lib/booking/slots.ts` |
| **Booking server action** | `app/actions/booking.ts` |
| **Patient testimonials (default)**| `components/marketing/TestimonialCarousel.tsx` |
| **FAQ questions & answers** | `components/marketing/FAQSection.tsx` and `messages/en.json` |
| **SEO meta tags & page titles** | `export const metadata` in each `app/[locale]/**/page.tsx` |
| **Sitemap URLs** | `app/sitemap.ts` |
| **Robots.txt crawl rules** | `app/robots.ts` |
| **Supported languages** | `lib/i18n.ts` |
