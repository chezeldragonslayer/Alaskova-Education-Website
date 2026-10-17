-- Alaskova Education: referral rewards ("refer a friend, get 3 months free").
-- Run in the Supabase SQL editor AFTER 0001_init.sql.
-- Security model: these tables are server-only. The browser (anon/authenticated roles) has NO access;
-- the website reads and writes them with the service role, so nobody can edit their own rewards.

-- ----------------------------------------------------------- referral codes
-- One short, unguessable code per user. Alphabet leaves out look-alikes (I, L, O, 0, 1).
create table public.referral_codes (
  user_id uuid primary key references auth.users (id) on delete cascade,
  code text not null unique check (code ~ '^[A-HJKMNP-Z2-9]{8}$'),
  created_at timestamptz not null default now()
);
alter table public.referral_codes enable row level security;
revoke all on public.referral_codes from anon, authenticated;

-- ---------------------------------------------------------------- referrals
-- One row per referred friend. A person can only ever be referred once (referee_id is unique)
-- and can never refer themselves.
--   pending  = friend has used the link but has not made a first payment yet
--   rewarded = friend paid; the referrer was credited (Stripe customer balance)
--   capped   = friend paid but the referrer had already reached the reward limit
create table public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references auth.users (id) on delete cascade,
  referee_id uuid not null unique references auth.users (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'rewarded', 'capped')),
  stripe_balance_transaction_id text,
  created_at timestamptz not null default now(),
  rewarded_at timestamptz,
  check (referrer_id <> referee_id)
);
create index referrals_referrer_idx on public.referrals (referrer_id, status);
alter table public.referrals enable row level security;
revoke all on public.referrals from anon, authenticated;
