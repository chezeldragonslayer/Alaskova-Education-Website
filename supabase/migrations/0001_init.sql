-- Apex Education: initial schema. Run in the Supabase SQL editor or via `supabase db push`.
-- Security model: the browser (anon/authenticated roles) can only READ its own rows.
-- All writes to billing/entitlement tables happen server-side with the service role
-- (Stripe webhook), which bypasses RLS and is never exposed to the client.

create type public.app_role as enum ('student', 'admin');

-- ---------------------------------------------------------------- profiles
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

-- Users may only change their display name. `role` can never be self-assigned.
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

-- ------------------------------------------------------------ stripe links
create table public.stripe_customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);
alter table public.stripe_customers enable row level security;
-- No policies: only the service role can read/write.
revoke all on public.stripe_customers from anon, authenticated;

-- ----------------------------------------------------------- subscriptions
-- One row per Stripe subscription. One subscription unlocks one book (book_slug).
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

-- ------------------------------------------------------------ stripe events
-- Webhook idempotency ledger: an event id is processed at most once.
create table public.stripe_events (
  id text primary key,                       -- Stripe event id (evt_...)
  type text not null,
  received_at timestamptz not null default now(),
  processed_at timestamptz
);
alter table public.stripe_events enable row level security;
revoke all on public.stripe_events from anon, authenticated;

-- Make the first admin manually (after signing up), e.g.:
--   update public.profiles set role = 'admin' where email = 'you@example.com';
