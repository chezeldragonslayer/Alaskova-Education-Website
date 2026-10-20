-- Alaskova Education: support messages and account-deletion requests.
-- Run in the Supabase SQL editor AFTER 0002_referrals.sql.
-- Security model: server-only, like the referral tables. The website writes rows with the service role after
-- validating and rate-limiting them; the browser (anon/authenticated roles) has NO access.
-- The owner reads and answers them in Supabase > Table editor > support_requests (until email notifications exist).

create table public.support_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null check (kind in ('contact', 'account_deletion')),
  topic text check (topic is null or topic in ('account', 'billing', 'access', 'technical', 'privacy', 'other')),
  -- Set when the sender was signed in. Kept (as null) if the account is later deleted.
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
