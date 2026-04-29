create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  assistant_preferences jsonb,
  assistant_goals jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles
  add column if not exists assistant_preferences jsonb,
  add column if not exists assistant_goals jsonb,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table profiles
  drop constraint if exists profiles_assistant_goals_array_check;

alter table profiles
  add constraint profiles_assistant_goals_array_check
  check (
    assistant_goals is null
    or (
      jsonb_typeof(assistant_goals) = 'array'
      and jsonb_array_length(assistant_goals) <= 3
    )
  );

alter table profiles enable row level security;

drop policy if exists "owner only profiles" on profiles;

create policy "owner only profiles" on profiles
  using (auth.uid() = id)
  with check (auth.uid() = id);
