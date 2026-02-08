-- SQL to create updates table for Supabase

CREATE TABLE IF NOT EXISTS public.updates (
  id bigserial PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE,
  content text NOT NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure slug uniqueness with an index
CREATE UNIQUE INDEX IF NOT EXISTS updates_slug_idx ON public.updates (slug);

-- Optional: grant minimal privileges (Supabase usually manages auth policies separately)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.updates TO authenticated;
