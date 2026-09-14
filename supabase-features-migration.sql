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
