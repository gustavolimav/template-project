-- Device tokens for push notifications
-- Stores Expo push tokens per user/device for targeted notification delivery

create table public.device_tokens (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  token       text        not null,
  platform    text        not null check (platform in ('ios', 'android')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, token)
);

create index device_tokens_user_id_idx on public.device_tokens (user_id);

alter table public.device_tokens enable row level security;

-- Users can only manage their own device tokens
create policy "Users can manage own device tokens"
  on public.device_tokens
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Reuse the update_updated_at_column trigger from init migration
create trigger device_tokens_updated_at
  before update on public.device_tokens
  for each row execute function public.update_updated_at_column();
