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
