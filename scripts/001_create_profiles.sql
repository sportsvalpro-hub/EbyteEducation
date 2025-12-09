-- Create profiles table for user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text,
  last_name text,
  role text not null check (role in ('admin', 'management', 'user')) default 'user',
  status text not null check (status in ('active', 'pending', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Admins can update all profiles"
  on public.profiles for update
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Admins can delete profiles"
  on public.profiles for delete
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Insert own profile on signup"
  on public.profiles for insert
  with check (auth.uid() = id);
