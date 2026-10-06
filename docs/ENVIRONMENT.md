# Halo Dental Environment Variables Guide

This document explains every environment variable used across the Halo Dental application.

> **CRITICAL SECURITY RULES:**
> 1. NEVER commit `.env.local` or any file containing real credentials to version control.
> 2. NEVER expose service-role keys or database passwords in client components, browser bundles, console logs, or documentation.
> 3. Only `.env.example` (containing empty/placeholder keys) should be tracked in Git.
> 4. If any service-role key or database secret is ever inadvertently displayed or compromised, rotate it immediately in the Supabase Dashboard.

---

## Variable Summary Table

| Variable Name | Type | Scope | Used By | Required For |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | **Public** | Client & Server | Browser, Server, Middleware | Supabase API connection endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Public** | Client & Server | Browser, Server, Middleware | Public queries & user session authentication |
| `NEXT_PUBLIC_SITE_URL` | **Public** | Client & Server | Metadata, SEO | Canonical URLs, sitemap, OpenGraph previews |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Server-Only | Server Actions (`lib/supabase/admin.ts`) | Elevated administrative tasks (bypassing RLS) |
| `DATABASE_URL` | **Secret** | CLI / Migrations | Local scripts, direct DB tools | Direct PostgreSQL connection string |
| `WHATSAPP_CLOUD_API_TOKEN` | **Secret** | Server / Edge Functions | Edge Functions | Meta WhatsApp Cloud API automated notifications |
| `WHATSAPP_PHONE_NUMBER_ID` | **Secret** | Server / Edge Functions | Edge Functions | Sender phone ID in Meta Business Manager |
| `SMS_GATEWAY_API_KEY` | **Secret** | Server / Edge Functions | Notification helpers | Transactional fallback SMS alerts |
| `RESEND_API_KEY` | **Secret** | Server / Edge Functions | Notification helpers | Transactional email delivery for bookings |

---

## Detailed Variable Specifications

### 1. `NEXT_PUBLIC_SUPABASE_URL`
- **Description**: The unique HTTPS project endpoint for your Supabase project (e.g., `https://[project-ref].supabase.co`).
- **Where It Is Used**:
  - `lib/supabase/client.ts` (Browser Supabase client)
  - `lib/supabase/server.ts` (Server Components & Server Actions)
  - `lib/supabase/middleware.ts` (Session refresh in Next.js middleware)
  - `lib/supabase/admin.ts` (Server-only administrative client)
- **Exposure**: **Public** (bundled into client-side JavaScript). Safe because data access is secured by PostgreSQL Row Level Security (RLS).
- **Where To Obtain**: Supabase Dashboard → **Project Settings** → **API** → **Project URL**.

---

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description**: The public anonymous API key for your Supabase project.
- **Where It Is Used**:
  - `lib/supabase/client.ts`
  - `lib/supabase/server.ts`
  - `lib/supabase/middleware.ts`
- **Exposure**: **Public** (safe for browser exposure). Used alongside user auth cookies to execute queries governed by RLS policies.
- **Where To Obtain**: Supabase Dashboard → **Project Settings** → **API** → **Project API keys** (`anon` / `public`).

---

### 3. `NEXT_PUBLIC_SITE_URL`
- **Description**: The primary base domain for the deployed website (e.g. `https://halodental.in` in production, or `http://localhost:3000` in development).
- **Where It Is Used**:
  - `app/sitemap.ts` (Generating canonical URLs for search engines)
  - `app/robots.ts` (Referencing the sitemap location)
  - Metadata OpenGraph tags
- **Exposure**: **Public**.

---

### 4. `SUPABASE_SERVICE_ROLE_KEY`
- **Description**: The master administrative secret key for your Supabase project. Bypasses all Row Level Security.
- **Where It Is Used**:
  - `lib/supabase/admin.ts` (Server-side admin client)
  - `app/actions/booking.ts` (Booking transactions & patient directory management)
  - `lib/booking/availability.ts` (Server-side appointment collision verification)
- **Exposure**: **SECRET — STRICTLY SERVER-ONLY**.
  - Must NEVER have a `NEXT_PUBLIC_` prefix.
  - Never import or reference in client components (`"use client"`).
  - Never log or return in error payloads.
- **Where To Obtain**: Supabase Dashboard → **Project Settings** → **API** → **Project API keys** (`service_role` secret).

---

### 5. `DATABASE_URL`
- **Description**: Direct PostgreSQL connection string (URI) for database migrations and CLI utilities.
- **Format**: `postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres`
- **Exposure**: **SECRET — STRICTLY LOCAL / CI-CD**.
  - Never display, commit, or log this value.
- **Where To Obtain**: Supabase Dashboard → **Project Settings** → **Database** → **Connection string** (URI mode).

---

### 6. `WHATSAPP_CLOUD_API_TOKEN` & `WHATSAPP_PHONE_NUMBER_ID`
- **Description**: Meta Cloud API credentials for automated WhatsApp booking notifications.
- **Where It Is Used**: Edge Functions (`supabase/functions/notify-new-booking` and `notify-booking-status`).
- **Exposure**: **SECRET**.

---

### 7. `SMS_GATEWAY_API_KEY`
- **Description**: API key for transactional SMS provider (e.g., MSG91, Twilio) as a fallback when WhatsApp is unavailable.
- **Exposure**: **SECRET**.

---

### 8. `RESEND_API_KEY`
- **Description**: API key for the Resend transactional email service for booking confirmation emails and clinic staff alerts.
- **Exposure**: **SECRET**.

---

## Fail-Safe Client Handling

To guarantee uninterrupted local development and resilient builds:
1. `lib/supabase/client.ts` and `lib/supabase/server.ts` fallback gracefully to mock URLs if variables are temporarily absent.
2. `lib/supabase/middleware.ts` skips session updates safely without throwing exceptions or logging secrets if credentials are unconfigured.
3. `app/actions/booking.ts` safely logs mock confirmations in preview/local mode if Supabase environment variables are missing.
