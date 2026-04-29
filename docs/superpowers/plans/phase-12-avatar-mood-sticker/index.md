# Phase 12 — Avatar & Mood Sticker

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cho phép user upload avatar, sinh 5 sticker tâm trạng phong cách Zalo bằng OpenRouter Nano Banana, và dùng sticker thay thế emoji trong mood bottom sheet + dashboard.

**Architecture:** Thêm `avatar_url` + `use_avatar_mood` vào bảng `profiles` hiện có; bảng mới `user_mood_images` lưu 5 sticker per user; Storage buckets `avatars` + `mood-images`; edge function `generate-mood-images` gọi OpenRouter 5× song song; web app thêm avatar picker ở onboarding + settings, conditional sticker render ở mood sheet + dashboard.

**Tech Stack:** Nx, React 19, TypeScript, MUI v7, Supabase Postgres + Storage + Edge Functions (Deno), OpenRouter API (google/nano-banana), TanStack React Query.

**Spec:** `docs/superpowers/specs/2026-04-29-avatar-mood-sticker-design.md`

**New env var (Supabase edge function secret):** `OPENROUTER_API_KEY`

---

## Task Checklist

- [ ] [Task 01 — DB migration & Storage buckets](task-01-migration-storage.md)
- [ ] [Task 02 — API layer: avatar + mood images](task-02-api-layer.md)
- [ ] [Task 03 — Edge function: generate-mood-images](task-03-edge-function.md)
- [ ] [Task 04 — Onboarding: avatar picker + wow screen](task-04-onboarding-avatar-wow.md)
- [ ] [Task 05 — Settings: avatar upload + toggle](task-05-settings-avatar-toggle.md)
- [ ] [Task 06 — Mood sticker render (bottom sheet + dashboard)](task-06-mood-sticker-render.md)
- [ ] [Task 07 — Verification, tracking sync, commit](task-07-verification.md)

---

## File Structure

**New files:**

- `supabase/migrations/<timestamp>_add_avatar_mood_sticker.sql`
- `supabase/functions/generate-mood-images/index.ts`
- `libs/api/src/lib/avatar.ts`
- `apps/health-tracker-web/src/app/onboarding/onboarding-wow-screen.tsx`
- `apps/health-tracker-web/src/app/dashboard/use-user-mood-images.ts`

**Modified files:**

- `libs/api/src/index.ts` — export avatar lib
- `apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx` — avatar picker
- `apps/health-tracker-web/src/app/pages/onboarding-page.tsx` — wow screen flow
- `apps/health-tracker-web/src/app/pages/settings-page.tsx` — avatar + toggle
- `apps/health-tracker-web/src/app/dashboard/mood-bottom-sheet.tsx` — sticker render
- `apps/health-tracker-web/src/app/dashboard/daily-log-strip.tsx` — sticker on card

## Spec Coverage Summary

- DB schema (profiles + user_mood_images + Storage): Task 01
- API helpers: Task 02
- Edge function + OpenRouter + prompt template: Task 03
- Avatar picker in onboarding + wow screen: Task 04
- Settings avatar + toggle: Task 05
- Mood bottom sheet sticker / dashboard card sticker: Task 06
- Verification: Task 07
