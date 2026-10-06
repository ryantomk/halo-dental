# Halo Dental — Changelog

All notable changes to the Halo Dental website project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Stage 6: Technical SEO, Performance, Accessibility & Production Readiness] - 2026-10-06

### Added
- **Centralized SEO Architecture (`lib/seo.ts`)**:
  - `getSiteUrl()`: Configurable site URL defaulting to `https://halodental.in` or reading `NEXT_PUBLIC_SITE_URL`.
  - `constructMetadata()`: Automatic canonical URLs, multilingual hreflang (`en`, `ml`, `x-default`), OpenGraph images and metadata, Twitter Card summaries, and robots directives.
  - `generateClinicJsonLd()`: Verified Dentist & MedicalBusiness schema with Dr. Haseeb (BDS, MDS Orthodontics), Angadipuram location, coordinates, working hours, and phone `+91 85470 85403`.
  - `generateServiceJsonLd()`: Schema.org Service structured data for all treatment pages with procedure categories and provider details.
  - `generateBreadcrumbJsonLd()`: BreadcrumbList schema matching visible hierarchy on all public pages.
  - `generateArticleJsonLd()`: Article schema for published patient guides with author Dr. Haseeb, dates, and cover images.
  - `generateFaqJsonLd()`: FAQPage schema matching visible accordion content.
- **Dynamic Search Engine Directives**:
  - `app/sitemap.ts`: Dynamic sitemap querying active treatments and published articles from Supabase; maps bilingual English (`/`) and Malayalam (`/ml`) entries with accurate `lastModified` and change frequencies; strictly excludes `/admin/*`, private routes, and draft posts.
  - `app/robots.ts`: Allows public crawling, blocks `/admin`, `/admin/`, `/api`, `/api/`, and points to dynamic sitemap URL.
- **Full Public Route Coverage (EN + ML)**:
  - `app/[locale]/(public)/about/page.tsx`: Comprehensive Dr. Haseeb bio, qualifications, sterilization standards, clinic hours, Breadcrumbs schema, and bilingual metadata.
  - `app/[locale]/(public)/services/page.tsx`: Treatment directory with Breadcrumb schema and localized metadata.
  - `app/[locale]/(public)/services/veneers/page.tsx`: Completed Porcelain Veneers procedure page replacing empty scaffold with benefits, steps, FAQs, Service schema, and booking CTAs.
  - `app/[locale]/(public)/services/[slug]/page.tsx`: Dynamic DB-backed treatment detail route with fallback and Service/Breadcrumb schemas.
  - Static Service Pages: Added `generateMetadata`, `generateBreadcrumbJsonLd`, and `generateServiceJsonLd` across `clear-aligners`, `dental-implants`, `general-dentistry`, `root-canal-treatment`, `smile-makeovers`, and `teeth-whitening`.
  - `app/[locale]/(public)/gallery/page.tsx`: Responsive gallery querying published `gallery_items` from Supabase with accessible descriptive alt texts and Breadcrumb schema.
  - `app/[locale]/(public)/blog/page.tsx` & `[slug]/page.tsx`: Patient guides index and article template querying published `blog_posts` from Supabase with Article/Breadcrumb schemas and reading time.
  - `app/[locale]/(public)/booking/page.tsx`: Bilingual booking metadata and Breadcrumbs schema.
  - `app/[locale]/(public)/contact/page.tsx`: Comprehensive clinic location, hours, Google Maps directions, phone, WhatsApp, and LocalBusiness schema.
  - `app/[locale]/(public)/faq/page.tsx`: Accessible categorized accordion with FAQPage schema.
  - `app/[locale]/(public)/privacy-policy/page.tsx`: DPDPA-compliant patient data confidentiality policy.
  - `app/not-found.tsx`: Branded, accessible 404 page with navigation links to Home, Treatments, and Booking.
- **Accessibility & Web Vitals Optimizations**:
  - Added visible "Skip to content" keyboard link and `id="main-content"` landmark in `app/[locale]/(public)/layout.tsx`.
  - Configured `priority` loading on above-the-fold hero images with responsive `sizes` in `components/marketing/Hero.tsx`.
  - Added strict production security headers in `next.config.mjs` (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Strict-Transport-Security`).
  - Completely removed obsolete Netlify configuration (`netlify.toml`) and configured standard Next.js Vercel deployment without `output: "export"`.

### Verified
- **TypeScript Typecheck (`npm run typecheck`)**: Passed with 0 errors.
- **ESLint (`npm run lint`)**: Passed with 0 warnings/errors.
- **Production Build (`npm run build`)**: Compiled 55/55 routes successfully with exit code 0.
- **Route QA**: Verified HTTP 200 on all 27 public and localized routes, `/robots.txt`, and `/sitemap.xml`.
- **Booking Regression**: Verified real Supabase active services query, bilingual service names, and Sunday restriction logic.
- **Admin Regression**: Verified full authentication lifecycle, manual bookings, patient management, double-booking collision protection, availability blocks, and clean database teardown.
- **GitHub Audit**: Verified `.gitignore` prevents `.env*`, `.env.local`, `scratch/`, and temporary build artifacts from being tracked. Zero secrets committed.

## [Stage 5.5: Admin UX + Content Management Polish] - 2026-10-04


### Added
- **Reusable Cloud Image Uploader (`components/admin/ImageUploader.tsx`)**:
  - Drag-and-drop file upload interface with visual dropzone, choose file button, hover replace/remove actions, loading spinners, and error alerts.
  - Client-side validation: restricts to JPEG, PNG, WebP, SVG with a 10MB file size ceiling.
  - Server-side integration: pairs with `uploadAdminImageAction` writing safely to the `clinic-public` Supabase Storage bucket with authenticated session enforcement and audit logging.
- **Accessible Confirmation Dialog (`components/admin/ConfirmDialog.tsx`)**:
  - Accessible modal dialog replacing browser native `alert()` and `confirm()` for dangerous actions (deleting services, blog articles, gallery items, testimonials, unpublishing).
  - Configurable danger, warning, and primary variants with animated loading spinners and disabled state handling.
- **Grouped Admin Sidebar Navigation (`components/admin/AdminSidebar.tsx`)**:
  - Hierarchical structure with uppercase section headers: `DASHBOARD`, `APPOINTMENTS`, `PATIENTS`, `CONTENT`, and `SETTINGS`.
  - Active route indicators with teal accents and Lucide icons.
  - Mobile responsive drawer with animated backdrop overlay and smooth slide-over transition.
- **Prominent Dashboard Quick Actions Panel (`components/admin/DashboardClient.tsx`)**:
  - Six quick-action shortcuts: `+ New Appointment`, `+ Add Patient`, `+ Add Service`, `+ Write Blog`, `+ Upload Gallery`, `+ Add Testimonial`.
  - Direct modal triggers and URL query param (`?new=1`) integration for opening creation workflows across CMS pages.
- **Services Simple CMS (`/admin/services`)**:
  - Rebuilt `/admin/services` with search query filtering, active/inactive status tabs, and order/name/duration sorting.
  - Replaced technical/bilingual form with clean English-first `ServiceEditorModal` (Service Name, Category, Short Description, Full Description, Pricing, Duration, Service Image via `ImageUploader`, Display Order, Status).
  - Automatic database compatibility: English text automatically populates `name_ml` and `description_ml` so public Malayalam views work without forcing duplicate data entry on staff.
  - Integrated `ServicePreviewModal` simulating the live patient booking appearance.
- **Blog Content Management System (`/admin/blog`)**:
  - Clean article management table showing cover thumbnails, title, category, author, status, and published date.
  - `BlogEditorModal`: Non-technical article authoring (Title, Excerpt, Content, Category, Cover Image via `ImageUploader`, Doctor/Staff author selector, optional SEO meta tags, Draft / Publish workflows).
  - `BlogPreviewModal`: Live preview styled identically to public patient guides with estimated reading time.
  - Publish / Unpublish instant toggles with draft protection (drafts never appear publicly).
- **Gallery Showcase & Transformation CMS (`/admin/gallery`)**:
  - Responsive visual image grid displaying single clinic photos or side-by-side Before/After treatment cases.
  - `GalleryUploadModal`: Support for both "Normal Gallery" (single image) and "Before & After" (dual image pair) with treatment procedure dropdown and duration.
  - `GalleryPreviewModal`: Comparison showcase preview before publishing.
  - Instant publish / unpublish toggling and delete confirmation.
- **Testimonials Moderation CMS (`/admin/testimonials`)**:
  - Intuitive review cards showing 5-star rating, patient quote, name, treatment procedure, and moderation status.
  - `TestimonialModal`: Interactive 5-star rating selector (`★ ★ ★ ★ ★`), patient name, testimonial quote, procedure selector, optional photo via `ImageUploader`, and approve/publish buttons.
  - Filter controls by search, approval status, and star rating.

### Verified
- **TypeScript Typecheck**: `npm run typecheck` passed with 0 errors.
- **ESLint**: `npm run lint` passed with 0 warnings/errors.
- **Production Build**: `npm run build` compiled successfully with 48/48 routes prerendered/configured cleanly.
- **Automated E2E CMS Test (`scratch/e2e_cms_test.js`)**: All 21 content management and public visibility steps passed with 100% clean teardown (zero database pollution).
- **Route Health & Zero Regressions**: Verified 200 HTTP status on `/`, `/ml`, `/booking`, `/ml/booking`, `/services`, `/ml/services`, `/admin/login`, and 307 redirects for unauthenticated `/admin/*` routes.

## [Stage 5: Complete Admin Dashboard — Patients, Appointments & Availability] - 2026-10-04

### Added
- **Server-Side Authentication & Role-Based Access Control (`lib/admin/auth.ts`)**:
  - `getAdminSession()`: Authoritative server session validator resolving Supabase Auth cookies and cross-verifying active `staff_users` records.
  - `requireAdminSession()` / `requireRole()`: Route guards redirecting unauthenticated or deactivated staff to `/admin/login` and rejecting unauthorized roles with 403 Forbidden.
  - `logAdminAction()`: Structured administrative audit logging recording mutations to `audit_logs` (without logging passwords or secrets).
- **Core Edge Route Protection (`lib/supabase/middleware.ts` & `middleware.ts`)**:
  - Automatic redirect of unauthenticated `/admin/*` traffic to `/admin/login`.
  - Automatic redirect of authenticated staff visiting `/admin/login` directly to `/admin`.
- **Authoritative Server Actions (`app/actions/admin.ts`)**:
  - Complete server-side mutation suite with Zod validation: `adminLogin`, `adminLogout`, `createPatientAction`, `updatePatientAction`, `deletePatientAction`, `createAdminAppointmentAction`, `updateAppointmentStatusAction`, `rescheduleAppointmentAction`, `createAvailabilityBlockAction`, `deleteAvailabilityBlockAction`, `saveServiceAction`, `toggleServiceStatusAction`, `updateTestimonialModerationAction`, `deleteTestimonialAction`, `toggleGalleryItemPublishAction`, `deleteGalleryItemAction`, `toggleBlogPostStatusAction`, `deleteBlogPostAction`, and `updateClinicContactAction`.
- **Manual Patient Management (`/admin/patients`)**:
  - Patient search, multi-field filtering, registry listing, profile editing, and visit history timeline inspection.
  - Phone intake patient creation with phone normalization and duplicate record prevention.
- **Manual Appointment Creation & Double-Booking Protection (`/admin/bookings`)**:
  - Multi-step manual booking wizard for staff allowing existing patient selection or inline patient creation.
  - Server-authoritative double-booking collision prevention verifying doctor, operating hours, Sunday restriction, overlapping appointments, and availability blocks.
  - Inserts directly into the unified `appointments` table with `HD-YYYY-XXXX` reference codes.
  - Rescheduling wizard with slot availability verification and status lifecycle controls (`pending`, `confirmed`, `completed`, `cancelled`, `no_show`).
- **Interactive Calendar Schedule (`/admin/calendar`)**:
  - Unified Day and Week scheduling views displaying combined public bookings, manual staff appointments, and active availability blocks with patient, service, doctor, and status indicators.
- **Doctor & Clinic Availability Management (`/admin/availability`)**:
  - Live 30-minute daily slot availability grid reflecting real-time bookings.
  - Dedicated time-blocking engine supporting whole-clinic or doctor-specific blocks (e.g. seminars, meetings, surgery periods) with immediate reflection across both the admin calendar and public booking engine (`checkSlotAvailable`, `getDailySlotAvailability`).
- **Full Administrative Management Modules**:
  - `/admin`: Dashboard overview with today's metrics, actionable pending booking triage, and global quick-action modal triggers.
  - `/admin/services`: Clinical service catalog manager with bilingual name/description editing and instant status toggling.
  - `/admin/testimonials`: Patient review moderation interface with approval, rejection, and deletion workflows.
  - `/admin/gallery`: Before/after clinical smile case manager with image preview pairing and publishing controls.
  - `/admin/blog`: Clinical dental education article manager with draft/published status toggling.
  - `/admin/settings`: Clinic operating hours, contact phone, WhatsApp link, and address management.
- **Database Availability Migration**:
  - Created `supabase/migrations/20261004000001_availability_blocks.sql` establishing the `availability_blocks` schema with staff RLS policies and indexes, complemented by a seamless `site_settings` fallback store for zero-downtime backward compatibility.

### Verified
- **TypeScript Typecheck**: `npm run typecheck` passed with 0 errors.
- **ESLint**: `npm run lint` passed with 0 warnings/errors.
- **Production Build**: `npm run build` compiled successfully with 48/48 routes prerendered/configured cleanly.
- **End-to-End Automated Integration**: Verified patient creation, phone intake booking, double-booking rejection, availability blocking, slot reflection, appointment rescheduling, status transitions, and automated zero-pollution database cleanup.
- **Zero Regression**: Confirmed Stage 3 booking architecture and Stage 4 English/Malayalam bilingual localization remain intact and operational.

## [Stage 4: Complete Bilingual Localization (EN / ML)] - 2026-10-04

### Added
- **Full Bilingual Translation Catalogues (`messages/en.json` & `messages/ml.json`)**:
  - Implemented comprehensive 1:1 structured translation dictionaries covering `nav`, `cta`, `header`, `footer`, `hero`, `trustStrip`, `about`, `services`, `whyChoose`, `showcase`, `testimonials`, `faq` (all 8 FAQs with schema JSON-LD), `finalCta`, `floating`, and `booking`.
  - Authored natural, culturally resonant, and clinically accurate Malayalam translations tailored for patients in Malappuram and Kerala.
- **Component-Level Localization Integration**:
  - Global Navigation & Layout: Localized [Header.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/layout/Header.tsx), [Footer.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/layout/Footer.tsx), and [LanguageSwitcher.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/layout/LanguageSwitcher.tsx) with route-preserving language toggling (`/` ↔ `/ml`).
  - Homepage Marketing Sections: Fully localized [Hero.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/Hero.tsx), [TrustStrip.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/TrustStrip.tsx), [AboutSection.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/AboutSection.tsx), [ServiceGrid.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/ServiceGrid.tsx), [WhyChooseSection.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/WhyChooseSection.tsx), [BeforeAfterSection.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/BeforeAfterSection.tsx), [BeforeAfterSlider.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/BeforeAfterSlider.tsx), [TestimonialsSection.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/TestimonialsSection.tsx), [TestimonialCarousel.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/TestimonialCarousel.tsx), [FAQSection.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/FAQSection.tsx), and [FinalCtaSection.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/FinalCtaSection.tsx).
  - Floating CTAs: Localized [FloatingWhatsAppButton.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/marketing/FloatingWhatsAppButton.tsx) and [FloatingBookingWidget.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/booking/FloatingBookingWidget.tsx).
  - Dedicated Public Pages: Localized [services/page.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/app/[locale]/(public)/services/page.tsx), [booking/page.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/app/[locale]/(public)/booking/page.tsx), and service detail subpages with locale-aware routing.
- **End-to-End Bilingual Booking Form Wizard**:
  - Integrated `useTranslations("booking")` inside [BookingForm.tsx](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/components/booking/BookingForm.tsx) for dynamic step indicators, service selection, calendar date picker, Sunday closure warnings, live slot availability chips, client-side validation errors, success screen with reference code copy, and quick WhatsApp/phone outreach buttons.
- **Dynamic Database Service Title Localization**:
  - Updated `getActiveServices(locale)` in [app/actions/booking.ts](file:///c:/RYANTO/website/halo%20detnal/halo-dental-phase1-scaffold/halo-dental/app/actions/booking.ts) to dynamically serve `name_en` for English visitors and `name_ml` for Malayalam visitors without hardcoded identifiers.

### Verified
- **TypeScript Typecheck**: Passed `npm run typecheck` with 0 errors.
- **ESLint**: Passed `npm run lint` with 0 warnings/errors.
- **Next.js Production Build**: Passed `npm run build` with all 45/45 static pages cleanly prerendered.
- **Bilingual Route Accessibility (HTTP 200)**: Verified 100% 200 OK responses across English and Malayalam variants: `/`, `/ml`, `/about`, `/ml/about`, `/services`, `/ml/services`, `/booking`, `/ml/booking`, `/gallery`, `/ml/gallery`, `/faq`, `/ml/faq`, `/blog`, `/ml/blog`, and all service subpages.
- **Booking Rules**: Confirmed Sunday closure enforcement and real Supabase service retrieval in both languages.

## [P1: Live Verification & Supabase Production Readiness] - 2026-10-02

### Verified
- **Live Supabase Connection & Migrations**: Successfully connected to live Supabase endpoint and verified migrations `20260930000001_initial_schema.sql`, `20260930000002_rls_and_policies.sql`, and `20260930000003_storage_buckets.sql` are applied and operational.
- **11 Core Database Tables Verified**: Confirmed existence, schema constraints, and accessibility of all 11 tables: `clinics`, `staff_users`, `doctors`, `services`, `patients`, `appointments`, `testimonials`, `blog_posts`, `gallery_items`, `audit_logs`, and `site_settings`.
- **Row Level Security (RLS) Enforcement**: Verified that public anonymous requests cannot query private tables (`patients`, `appointments`, `staff_users`, `audit_logs`). Verified public read access to active services and clinics.
- **Storage Buckets**: Verified `clinic-public` (`public: true`) and `patient-records` (`public: false`) with strict access restrictions.
- **Admin Authentication**: Confirmed Supabase Auth admin user linkage to `staff_users` with `admin` role and active status.
- **End-to-End Booking Transaction**: Created real test appointment with automatic patient upsert, `HD-YYYY-XXXX` reference code generation, and `status: pending`.
- **Double-Booking Prevention**: Verified slot availability engine blocks duplicate bookings on occupied date/time slots.
- **Security & Secrets Isolation**: Verified server-only boundary for `SUPABASE_SERVICE_ROLE_KEY`, distinct keys from `NEXT_PUBLIC_SUPABASE_ANON_KEY`, zero secret exposure, and gitignored `.env.local`.
- **Application Regression Gates**: Passed `npm run typecheck` (0 errors), `npm run lint` (0 warnings/errors), and `npm run build` (45/45 static pages pre-rendered cleanly).
- **Milestone Status**: Formally declared **READY FOR P2**.

## [P1: Supabase Database Foundation & Booking Infrastructure] - 2026-09-30

### Added
- **Database Migrations (`supabase/migrations/`)**:
  - `20260930000001_initial_schema.sql`: Full production schema for 11 core tables (`clinics`, `doctors`, `services`, `patients`, `appointments`, `testimonials`, `blog_posts`, `gallery_items`, `staff_users`, `audit_logs`, `site_settings`) with UUID primary keys, foreign keys, timestamps, triggers, indexes, and check constraints.
  - `20260930000002_rls_and_policies.sql`: Row Level Security (RLS) enabled on all 11 tables with granular security definer helper functions (`public.is_staff()`, `public.is_admin()`) and restrictive policies.
  - `20260930000003_storage_buckets.sql`: Storage buckets `clinic-public` and `patient-records` with strict RLS policies.
- **TypeScript Database Schema Types**: Generated complete schema definitions in `types/database.types.ts` replacing placeholder `Database = Record<string, unknown>`.
- **Server-Side Booking Infrastructure**:
  - `lib/validations/bookingSchema.ts`: Comprehensive Zod validation schema with phone regex, operating hour checks, and honeypot bot trap.
  - `lib/booking/availability.ts`: Slot availability engine (`checkSlotAvailable`, `getDailySlotAvailability`, `generateTimeSlots`) preventing double-booking and race conditions.
  - `app/actions/booking.ts`: Server action (`createBooking`) performing server-side validation, slot verification, patient lookup/upsert, and appointment insertion with unique reference codes (`HD-YYYY-XXXX`).
- **UI Primitives (`components/ui/`)**:
  - `Button.tsx`: Accessible, design-system compliant button with loading spinner and variants.
  - `Input.tsx`: Form input primitive with label, error states, and helper text.
  - `Select.tsx`: Form select dropdown primitive.
  - `Badge.tsx`: Status indicator badge primitive for appointment and moderation states.
  - `Card.tsx`: Structural surface card primitive.
  - `components/booking/BookingForm.tsx`: Production-ready booking form wizard connecting to the server action.

### Security
- **Strict RLS**: Patient private data and appointment records are protected against unauthorized public queries; staff/admin operations require validated database role authentication.
- **Bot & Spam Mitigation**: Implemented hidden honeypot validation in booking server action.
- **Fail-Safe Clients**: Browser and SSR Supabase clients fallback safely to dummy endpoints when environment variables are absent, preventing 500 errors.

---

## [Phase 0: Project Scaffold & P0 Audit Resolution] - 2026-09-30

### Added
- **Developer Documentation Suite (`/docs`)**:
  - `docs/ARCHITECTURE.md`: Complete end-to-end architecture, request flow, and change directory.
  - `docs/DEVELOPER-GUIDE.md`: Beginner-friendly guide explaining Next.js, TypeScript, Tailwind, and troubleshooting.
  - `docs/DATABASE.md`: PostgreSQL and Supabase table schema, relationships, indexes, and RLS specifications.
  - `docs/ENVIRONMENT.md`: Comprehensive breakdown of all public and secret environment variables.
- **Patient Testimonial Carousel**: Restored `components/marketing/TestimonialCarousel.tsx` with WCAG-compliant accessibility roles, keyboard navigation (Left/Right arrows), star ratings, and brand design system styling.
- **Codebase Standards**: Standardized file-level headers and function documentation across key entrypoints (`lib/supabase/middleware.ts`, `lib/i18n-request.ts`, `lib/i18n.ts`, `middleware.ts`, `app/[locale]/layout.tsx`, and dynamic slug routes).

### Changed
- **Next.js 14 Params Typing**: Corrected route parameter typing in `services/[slug]/page.tsx` and `blog/[slug]/page.tsx` from Next.js 15 async Promises (`Promise<{ slug: string }>`) to synchronous Next.js 14 parameter objects (`{ params: { locale: string; slug: string } }`).
- **i18n Request Configuration**: Updated `lib/i18n-request.ts` to next-intl's current `getRequestConfig` implementation using `await requestLocale` to resolve dynamic message bundles cleanly.
- **Sitemap**: Populated `app/sitemap.ts` with valid canonical URLs and change frequencies.

### Fixed
- **Static Page Prerendering (SSG)**: Fixed next-intl production build failure by implementing `setRequestLocale(locale)` across all page and layout components in the `app/[locale]` tree, allowing Next.js 14 to generate 43/43 static pages cleanly.
- **`/admin` Route HTTP 500**: Fixed unhandled exceptions when Supabase credentials were missing in local or staging environments. Replaced non-null assertions with safe guards in `lib/supabase/middleware.ts` so the application fails safely without exposing error details.

### Security
- **Fail-Safe Middleware**: Ensured `lib/supabase/middleware.ts` never leaks `NEXT_PUBLIC_SUPABASE_ANON_KEY`, service keys, or user session tokens in error logs or HTTP responses.
- **Authentication Resilience**: Preserved the standard Supabase authentication and session-refresh flow so admin access controls function seamlessly once environment variables are configured.
