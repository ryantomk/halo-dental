-- ============================================================================
-- Migration: 20261004000001_availability_blocks.sql
-- Description: Creates the availability_blocks table for clinic and doctor time blocking
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.availability_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID REFERENCES public.clinics(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE CASCADE,
  block_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES public.staff_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_time_range CHECK (end_time > start_time)
);

-- Indexes for lightning-fast slot availability lookups
CREATE INDEX IF NOT EXISTS idx_availability_blocks_date ON public.availability_blocks(block_date);
CREATE INDEX IF NOT EXISTS idx_availability_blocks_doctor_date ON public.availability_blocks(doctor_id, block_date);

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_availability_blocks_updated_at
  BEFORE UPDATE ON public.availability_blocks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security
ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;

-- Policies:
-- 1. Public can read blocks so the booking calendar correctly computes unavailable slots
CREATE POLICY "Public read availability blocks"
  ON public.availability_blocks
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- 2. Authenticated staff can insert/update/delete availability blocks
CREATE POLICY "Staff manage availability blocks"
  ON public.availability_blocks
  FOR ALL
  TO authenticated
  USING (public.is_staff())
  WITH CHECK (public.is_staff());
