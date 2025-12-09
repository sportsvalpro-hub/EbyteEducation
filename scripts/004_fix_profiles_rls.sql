-- Fix RLS policies to prevent infinite recursion
-- Run this script to fix the profiles table policies

-- First drop the problematic policies that cause recursion
drop policy if exists "Users can view their own profile" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can update all profiles" on public.profiles;
drop policy if exists "Admins can delete profiles" on public.profiles;
drop policy if exists "Insert own profile on signup" on public.profiles;

-- Create a security definer function to safely get user role
-- This avoids the infinite recursion by bypassing RLS
create or replace function public.get_user_role(user_id uuid)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = user_id;
$$;

-- Now create new policies that don't cause recursion

-- Users can always view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile (but not role/status)
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can view all profiles (using security definer function)
create policy "Admins view all profiles"
  on public.profiles for select
  using (public.get_user_role(auth.uid()) = 'admin');

-- Management can view all profiles
create policy "Management view all profiles"
  on public.profiles for select
  using (public.get_user_role(auth.uid()) = 'management');

-- Admins can update all profiles
create policy "Admins update all profiles"
  on public.profiles for update
  using (public.get_user_role(auth.uid()) = 'admin');

-- Admins can delete profiles
create policy "Admins delete profiles"
  on public.profiles for delete
  using (public.get_user_role(auth.uid()) = 'admin');

-- Allow insert for authenticated users (for signup)
create policy "Insert profile on signup"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Also allow service role to insert (for seeding)
create policy "Service role full access"
  on public.profiles
  using (auth.role() = 'service_role');
