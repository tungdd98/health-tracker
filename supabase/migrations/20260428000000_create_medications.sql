create table medications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  dosage text,
  notes text,
  schedule_type text not null check (schedule_type in ('daily', 'course')),
  course_start_date date,
  course_duration_days integer check (course_duration_days > 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint course_fields_consistency check (
    (schedule_type = 'daily' and course_start_date is null and course_duration_days is null)
    or (
      schedule_type = 'course' and course_start_date is not null and course_duration_days is not null
    )
  )
);

create index medications_user_active_idx on medications (user_id, active);

create table medication_doses (
  id uuid primary key default gen_random_uuid(),
  medication_id uuid not null references medications(id) on delete cascade,
  time_of_day time not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index medication_doses_medication_idx on medication_doses (medication_id);

create table dose_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  dose_id uuid not null references medication_doses(id) on delete cascade,
  date date not null,
  taken_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (dose_id, date)
);

create index dose_logs_user_date_idx on dose_logs (user_id, date);

alter table medications enable row level security;
alter table medication_doses enable row level security;
alter table dose_logs enable row level security;

create policy "own medications" on medications
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own dose_logs" on dose_logs
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "own medication_doses" on medication_doses
  using (
    exists (
      select 1 from medications m where m.id = medication_doses.medication_id and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from medications m where m.id = medication_doses.medication_id and m.user_id = auth.uid()
    )
  );

create or replace function create_medication_with_doses(payload jsonb)
returns medications
language plpgsql
security definer
as $$
declare
  new_med medications;
  dose jsonb;
  idx int := 0;
begin
  insert into medications (
    user_id,
    name,
    dosage,
    notes,
    schedule_type,
    course_start_date,
    course_duration_days,
    active
  )
  values (
    auth.uid(),
    payload->>'name',
    nullif(payload->>'dosage', ''),
    nullif(payload->>'notes', ''),
    payload->>'schedule_type',
    nullif(payload->>'course_start_date', '')::date,
    nullif(payload->>'course_duration_days', '')::int,
    coalesce((payload->>'active')::boolean, true)
  )
  returning * into new_med;

  for dose in select * from jsonb_array_elements(payload->'doses') loop
    insert into medication_doses (medication_id, time_of_day, sort_order)
    values (new_med.id, (dose->>'time_of_day')::time, idx);

    idx := idx + 1;
  end loop;

  return new_med;
end;
$$;

create or replace function update_medication_with_doses(target_id uuid, payload jsonb)
returns medications
language plpgsql
security definer
as $$
declare
  updated_med medications;
  dose jsonb;
  idx int := 0;
begin
  update medications
  set
    name = payload->>'name',
    dosage = nullif(payload->>'dosage', ''),
    notes = nullif(payload->>'notes', ''),
    schedule_type = payload->>'schedule_type',
    course_start_date = nullif(payload->>'course_start_date', '')::date,
    course_duration_days = nullif(payload->>'course_duration_days', '')::int,
    active = coalesce((payload->>'active')::boolean, true),
    updated_at = now()
  where id = target_id and user_id = auth.uid()
  returning * into updated_med;

  if updated_med.id is null then
    raise exception 'Medication not found or not authorized';
  end if;

  delete from medication_doses where medication_id = updated_med.id;

  for dose in select * from jsonb_array_elements(payload->'doses') loop
    insert into medication_doses (medication_id, time_of_day, sort_order)
    values (updated_med.id, (dose->>'time_of_day')::time, idx);

    idx := idx + 1;
  end loop;

  return updated_med;
end;
$$;
