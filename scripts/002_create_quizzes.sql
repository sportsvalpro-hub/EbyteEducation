-- Create quizzes table
create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  created_by uuid not null references auth.users(id) on delete cascade,
  difficulty text check (difficulty in ('easy', 'medium', 'hard')) default 'medium',
  category text,
  duration_minutes integer default 30,
  passing_score integer default 60,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create quiz questions table
create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_text text not null,
  question_type text check (question_type in ('multiple_choice', 'fill_blank', 'matching', 'true_false')) default 'multiple_choice',
  options jsonb,
  correct_answer text not null,
  explanation text,
  order_num integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create quiz results table
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null,
  total_questions integer not null,
  ai_analysis text,
  strengths text,
  weaknesses text,
  recommendations text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable RLS on quizzes
alter table public.quizzes enable row level security;

-- Quizzes policies
create policy "Anyone can view published quizzes"
  on public.quizzes for select
  using (true);

create policy "Creators can update own quizzes"
  on public.quizzes for update
  using (auth.uid() = created_by);

create policy "Creators can delete own quizzes"
  on public.quizzes for delete
  using (auth.uid() = created_by);

create policy "Admins can create quizzes"
  on public.quizzes for insert
  with check ((select role from public.profiles where id = auth.uid()) = 'admin');

-- Enable RLS on quiz questions
alter table public.quiz_questions enable row level security;

create policy "Anyone can view quiz questions"
  on public.quiz_questions for select
  using (true);

-- Enable RLS on quiz results
alter table public.quiz_results enable row level security;

create policy "Users can view own results"
  on public.quiz_results for select
  using (auth.uid() = user_id);

create policy "Admins can view all results"
  on public.quiz_results for select
  using ((select role from public.profiles where id = auth.uid()) = 'admin');

create policy "Users can insert own results"
  on public.quiz_results for insert
  with check (auth.uid() = user_id);
