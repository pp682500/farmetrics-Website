-- Run this in Supabase SQL Editor to create tables for Profile and Bhulekh-style farmland.

-- 1. Profiles: one row per user (id = auth.uid())
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  state text,
  district text,
  address text,
  pincode text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. User farmlands: Bhulekh-style land records linked to user
create table if not exists public.user_farmlands (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  state text not null,
  district text not null,
  tehsil text,
  village text not null,
  khasra_number text not null,
  khatauni_number text,
  area_acres numeric not null check (area_acres > 0),
  land_type text default 'Agricultural',
  created_at timestamptz default now()
);

-- RLS: users can only read/write their own profile and farmlands
alter table public.profiles enable row level security;
alter table public.user_farmlands enable row level security;

create policy "Users can manage own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can manage own farmlands"
  on public.user_farmlands for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional: create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3. Reports: Store calculation results
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  report_data jsonb not null,
  created_at timestamptz default now()
);

alter table public.reports enable row level security;

create policy "Users can manage own reports"
  on public.reports for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Resources: Dynamic schemes added by users/admins
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  link text,
  category text default 'Government Scheme',
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);

alter table public.resources enable row level security;

-- Everyone can view resources
create policy "Public view resources"
  on public.resources for select
  using (true);

-- Authenticated users can add resources
create policy "Authenticated insert resources"
  on public.resources for insert
  to authenticated
  with check (true);
-- 5. Feedback and Complaints
create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  user_email text,
  type text not null check (type in ('feedback', 'complaint')),
  subject text not null,
  message text not null,
  status text default 'pending' check (status in ('pending', 'resolved', 'ignored')),
  created_at timestamptz default now()
);

alter table public.feedback enable row level security;

-- Authenticated users can insert their own feedback
create policy "Authenticated users can insert feedback"
  on public.feedback for insert
  to authenticated
  with check (auth.uid() = user_id or user_id is null);

-- Anyone can insert feedback (allows for guest feedback too if email provided)
create policy "Anyone can insert feedback"
  on public.feedback for insert
  to anon, authenticated
  with check (true);

-- Users can view their own feedback history
create policy "Users can view own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);
