# Task 01 — Supabase CLI init

**Files:**

- Create: `supabase/config.toml` (generated)
- Create: `supabase/migrations/` (generated)

---

- [ ] **Step 1:** Install CLI as dev dependency

```bash
yarn add -D supabase
```

- [ ] **Step 2:** Initialize

```bash
npx supabase init
```

Expected: `supabase/config.toml` and `supabase/migrations/` created at repo root.

- [ ] **Step 3:** Login and link to remote project

```bash
npx supabase login
npx supabase link --project-ref <YOUR_PROJECT_REF>
```

`YOUR_PROJECT_REF` is the ID in the Supabase dashboard URL. When prompted for DB password, use `SUPABASE_DB_PASSWORD` from `.env.local`.

- [ ] **Step 4:** Commit

```bash
git add supabase/ package.json yarn.lock
git commit -m "chore: init supabase CLI"
```
