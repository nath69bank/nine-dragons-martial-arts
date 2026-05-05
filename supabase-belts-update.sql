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
