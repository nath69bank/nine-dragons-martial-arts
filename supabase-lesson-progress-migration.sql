-- ============================================================
-- Nine Dragons Martial Arts — Interactive lessons
-- Run this in Supabase > SQL Editor
-- ============================================================

-- Optional multiple-choice quiz per lesson, authored by admins.
-- Shape: [{ "question": "...", "options": ["...", "...", "...", "..."], "correct": 0 }]
alter table lessons add column if not exists quiz jsonb;

-- Tracks which members have completed which lessons, and their quiz score if any.
create table if not exists lesson_progress (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references profiles(id) on delete cascade,
  lesson_id    uuid not null references lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  quiz_score   int,
  quiz_total   int,
  unique (profile_id, lesson_id)
);

create index if not exists lesson_progress_profile_id_idx on lesson_progress(profile_id);

alter table lesson_progress enable row level security;

create policy "Members manage own lesson progress" on lesson_progress for all
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "Admin read all lesson progress" on lesson_progress for select using (is_admin());
