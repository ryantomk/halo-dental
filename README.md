# Halo Dental Cosmetic & Orthodontic Centre — Phase 1: Project Scaffold

This is the project skeleton only. No business logic, styling, or real UI is
implemented yet — every route and component file is a stub with a `TODO`
pointing at the relevant section of `halo-dental-technical-specification.md`.
Config files (package.json, tsconfig, Tailwind, middleware, Supabase
clients, i18n setup) have real, working content because they *are* the
architecture this phase is meant to lock down.

## Source of truth

Every decision below traces back to one of the two uploaded specs:

- `halo-dental-project-specification.md` — business/product requirements
- `halo-dental-technical-specification.md` — technical requirements, schema, page structure

Nothing here contradicts or redesigns either document. Where the specs left
an implementation detail unstated, it's called out explicitly below so you
can approve or correct it before Phase 2.

## Folder structure

```
app/
  layout.tsx                    Root layout (no html/body — see note below)
  globals.css                   Tailwind + brand CSS variables + :lang(ml) font rule
  sitemap.ts, robots.ts         SEO stubs
  [locale]/                     en / ml — see "Locale routing" below
    layout.tsx                  Sets <html lang>, provides next-intl messages
    (public)/
      layout.tsx                Header/Footer/WhatsApp/booking-widget chrome
      page.tsx                  Home
      about/page.tsx
      services/page.tsx
      services/[slug]/page.tsx  11 service landing pages (generateStaticParams TODO)
      gallery/page.tsx
      blog/page.tsx
      blog/[slug]/page.tsx
      faq/page.tsx
      contact/page.tsx
      privacy-policy/page.tsx
  admin/                        Staff dashboard — NOT under [locale], see below
    layout.tsx                  Auth guard + sidebar shell (TODO)
    login/page.tsx
    page.tsx                    Dashboard home
    bookings/, services/, blog/, gallery/, testimonials/, settings/

components/
  layout/      Header, Footer, LanguageSwitcher, MobileNav
  ui/          Button, Card, Badge, Accordion, Modal, Input, Select,
               DatePicker, TimeSlotPicker, Toast
  marketing/   Hero, TrustStrip, ServiceCard/Grid, BeforeAfterSlider,
               TestimonialCard/Carousel, FAQAccordion, BlogCard,
               FloatingWhatsAppButton
  booking/     BookingForm, FloatingBookingWidget, AvailabilityCalendar
  admin/       DashboardStatCard, BookingsTable, BookingDetailModal,
               ServiceEditorForm, BlogEditorForm, GalleryUploader,
               TestimonialModerationRow, RoleGuard, AdminSidebar

lib/
  supabase/    client.ts (browser), server.ts (RSC/actions), middleware.ts (session refresh)
  i18n.ts, i18n-request.ts   next-intl config
  validations/ bookingSchema (implemented), serviceSchema, blogPostSchema (stubs)
  notifications/ whatsapp.ts, sms.ts, email.ts (stubs — real bodies live in Supabase Edge Functions later)
  utils.ts     cn() classname helper

messages/      en.json, ml.json — next-intl message bundles (nav + CTA keys seeded)
types/         database.types.ts (placeholder — generate via Supabase CLI), index.ts
supabase/
  config.toml
  migrations/  empty — schema SQL lands in Phase 2
  functions/   empty — notify-new-booking / notify-booking-status land later
middleware.ts  Root middleware: routes /admin/* to session refresh, everything else to next-intl
```

This matches the component tree in technical spec Section 5 exactly, with
`app/`, `components/`, and `lib/` as top-level siblings (no `src/` directory).

## Decisions made to fill implementation gaps

The specs describe *what* routes and behavior must exist but don't specify
the exact Next.js routing mechanics. Two concrete choices were made,
consistent with (not contradicting) the specs:

1. **`/ml/...` is implemented as an `app/[locale]/` dynamic segment**, using
   `next-intl`'s middleware to handle the `as-needed` locale prefix (English
   stays at `/`, Malayalam at `/ml/...`). This is the standard way to satisfy
   "Next.js i18n routing with a language toggle" (project spec Section 3) and
   "next-intl locale prefix" (technical spec Section 3) in the App Router.

2. **`/admin` sits outside the `[locale]` segment**, since neither spec
   describes a Malayalam admin dashboard — only the public site is bilingual.
   `app/admin/layout.tsx` sets its own `<html lang="en">` independently.
   `middleware.ts` branches on the `/admin` path prefix before handing off to
   the next-intl middleware, and is also where the Supabase session-refresh
   logic runs (technical spec Section 14: session checks must be
   server-side, not just client redirects).

A side effect: `app/layout.tsx` (the true root) deliberately does **not**
render `<html>`/`<body>` — both `app/[locale]/layout.tsx` and
`app/admin/layout.tsx` do, since they're the first point where the correct
`lang` attribute is known. Flag this in review if you'd prefer a different
split.

## What's real vs. stubbed in this phase

**Real / functional:**
- `package.json`, `tsconfig.json`, `tailwind.config.ts` (brand tokens transcribed exactly from both specs), `next.config.mjs`, `netlify.toml`, `.env.example`
- `middleware.ts` + `lib/supabase/{client,server,middleware}.ts` — full auth/session/locale routing logic
- `lib/i18n.ts`, `lib/i18n-request.ts`, seed `messages/en.json` / `messages/ml.json`
- `lib/validations/bookingSchema.ts` — matches the `appointments` insert shape
- `lib/utils.ts` (`cn()` helper)
- `app/globals.css` — Tailwind layers + the `:lang(ml)` Noto Sans Malayalam fallback rule (typography spec Section 8)

**Stubbed (structure only, logic deferred):**
- Every page in `app/[locale]/(public)/**` and `app/admin/**`
- Every component in `components/**`
- `lib/validations/serviceSchema.ts`, `blogPostSchema.ts`
- `lib/notifications/*.ts`
- `supabase/migrations/`, `supabase/functions/` (empty, schema/Edge Functions not yet written)
- `types/database.types.ts` (placeholder until generated from a real schema)

## Suggested next phases

1. **Supabase schema & RLS** — translate technical spec Section 10–11 into
   numbered migrations under `supabase/migrations/`, plus the two Edge
   Functions (`notify-new-booking`, `notify-booking-status`).
2. **Design system primitives** — implement `components/ui/*` against the
   Tailwind tokens already in place.
3. **Public marketing pages** — Home first (matches `homepage_wireframe.html`),
   then the service landing page template.
4. **Booking flow** — `BookingForm`, `AvailabilityCalendar`, the Zod-validated
   insert, and the notification triggers end-to-end.
5. **Admin dashboard** — auth guard, bookings table, services/blog/gallery/testimonials CRUD.

Let me know which order you'd like, or if you want changes to anything above
before I continue.
