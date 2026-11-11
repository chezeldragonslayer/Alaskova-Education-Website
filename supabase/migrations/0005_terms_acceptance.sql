-- Legal pages implementation brief (11 November 2026), items D1 and D2:
-- record when someone accepted the Terms, and which version, at sign-up (profiles) and at checkout (subscriptions).
-- Only the server (service role) writes these columns; students cannot change them.
alter table public.profiles add column if not exists terms_accepted_at timestamptz;
alter table public.profiles add column if not exists terms_version text;
alter table public.subscriptions add column if not exists terms_accepted_at timestamptz;
alter table public.subscriptions add column if not exists terms_version text;
