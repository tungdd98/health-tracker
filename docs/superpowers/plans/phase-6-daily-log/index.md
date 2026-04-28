# Phase 6 — Daily Log

**Goal:** Add a DailyLogStrip to the dashboard with 3 tap-to-log cards (BBT, Tâm trạng, Cân nặng) backed by Supabase. Each card opens a bottom sheet for input.

**Architecture:** New `daily_logs` Supabase table (one row per user per day, upsert on conflict). Data layer in `libs/api`. React Query hook co-located in the dashboard folder. Four UI components (strip + 3 bottom sheets) — visuals defined in the Pencil design file, not in plan prose.

**Tech Stack:** React 19, TypeScript strict, MUI v7, TanStack React Query v5, Supabase JS v2, Luxon.

**Design file:** `docs/superpowers/designs/2026-04-26-dashboard.pen`

---

## Task Checklist

- [ ] [Task 01 — Supabase CLI init](task-01-supabase-cli-init.md)
- [ ] [Task 02 — Database migration](task-02-migration.md)
- [ ] [Task 03 — Data layer (libs/api)](task-03-data-layer.md)
- [ ] [Task 04 — React Query hook](task-04-query-hook.md)
- [ ] [Task 05 — DailyLogStrip component](task-05-daily-log-strip.md)
- [ ] [Task 06 — BBT Bottom Sheet](task-06-bbt-bottom-sheet.md)
- [ ] [Task 07 — Mood Bottom Sheet](task-07-mood-bottom-sheet.md)
- [ ] [Task 08 — Weight Bottom Sheet](task-08-weight-bottom-sheet.md)
- [ ] [Task 09 — Wire into dashboard-page](task-09-wire-dashboard.md)
- [ ] [Task 10 — Smoke test](task-10-smoke-test.md)

---

## File Map

| File                                                                | Action                     |
| ------------------------------------------------------------------- | -------------------------- |
| `supabase/migrations/20260427000000_create_daily_logs.sql`          | Create                     |
| `libs/api/src/lib/daily-log.ts`                                     | Create                     |
| `libs/api/src/index.ts`                                             | Modify — add export        |
| `apps/health-tracker-web/src/app/dashboard/use-daily-log.ts`        | Create                     |
| `apps/health-tracker-web/src/app/dashboard/daily-log-strip.tsx`     | Create                     |
| `apps/health-tracker-web/src/app/dashboard/bbt-bottom-sheet.tsx`    | Create                     |
| `apps/health-tracker-web/src/app/dashboard/mood-bottom-sheet.tsx`   | Create                     |
| `apps/health-tracker-web/src/app/dashboard/weight-bottom-sheet.tsx` | Create                     |
| `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx`      | Modify — add DailyLogStrip |
