create table daily_tips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  tip_text text not null,
  created_at timestamptz default now(),
  unique (user_id, date)
);

alter table daily_tips enable row level security;

create policy "own rows only" on daily_tips
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
