-- ============================================================
-- Nine Dragons Martial Arts — QR/tap self check-in
-- Run this in Supabase > SQL Editor
-- ============================================================

-- Members can mark their own attendance for TODAY only (via QR/tap
-- check-in) — they cannot back-date or future-date their own record.
-- Admins retain full manage access via the existing "Admin manage
-- attendance" policy from supabase-features-migration.sql.
create policy "Members self check-in today" on attendance for insert
  with check (auth.uid() = profile_id and class_date = current_date);
