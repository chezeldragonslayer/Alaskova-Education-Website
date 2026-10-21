-- Alaskova Education: referral rewards paid in instalments.
-- Run in the Supabase SQL editor AFTER 0003_support_requests.sql.
-- Instead of 3 months of credit on the friend's first payment, the referrer now gets 1 month of credit for each of the
-- friend's first 3 paid monthly payments. A throwaway account can then never earn more than it pays in.
--   pending  = friend has used the link but has not paid yet
--   active   = friend has paid 1 or 2 months; the referrer has been credited that many months
--   rewarded = friend has paid 3 months; all 3 months credited
--   capped   = friend paid, but the referrer had already reached the limit of friends earning rewards

alter table public.referrals
  add column months_rewarded int not null default 0 check (months_rewarded between 0 and 3);

alter table public.referrals drop constraint referrals_status_check;
alter table public.referrals
  add constraint referrals_status_check check (status in ('pending', 'active', 'rewarded', 'capped'));

-- Referrals rewarded under the old rule already received all 3 months at once.
update public.referrals set months_rewarded = 3 where status = 'rewarded';

-- One row per instalment paid: which friend's invoice paid it, and the Stripe credit it created.
create table public.referral_rewards (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references public.referrals (id) on delete cascade,
  instalment int not null check (instalment between 1 and 3),
  stripe_invoice_id text not null unique,          -- one invoice can pay at most one instalment
  stripe_balance_transaction_id text not null,
  created_at timestamptz not null default now(),
  unique (referral_id, instalment)                 -- each instalment is paid once
);
alter table public.referral_rewards enable row level security;
revoke all on public.referral_rewards from anon, authenticated;
