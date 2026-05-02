# AI Daily Tip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Created:** 2026-05-02

**Status:** Completed

**Goal:** Replace the hardcoded tip rotation with AI-generated tips personalized to each user's cycle phase, recent daily logs, and health goals — cached once per day in the database, with silent fallback to static tips.

**Architecture:** A new Supabase Edge Function `generate-daily-tip` calls Claude Haiku, saves the result to a new `daily_tips` DB table, and is idempotent (returns cached row if one exists for the day). The frontend fetches the cached tip first; on cache miss it calls the Edge Function. Any error silently falls back to `tip-library.ts`. The tip card title changes from "Mẹo hôm nay" to "Lời khuyên của [chatbotName]" (fallback: "Lời khuyên của AI").

**Tech Stack:** Supabase Edge Functions (Deno), Claude Haiku API (direct fetch), TanStack React Query, TypeScript strict mode.

**Spec:** `docs/superpowers/specs/2026-05-02-ai-daily-tip-design.md`

---

## File Map

| File                                                           | Action                                       |
| -------------------------------------------------------------- | -------------------------------------------- |
| `supabase/migrations/20260502000000_create_daily_tips.sql`     | Create                                       |
| `supabase/functions/generate-daily-tip/index.ts`               | Create                                       |
| `libs/api/src/lib/daily-tip.ts`                                | Create                                       |
| `libs/api/src/index.ts`                                        | Modify — add export                          |
| `apps/health-tracker-web/src/app/dashboard/use-daily-tip.ts`   | Create                                       |
| `apps/health-tracker-web/src/app/dashboard/tip-of-day.tsx`     | Modify — new props, internal hook, new title |
| `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx` | Modify — pass new props, load chatbotName    |

`tip-library.ts` — no changes (kept as silent fallback).

---

## Task Checklist

- [x] [Task 01 — DB Migration](task-01-db-migration.md)
- [x] [Task 02 — API Helper](task-02-api-helper.md)
- [x] [Task 03 — Edge Function](task-03-edge-function.md)
- [x] [Task 04 — Frontend Hook](task-04-hook.md)
- [x] [Task 05 — UI Wiring](task-05-ui-wiring.md)
