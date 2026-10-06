-- ============================================================================
-- HALO DENTAL - Phase 1 Migration 02: Row Level Security & Staff Authorization
-- Description: Enables RLS across all tables and establishes role-based policies.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Security Helper Functions (SECURITY DEFINER to prevent recursion)
-- ----------------------------------------------------------------------------

-- Check if current authenticated user is an active staff member
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_users
    WHERE id = auth.uid()
    AND is_active = true
  );
$$;

-- Check if current authenticated user is an active administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_users
    WHERE id = auth.uid()
    AND role = 'admin'
    AND is_active = true
  );
$$;

-- ----------------------------------------------------------------------------
-- Enable Row Level Security on all tables
-- ----------------------------------------------------------------------------
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- 1. Table: clinics
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view active clinic info"
  ON public.clinics FOR SELECT
  USING (is_active = true OR public.is_staff());

CREATE POLICY "Admins can manage clinics"
  ON public.clinics FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 2. Table: staff_users
-- ----------------------------------------------------------------------------
CREATE POLICY "Staff can view own profile or admins can view all"
  ON public.staff_users FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can manage staff users"
  ON public.staff_users FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 3. Table: doctors
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view active doctors"
  ON public.doctors FOR SELECT
  USING (is_active = true OR public.is_staff());

CREATE POLICY "Staff can manage doctors"
  ON public.doctors FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- ----------------------------------------------------------------------------
-- 4. Table: services
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view active services"
  ON public.services FOR SELECT
  USING (is_active = true OR public.is_staff());

CREATE POLICY "Staff can manage services"
  ON public.services FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- ----------------------------------------------------------------------------
-- 5. Table: patients (Sensitive Patient Information)
-- ----------------------------------------------------------------------------
-- Public visitors CANNOT select from the patients table.
CREATE POLICY "Staff can view patient records"
  ON public.patients FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- Public can insert their own patient record during appointment booking
CREATE POLICY "Anyone can register patient details during booking"
  ON public.patients FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Staff can update patient records"
  ON public.patients FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- ----------------------------------------------------------------------------
-- 6. Table: appointments (Protected Booking Information)
-- ----------------------------------------------------------------------------
-- Staff can view all appointments
CREATE POLICY "Staff can view all appointments"
  ON public.appointments FOR SELECT
  TO authenticated
  USING (public.is_staff());

-- Public can insert new appointments, strictly forced to 'pending' status
CREATE POLICY "Public can request appointment with pending status"
  ON public.appointments FOR INSERT
  WITH CHECK (status = 'pending');

-- Staff can update or manage appointments (confirm, reschedule, cancel)
CREATE POLICY "Staff can update appointments"
  ON public.appointments FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can delete appointments"
  ON public.appointments FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ----------------------------------------------------------------------------
-- 7. Table: testimonials
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view approved testimonials"
  ON public.testimonials FOR SELECT
  USING (is_approved = true OR public.is_staff());

-- Public submissions default to unapproved (is_approved = false)
CREATE POLICY "Public can submit unapproved testimonial"
  ON public.testimonials FOR INSERT
  WITH CHECK (is_approved = false OR public.is_staff());

CREATE POLICY "Staff can manage testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

CREATE POLICY "Staff can delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (public.is_staff());

-- ----------------------------------------------------------------------------
-- 8. Table: blog_posts
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' OR public.is_staff());

CREATE POLICY "Staff can manage blog posts"
  ON public.blog_posts FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- ----------------------------------------------------------------------------
-- 9. Table: gallery_items
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view published gallery items"
  ON public.gallery_items FOR SELECT
  USING (is_published = true OR public.is_staff());

CREATE POLICY "Staff can manage gallery items"
  ON public.gallery_items FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());

-- ----------------------------------------------------------------------------
-- 10. Table: audit_logs (Immutable activity journal)
-- ----------------------------------------------------------------------------
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Staff can append audit logs"
  ON public.audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (public.is_staff());

-- ----------------------------------------------------------------------------
-- 11. Table: site_settings
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can read public settings"
  ON public.site_settings FOR SELECT
  USING (is_public = true OR public.is_staff());

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
