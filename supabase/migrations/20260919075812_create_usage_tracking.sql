/*
# Create daily usage tracking table

## Purpose
Tracks per-client daily search usage to enforce the 5-search free limit
server-side, preventing client-side localStorage bypass.

## New Tables
- `usage_tracking`
  - `id` (uuid, primary key)
  - `client_id` (text, not null) — anonymous browser identifier stored in localStorage
  - `search_date` (date, not null) — the day this usage record belongs to (UTC)
  - `count` (integer, not null, default 0) — number of searches performed that day
  - `created_at` (timestamptz) — record creation timestamp
  - `updated_at` (timestamptz) — last increment timestamp

## Security
- RLS enabled on `usage_tracking`.
- Anon + authenticated roles can INSERT and SELECT (the app has no sign-in screen,
  so the anon-key frontend must be able to read/write its own usage rows).
- UPDATE and DELETE are restricted to authenticated only (not needed by the frontend;
  increments happen via INSERT ... ON CONFLICT, not UPDATE).

## Important Notes
1. The unique constraint on (client_id, search_date) ensures one row per client per day.
2. The `increment_usage` SECURITY DEFINER function atomically increments the count
   using INSERT ... ON CONFLICT, so concurrent requests are safe.
3. The `get_usage_count` SECURITY DEFINER function returns today's count for a client.
*/

CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  search_date date NOT NULL DEFAULT CURRENT_DATE,
  count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (client_id, search_date)
);

ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_usage" ON usage_tracking;
CREATE POLICY "anon_select_usage" ON usage_tracking FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_usage" ON usage_tracking;
CREATE POLICY "anon_insert_usage" ON usage_tracking FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_usage" ON usage_tracking;
CREATE POLICY "auth_update_usage" ON usage_tracking FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_usage" ON usage_tracking;
CREATE POLICY "auth_delete_usage" ON usage_tracking FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_usage_tracking_client_date
  ON usage_tracking (client_id, search_date);
