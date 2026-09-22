-- Apply once with a migration-owner role, never with the website runtime login.
CREATE TABLE IF NOT EXISTS public.leads (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  business_name TEXT NOT NULL,
  email TEXT NOT NULL,
  team_size TEXT NOT NULL CHECK (team_size IN ('solo', 'team', 'business', 'enterprise')),
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notified_at TIMESTAMPTZ,
  phone TEXT,
  business_type TEXT,
  fleet_or_jobs TEXT,
  current_software TEXT,
  biggest_pain TEXT,
  heard_about TEXT,
  preferred_contact TEXT,
  enriched_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS leads_email_created_at_idx
  ON public.leads (email, created_at DESC);

-- Runtime can work with marketing leads, not create/drop tables or databases.
GRANT CONNECT ON DATABASE harboriq_marketing TO harboriq_web;
GRANT USAGE ON SCHEMA public TO harboriq_web;
GRANT SELECT, INSERT ON public.leads TO harboriq_web;
GRANT UPDATE (phone, business_type, fleet_or_jobs, current_software,
  biggest_pain, heard_about, preferred_contact, enriched_at)
  ON public.leads TO harboriq_web;
GRANT USAGE, SELECT ON SEQUENCE public.leads_id_seq TO harboriq_web;
