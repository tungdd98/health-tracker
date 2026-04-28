create table daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  bbt_celsius numeric(4, 2),
  mood text check (mood in ('sad', 'neutral', 'happy', 'very_happy', 'tired')),
  weight_kg numeric(5, 2),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, date)
);

alter table daily_logs enable row level security;

create policy "own rows only" on daily_logs
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
