-- ============================================================
-- Nine Dragons Martial Arts — Automated weekly grading digest
-- Run this in Supabase > SQL Editor
-- ============================================================

-- Requires the pg_cron extension. If this errors with "permission denied"
-- or "extension not found", first enable it via Supabase Dashboard →
-- Database → Extensions → search "pg_cron" → Enable, then re-run this file.
create extension if not exists pg_cron;

create or replace function post_weekly_grading_digest()
returns void language plpgsql security definer as $$
declare
  summary text;
  cnt      int;
begin
  select count(*),
         string_agg(coalesce(p.full_name, p.email) || ' → ' || b.name || ' Belt', E'\n' order by gh.graded_at)
    into cnt, summary
  from grading_history gh
  join profiles p on p.id = gh.profile_id
  join belts    b on b.id = gh.to_belt_id
  where gh.graded_at >= now() - interval '7 days';

  if cnt > 0 then
    insert into news_posts (content, is_pinned, is_published)
    values ('This week''s grading results 🥋' || E'\n\n' || summary, false, true);
  end if;
end;
$$;

-- Re-runnable: drop any existing schedule with this name before creating it
do $$
begin
  perform cron.unschedule('weekly-grading-digest');
exception when others then
  null; -- no existing job with that name — fine
end;
$$;

-- Every Monday at 9am UTC
select cron.schedule(
  'weekly-grading-digest',
  '0 9 * * 1',
  $$select post_weekly_grading_digest()$$
);
