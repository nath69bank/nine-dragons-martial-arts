-- Public session clips shown on homepage as social proof
create table if not exists public_sessions (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  video_url    text not null,
  thumbnail_url text,
  category     text not null default 'Training',
  is_published boolean not null default false,
  display_order int not null default 0,
  created_at   timestamptz not null default now()
);

alter table public_sessions enable row level security;

-- Anyone can view published sessions (social proof — public homepage)
create policy "Public can view published sessions"
  on public_sessions for select
  using (is_published = true);

-- Only admins can insert / update / delete
create policy "Admins manage sessions"
  on public_sessions for all
  using (
    exists (
      select 1 from profiles
      where id = auth.uid() and is_admin = true
    )
  );
