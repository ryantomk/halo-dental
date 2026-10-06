-- ============================================================================
-- HALO DENTAL - Phase 1 Migration 03: Supabase Storage Buckets & Policies
-- Description: Sets up clinic-public and patient-records buckets with RLS.
-- ============================================================================

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  (
    'clinic-public',
    'clinic-public',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
  ),
  (
    'patient-records',
    'patient-records',
    false, -- Private bucket
    26214400, -- 25MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  )
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for 'clinic-public'
-- Anyone can view public images
CREATE POLICY "Public can view clinic-public assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'clinic-public');

-- Staff can upload to clinic-public
CREATE POLICY "Staff can upload to clinic-public"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'clinic-public'
    AND public.is_staff()
  );

-- Staff can update assets in clinic-public
CREATE POLICY "Staff can update clinic-public assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'clinic-public'
    AND public.is_staff()
  );

-- Staff can delete assets in clinic-public
CREATE POLICY "Staff can delete clinic-public assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'clinic-public'
    AND public.is_staff()
  );

-- 3. Storage Policies for 'patient-records' (Private, Staff Only)
-- Only authenticated staff can view patient files
CREATE POLICY "Staff can view patient records"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'patient-records'
    AND public.is_staff()
  );

-- Only authenticated staff can upload patient files
CREATE POLICY "Staff can upload patient records"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'patient-records'
    AND public.is_staff()
  );

-- Only authenticated staff can delete patient files
CREATE POLICY "Staff can delete patient records"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'patient-records'
    AND public.is_staff()
  );
