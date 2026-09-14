-- ============================================================
-- Nine Dragons Martial Arts — Full database setup (run once)
-- Combines: schema, belts-update, sessions, news-feed, features, blog
-- Paste this whole file into Supabase > SQL Editor > New query > Run
-- ============================================================

-- ======================= supabase-schema.sql =======================
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

-- ======================= supabase-belts-update.sql =======================
-- Fix belt progression to match Nine Dragons' actual system
-- Run in Supabase > SQL Editor

-- Clear existing belt seed data (safe if no members assigned yet)
delete from belt_tags;
delete from belts;

-- Insert correct Nine Dragons belt order
insert into belts (name, order_index, color_hex) values
  ('White',        1,  '#ffffff'),
  ('Purple',       2,  '#800080'),
  ('Purple Black', 3,  '#800080'),
  ('Green',        4,  '#228b22'),
  ('Green Black',  5,  '#228b22'),
  ('Blue',         6,  '#1a4fc8'),
  ('Blue Black',   7,  '#1a4fc8'),
  ('Brown',        8,  '#8b4513'),
  ('Brown Black',  9,  '#8b4513'),
  ('Red',          10, '#cc0000'),
  ('Red Black',    11, '#cc0000'),
  ('Black (1st Dan)', 12, '#111111'),
  ('Black (2nd Dan)', 13, '#111111'),
  ('Black (3rd Dan)', 14, '#111111');

-- ======================= supabase-sessions-migration.sql =======================
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

-- ======================= supabase-news-feed-migration.sql =======================
-- ============================================================
-- Nine Dragons Martial Arts — News Feed (Facebook-style)
-- Run this in Supabase > SQL Editor
-- ============================================================

-- Posts (announcements, grading results, event photos, etc.)
create table if not exists news_posts (
  id           uuid primary key default gen_random_uuid(),
  author_id    uuid references profiles(id) on delete set null,
  content      text not null,
  image_url    text,
  is_pinned    boolean not null default false,
  is_published boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Comments on a post
create table if not exists news_comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references news_posts(id) on delete cascade,
  author_id  uuid not null references profiles(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);

-- Likes on a post (one per member per post)
create table if not exists news_likes (
  post_id    uuid not null references news_posts(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, profile_id)
);

create index if not exists news_comments_post_id_idx on news_comments(post_id);
create index if not exists news_likes_post_id_idx     on news_likes(post_id);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table news_posts    enable row level security;
alter table news_comments enable row level security;
alter table news_likes    enable row level security;

-- Reuses is_admin() from supabase-schema.sql

-- NEWS POSTS
create policy "Members read published posts" on news_posts for select
  using (auth.role() = 'authenticated' and (is_published = true or is_admin()));
create policy "Admin manage posts" on news_posts for all using (is_admin());

-- NEWS COMMENTS (any authenticated member can comment; author or admin can delete)
create policy "Members read comments" on news_comments for select
  using (auth.role() = 'authenticated');
create policy "Members add own comments" on news_comments for insert
  with check (auth.uid() = author_id);
create policy "Author or admin delete comments" on news_comments for delete
  using (auth.uid() = author_id or is_admin());

-- NEWS LIKES (any authenticated member can like/unlike; only their own)
create policy "Members read likes" on news_likes for select
  using (auth.role() = 'authenticated');
create policy "Members like posts" on news_likes for insert
  with check (auth.uid() = profile_id);
create policy "Members unlike own likes" on news_likes for delete
  using (auth.uid() = profile_id);

-- Keep updated_at current on edits
create or replace function news_posts_set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger news_posts_updated_at
  before update on news_posts
  for each row execute procedure news_posts_set_updated_at();

-- ======================= supabase-features-migration.sql =======================
-- ============================================================
-- Nine Dragons Martial Arts — Attendance, Notifications, Storage
-- Run this in Supabase > SQL Editor (after supabase-news-feed-migration.sql)
-- ============================================================

-- ============================================================
-- Attendance
-- ============================================================
create table if not exists attendance (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  class_date  date not null,
  class_label text not null default 'Class',
  marked_by   uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now(),
  unique (profile_id, class_date, class_label)
);

create index if not exists attendance_profile_id_idx on attendance(profile_id);
create index if not exists attendance_class_date_idx  on attendance(class_date);

alter table attendance enable row level security;

create policy "Members read own attendance" on attendance for select
  using (auth.uid() = profile_id or is_admin());
create policy "Admin manage attendance" on attendance for all using (is_admin());

-- ============================================================
-- Grading reminders — how long a member typically stays on a belt
-- ============================================================
alter table belts add column if not exists typical_days_to_next int not null default 90;

-- ============================================================
-- Notifications (in-app)
-- ============================================================
create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  type       text not null check (type in ('news_post', 'comment', 'grading', 'attendance', 'general')),
  title      text not null,
  body       text,
  link       text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_profile_id_idx on notifications(profile_id, created_at desc);

alter table notifications enable row level security;

create policy "Members read own notifications" on notifications for select
  using (auth.uid() = profile_id or is_admin());
create policy "Members mark own notifications read" on notifications for update
  using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "Members delete own notifications" on notifications for delete
  using (auth.uid() = profile_id or is_admin());
-- No insert policy for regular users — rows are created by the security-definer
-- trigger functions below (or manually by an admin via the dashboard).
create policy "Admin insert notifications" on notifications for insert with check (is_admin());

-- Notify all active members when a post is published (except the author)
create or replace function notify_new_post()
returns trigger language plpgsql security definer as $$
begin
  if new.is_published then
    insert into notifications (profile_id, type, title, body, link)
    select p.id, 'news_post', 'New post from the dojo', left(new.content, 120), '/member/feed'
    from profiles p
    where p.status = 'active'
      and p.id <> coalesce(new.author_id, '00000000-0000-0000-0000-000000000000'::uuid);
  end if;
  return new;
end;
$$;

drop trigger if exists on_news_post_published on news_posts;
create trigger on_news_post_published
  after insert on news_posts
  for each row execute procedure notify_new_post();

-- Notify a post's author when someone comments on it
create or replace function notify_new_comment()
returns trigger language plpgsql security definer as $$
declare
  post_author uuid;
begin
  select author_id into post_author from news_posts where id = new.post_id;
  if post_author is not null and post_author <> new.author_id then
    insert into notifications (profile_id, type, title, body, link)
    values (post_author, 'comment', 'New comment on your post', left(new.content, 120), '/member/feed');
  end if;
  return new;
end;
$$;

drop trigger if exists on_news_comment_created on news_comments;
create trigger on_news_comment_created
  after insert on news_comments
  for each row execute procedure notify_new_comment();

-- Notify a member when their belt is updated (graded)
create or replace function notify_belt_change()
returns trigger language plpgsql security definer as $$
begin
  if new.belt_id is distinct from old.belt_id and new.belt_id is not null then
    insert into notifications (profile_id, type, title, body, link)
    values (new.id, 'grading', 'Belt grading updated', 'Your belt level has been updated — congratulations!', '/member/gradings');
  end if;
  return new;
end;
$$;

drop trigger if exists on_profile_belt_change on profiles;
create trigger on_profile_belt_change
  after update on profiles
  for each row execute procedure notify_belt_change();

-- Let the notification bell subscribe to live inserts
alter publication supabase_realtime add table notifications;

-- ============================================================
-- Storage bucket for uploaded images (news feed photos, thumbnails, etc.)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('dojo-media', 'dojo-media', true)
on conflict (id) do nothing;

create policy "Public read dojo-media" on storage.objects for select
  using (bucket_id = 'dojo-media');
create policy "Admins upload dojo-media" on storage.objects for insert
  with check (bucket_id = 'dojo-media' and is_admin());
create policy "Admins update dojo-media" on storage.objects for update
  using (bucket_id = 'dojo-media' and is_admin());
create policy "Admins delete dojo-media" on storage.objects for delete
  using (bucket_id = 'dojo-media' and is_admin());

-- ======================= supabase-blog-migration.sql =======================
-- ============================================================
-- Nine Dragons Martial Arts — Blog / Articles (public, SEO)
-- Run this in Supabase > SQL Editor
-- ============================================================

create table if not exists blog_posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  excerpt      text,
  content      text not null,
  cover_image  text,
  author_id    uuid references profiles(id) on delete set null,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists blog_posts_slug_idx        on blog_posts(slug);
create index if not exists blog_posts_published_idx   on blog_posts(is_published, published_at desc);

alter table blog_posts enable row level security;

-- Anyone (including anonymous website visitors) can read published posts
create policy "Public read published blog posts" on blog_posts for select
  using (is_published = true or is_admin());
create policy "Admin manage blog posts" on blog_posts for all using (is_admin());

-- Reuses news_posts_set_updated_at() from supabase-news-feed-migration.sql
create trigger blog_posts_updated_at
  before update on blog_posts
  for each row execute procedure news_posts_set_updated_at();

