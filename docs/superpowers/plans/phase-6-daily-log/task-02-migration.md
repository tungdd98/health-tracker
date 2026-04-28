# Task 02 — Database migration

**Files:**

- Create: `supabase/migrations/20260427000000_create_daily_logs.sql`

---

- [ ] **Step 1:** Create migration file

```sql
create table daily_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  date         date not null,
  bbt_celsius  numeric(4,2),
  mood         text check (mood in ('sad','neutral','happy','very_happy','tired')),
  weight_kg    numeric(5,2),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique (user_id, date)
);

alter table daily_logs enable row level security;

create policy "own rows only" on daily_logs
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

- [ ] **Step 2:** Push to remote

```bash
npx supabase db push
```

Expected: output ends with `Finished supabase db push.`

- [ ] **Step 3:** Verify in Supabase dashboard SQL editor

```sql
select * from daily_logs limit 1;
```

Expected: empty result, no error.

- [ ] **Step 4:** Commit

```bash
git add supabase/migrations/
git commit -m "feat: add daily_logs migration with RLS"
```
