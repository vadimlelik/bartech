-- Supabase migration: allow new theme "universal4"
-- Run this in Supabase Dashboard -> SQL Editor

ALTER TABLE public.landing_pages
  DROP CONSTRAINT IF EXISTS landing_pages_theme_check;

ALTER TABLE public.landing_pages
  ADD CONSTRAINT landing_pages_theme_check
  CHECK (theme IN ('phone2', 'phone3', 'phone4', 'universal4'));


