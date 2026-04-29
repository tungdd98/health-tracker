create table chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  is_archived boolean not null default false
);

create index chat_sessions_user_last_message_idx
  on chat_sessions (user_id, last_message_at desc);

create table chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references chat_sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'tool')),
  content jsonb not null,
  token_input integer,
  token_output integer,
  created_at timestamptz not null default now()
);

create index chat_messages_session_created_idx
  on chat_messages (session_id, created_at);

create table chat_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  hour_bucket timestamptz not null,
  message_count integer not null default 0,
  primary key (user_id, hour_bucket)
);

create index chat_usage_user_hour_idx
  on chat_usage (user_id, hour_bucket desc);

alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;
alter table chat_usage enable row level security;

create policy "owner only chat_sessions" on chat_sessions
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner only chat_messages" on chat_messages
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner only chat_usage" on chat_usage
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
