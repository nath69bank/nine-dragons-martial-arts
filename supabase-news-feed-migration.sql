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
