-- ============================================================
-- Nine Dragons Martial Arts — Demo content
-- Run this AFTER supabase-run-all-migrations.sql to make the
-- member dashboard look fully operational. Safe to run more than
-- once — each insert is guarded against duplicates.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- Lessons
-- ─────────────────────────────────────────────────────────────
insert into lessons (title, description, content, belt_id, is_published)
select
  'Stances & Basic Guard',
  'The foundation every new student builds on — horse stance, front stance, and a solid guard.',
  'In this lesson we cover the three stances every White Belt needs before their first grading: horse stance (ma bo), front stance, and fighting guard. Focus on keeping your weight low and your hands up at all times — Master Martin will check these at your next lesson.',
  (select id from belts where name = 'White' limit 1),
  true
where not exists (select 1 from lessons where title = 'Stances & Basic Guard');

insert into lessons (title, description, content, belt_id, is_published)
select
  'Combination Striking Drills',
  'Three-strike and five-strike combinations for pad work and partner drills.',
  'Building on your basic strikes, this lesson introduces combination work: jab-cross-hook, and the five-strike combo used in Kaizendo Kickboxing pad rounds. Practice slow and controlled before adding speed.',
  (select id from belts where name = 'Purple' limit 1),
  true
where not exists (select 1 from lessons where title = 'Combination Striking Drills');

insert into lessons (title, description, content, belt_id, is_published)
select
  'Sparring Fundamentals & Ring Control',
  'Distance, timing, and controlling the space before your first sparring session.',
  'Sparring is about control, not just contact. This lesson covers footwork for managing distance, reading your partner''s guard, and the ring-control drills we run every Thursday before live sparring rounds.',
  (select id from belts where name = 'Green' limit 1),
  true
where not exists (select 1 from lessons where title = 'Sparring Fundamentals & Ring Control');

insert into lessons (title, description, content, belt_id, is_published)
select
  'Kaizendo Kickboxing — Advanced Footwork',
  'Master Martin''s signature footwork patterns for Black Belt and Kaizendo students.',
  'Advanced footwork separates a good kickboxer from a great one. This session breaks down the pivot-step and angle-cutting patterns Master Martin uses in Kaizendo Kickboxing — the same footwork taught to him by Grand Master Frank Murphy.',
  (select id from belts where name = 'Black (1st Dan)' limit 1),
  true
where not exists (select 1 from lessons where title = 'Kaizendo Kickboxing — Advanced Footwork');

-- ─────────────────────────────────────────────────────────────
-- Nutrition guides
-- ─────────────────────────────────────────────────────────────
insert into nutrition_guides (title, content, category, is_published)
select
  'Fuelling Before Training',
  'Eat a light carb-based meal 2-3 hours before class — porridge, banana on toast, or rice with chicken all work well. Avoid heavy or fatty meals right before training; they''ll slow you down and can make sparring rounds uncomfortable. If you''re training straight after school or work, a banana or a handful of dried fruit 30 minutes before class is a good top-up.',
  'Pre-Training',
  true
where not exists (select 1 from nutrition_guides where title = 'Fuelling Before Training');

insert into nutrition_guides (title, content, category, is_published)
select
  'Hydration for Kids'' Classes',
  'Bring a water bottle to every session — Dragon Cubs and Dragon Sparks should have a few sips every 15-20 minutes, especially in the summer months. Water is best; save the sports drinks for after grading days when they''ve trained for over an hour.',
  'Kids',
  true
where not exists (select 1 from nutrition_guides where title = 'Hydration for Kids'' Classes');

insert into nutrition_guides (title, content, category, is_published)
select
  'Recovery Meals After Grading',
  'Grading days are intense — your body needs protein and carbs within an hour of finishing to recover well. Good options: chicken and rice, scrambled eggs on toast, or a protein shake with a banana if you''re short on time. Don''t skip this meal even if you''re tired — it makes the next few days of stiffness much more manageable.',
  'Recovery',
  true
where not exists (select 1 from nutrition_guides where title = 'Recovery Meals After Grading');

-- ─────────────────────────────────────────────────────────────
-- News feed posts
-- ─────────────────────────────────────────────────────────────
insert into news_posts (content, is_pinned, is_published)
select
  'Welcome to the new Nine Dragons members hub! 🥋 You can now check your belt progress, see your attendance streak, read lessons and nutrition guides, and keep up with everything happening at the dojo right here. Like and comment on posts just like you would on Facebook — let''s hear from you!',
  true,
  true
where not exists (select 1 from news_posts where content like 'Welcome to the new Nine Dragons members %');

insert into news_posts (content, is_pinned, is_published)
select
  'Huge congratulations to everyone who graded this month — from White through to Blue Black! Master Martin was really pleased with the standard across the board. Keep up the hard work, your next grading window will be announced here first.',
  false,
  true
where not exists (select 1 from news_posts where content like 'Huge congratulations to everyone who gra%');

insert into news_posts (content, is_pinned, is_published)
select
  'Reminder: Kaizendo Kickboxing seminar with Master Martin this Saturday, 10am at St Annes Church Hall. Open to all belts — bring gloves and a water bottle. Message us on WhatsApp if you''re coming so we can plan numbers.',
  false,
  true
where not exists (select 1 from news_posts where content like 'Reminder: Kaizendo Kickboxing seminar wi%');

-- ─────────────────────────────────────────────────────────────
-- Blog article (public, SEO)
-- ─────────────────────────────────────────────────────────────
insert into blog_posts (slug, title, excerpt, content, is_published, published_at)
select
  'martial-arts-builds-confidence-in-kids',
  '5 Ways Martial Arts Builds Confidence in Kids',
  'From Dragon Cubs to Dragon Warriors, here''s how structured martial arts training helps children build real, lasting confidence — on and off the mat.',
  'Every parent wants their child to feel confident — but confidence built on real skill lasts a lot longer than confidence built on praise alone. Here''s what we see, week after week, at Nine Dragons.

1. Small, visible wins. Belt progression breaks a huge goal into small, achievable steps. A child who couldn''t hold a stance in September can nail it by Christmas — and they know exactly how they got there.

2. Learning to fail safely. Sparring and grading both involve the possibility of not getting it right first time, in a supportive environment where that''s completely normal. That builds resilience faster than almost anything else.

3. A sense of belonging. Dragon Cubs, Dragon Sparks, Dragon Ninjas, Dragon Warriors — every age group trains together as a team, cheering each other on during gradings and sparring rounds.

4. Respect goes both ways. Traditional martial arts etiquette (bowing in, addressing instructors properly, looking after your training partner) teaches children that respect is something you give as well as receive.

5. Physical competence breeds mental confidence. Simply put: a child who knows they can throw a proper front kick, hold their stance, and handle themselves walks a little taller — at school, and everywhere else.

If your child hasn''t tried a class yet, your first session is free — come along on a Monday or Thursday at St Annes Church Hall and see for yourself.',
  true,
  now()
where not exists (select 1 from blog_posts where slug = 'martial-arts-builds-confidence-in-kids');
