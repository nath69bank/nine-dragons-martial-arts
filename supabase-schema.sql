-- ============================================================
-- Nine Dragons Martial Arts — Supabase Schema
-- Run this in Supabase > SQL Editor
-- ============================================================

-- Belt levels (ordered by progression)
create table belts (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  order_index  int  not null,
  color_hex    text default '#ffffff',
  description  text,
  requirements text,
  created_at   timestamptz default now()
);

-- Tags attached to a belt (e.g. "sparring ready", "kickboxing")
create table belt_tags (
  id      uuid primary key default gen_random_uuid(),
  belt_id uuid references belts(id) on delete cascade,
  tag     text not null
);

-- Member profiles (extends Supabase auth.users)
create table profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text,
  email      text,
  belt_id    uuid references belts(id),
  status     text default 'active' check (status in ('active', 'inactive', 'pending')),
  is_admin   boolean default false,
  joined_at  timestamptz default now(),
  notes      text
);

-- Lessons
create table lessons (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  content      text,
  video_url    text,
  belt_id      uuid references belts(id),
  is_published boolean default false,
  created_at   timestamptz default now()
);

-- Nutrition guides
create table nutrition_guides (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  content      text,
  category     text,
  is_published boolean default false,
  created_at   timestamptz default now()
);

-- Grading history (audit trail when a member's belt changes)
create table grading_history (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid references profiles(id) on delete cascade,
  from_belt_id uuid references belts(id),
  to_belt_id   uuid references belts(id),
  graded_at    timestamptz default now(),
  notes        text
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table profiles         enable row level security;
alter table belts             enable row level security;
alter table belt_tags         enable row level security;
alter table lessons           enable row level security;
alter table nutrition_guides  enable row level security;
alter table grading_history   enable row level security;

-- Helper: is the current user an admin?
create or replace function is_admin()
returns boolean language sql security definer as $$
  select coalesce(
    (select is_admin from profiles where id = auth.uid()),
    false
  );
$$;

-- PROFILES
create policy "Own profile readable"      on profiles for select using (auth.uid() = id);
create policy "Admin full access profiles" on profiles for all    using (is_admin());

-- BELTS (all active members can read)
create policy "Members read belts"   on belts for select using (auth.role() = 'authenticated');
create policy "Admin manage belts"   on belts for all    using (is_admin());

-- BELT TAGS
create policy "Members read belt_tags"  on belt_tags for select using (auth.role() = 'authenticated');
create policy "Admin manage belt_tags"  on belt_tags for all    using (is_admin());

-- LESSONS (published only for members, all for admin)
create policy "Members read published lessons" on lessons for select
  using (auth.role() = 'authenticated' and (is_published = true or is_admin()));
create policy "Admin manage lessons" on lessons for all using (is_admin());

-- NUTRITION GUIDES
create policy "Members read published nutrition" on nutrition_guides for select
  using (auth.role() = 'authenticated' and (is_published = true or is_admin()));
create policy "Admin manage nutrition" on nutrition_guides for all using (is_admin());

-- GRADING HISTORY
create policy "Members read own gradings"  on grading_history for select using (auth.uid() = profile_id);
create policy "Admin manage gradings"      on grading_history for all    using (is_admin());

-- ============================================================
-- Auto-create profile on sign-up
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- Seed belt progression (edit to match the real system)
-- ============================================================
insert into belts (name, order_index, color_hex) values
  ('White',        1, '#ffffff'),
  ('Yellow',       2, '#ffd700'),
  ('Orange',       3, '#ff8c00'),
  ('Green',        4, '#228b22'),
  ('Blue',         5, '#1a4fc8'),
  ('Purple',       6, '#800080'),
  ('Red',          7, '#cc0000'),
  ('Brown',        8, '#8b4513'),
  ('Black (1st)',  9, '#111111'),
  ('Black (2nd)', 10, '#111111'),
  ('Black (3rd)', 11, '#111111');
