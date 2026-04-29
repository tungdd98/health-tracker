alter table profiles
  add column if not exists assistant_preferences jsonb,
  add column if not exists assistant_goals jsonb;

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
