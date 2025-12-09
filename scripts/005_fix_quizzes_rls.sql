-- Fix the RLS policy for quiz creation that has infinite recursion
-- Drop the problematic policy
drop policy if exists "Admins can create quizzes" on public.quizzes;

-- Create a function to safely get the user role without triggering RLS recursion
create or replace function public.get_user_role_for_quizzes(user_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = user_id;
$$;

-- Recreate the policy using the safe function
create policy "Admins can create quizzes"
  on public.quizzes for insert
  with check (public.get_user_role_for_quizzes(auth.uid()) = 'admin');

-- Also fix the quiz results policy that has the same issue
drop policy if exists "Admins can view all results" on public.quiz_results;

create policy "Admins can view all results"
  on public.quiz_results for select
  using (public.get_user_role_for_quizzes(auth.uid()) = 'admin');
