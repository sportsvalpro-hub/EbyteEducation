-- Fix RLS policies for quiz_questions table to allow admins to insert/update/delete

-- Drop existing policies if they exist
drop policy if exists "Anyone can view quiz questions" on public.quiz_questions;
drop policy if exists "Admins can insert quiz questions" on public.quiz_questions;
drop policy if exists "Admins can update quiz questions" on public.quiz_questions;
drop policy if exists "Admins can delete quiz questions" on public.quiz_questions;

-- Recreate policies using the get_user_role function
create policy "Anyone can view quiz questions"
  on public.quiz_questions for select
  using (true);

create policy "Admins can insert quiz questions"
  on public.quiz_questions for insert
  with check (public.get_user_role() = 'admin');

create policy "Admins can update quiz questions"
  on public.quiz_questions for update
  using (public.get_user_role() = 'admin');

create policy "Admins can delete quiz questions"
  on public.quiz_questions for delete
  using (public.get_user_role() = 'admin');
