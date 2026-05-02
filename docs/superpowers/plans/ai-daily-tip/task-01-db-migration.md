# Task 01 — DB Migration

**Goal:** Add the `daily_tips` table with RLS so each user can read/write only their own rows.

**Files:**

- Create: `supabase/migrations/20260502000000_create_daily_tips.sql`

---

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/20260502000000_create_daily_tips.sql` with this content:

```sql
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
```

- [ ] **Step 2: Apply the migration**

```bash
npx supabase db push
```

Expected output: `Applying migration 20260502000000_create_daily_tips.sql... done`

If working locally with `supabase start`, use:

```bash
npx supabase db reset
```

- [ ] **Step 3: Verify the table exists**

```bash
npx supabase db lint
```

Expected: no errors about unknown tables.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260502000000_create_daily_tips.sql
git commit -m "feat(db): add daily_tips table with RLS"
```
