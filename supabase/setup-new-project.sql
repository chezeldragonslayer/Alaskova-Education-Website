-- Alaskova Education: complete set-up for a NEW, empty Supabase project (November 2026).
-- Same as migrations 0001 + 0003 + 0005. The referral migrations (0002, 0004) are not needed: that feature was removed.
-- Run once, in Supabase > SQL editor. It fails harmlessly with "already exists" if the project is already set up.

create type public.app_role as enum ('student', 'admin');
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  role public.app_role not null default 'student',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles: read own"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));
create policy "profiles: update own"
  on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name) on public.profiles to authenticated;
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  );
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
create table public.stripe_customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);
alter table public.stripe_customers enable row level security;
revoke all on public.stripe_customers from anon, authenticated;
create table public.subscriptions (
  id text primary key,                       -- Stripe subscription id (sub_...)
  user_id uuid not null references auth.users (id) on delete cascade,
  book_slug text not null,
  stripe_customer_id text,
  status text not null,                      -- Stripe status: active, trialing, past_due, canceled, ...
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index subscriptions_user_idx on public.subscriptions (user_id);
create index subscriptions_user_book_idx on public.subscriptions (user_id, book_slug);
alter table public.subscriptions enable row level security;
create policy "subscriptions: read own"
  on public.subscriptions for select to authenticated
  using (user_id = (select auth.uid()));
revoke insert, update, delete on public.subscriptions from anon, authenticated;
create table public.stripe_events (
  id text primary key,                       -- Stripe event id (evt_...)
  type text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);
alter table public.stripe_events enable row level security;
revoke all on public.stripe_events from anon, authenticated;

create table public.support_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('contact', 'account_deletion')),
  topic text check (topic is null or topic in ('account', 'billing', 'access', 'technical', 'privacy', 'other')),
  user_id uuid references auth.users (id) on delete set null,
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 1 and 5000),
  status text not null default 'open' check (status in ('open', 'done')),
  handled_at timestamptz
);
create index support_requests_open_idx on public.support_requests (status, created_at);
create index support_requests_user_idx on public.support_requests (user_id, kind);
alter table public.support_requests enable row level security;
revoke all on public.support_requests from anon, authenticated;

-- Migration 0005: when the Terms were accepted, and which version (sign-up and checkout).
alter table public.profiles add column if not exists terms_accepted_at timestamptz;
alter table public.profiles add column if not exists terms_version text;
alter table public.subscriptions add column if not exists terms_accepted_at timestamptz;
alter table public.subscriptions add column if not exists terms_version text;
