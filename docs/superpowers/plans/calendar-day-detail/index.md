# Calendar Day Detail — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Created:** 2026-05-01

**Status:** Completed

**Goal:** Tap any day on the calendar to open a read-only bottom sheet showing cycle phase info and that day's logged mood/BBT/weight.

**Architecture:** Add an optional `onDayClick` prop to `MonthGrid` so each cell is tappable. `CalendarPage` holds `selectedDay` state and renders a new `DayDetailSheet` component. `DayDetailSheet` derives phase info from `computeCycleSnapshot` (no new API) and fetches the daily log via a new `useDayDetail` hook that reuses the existing `getDailyLog` Supabase call.

**Tech Stack:** React 19, MUI v7, TanStack React Query, Luxon, Supabase, `@health-tracker/api`.

---

## File Map

| Action | Path                                                            |
| ------ | --------------------------------------------------------------- |
| Modify | `apps/health-tracker-web/src/app/calendar/month-grid.tsx`       |
| Create | `apps/health-tracker-web/src/app/calendar/use-day-detail.ts`    |
| Create | `apps/health-tracker-web/src/app/calendar/day-detail-sheet.tsx` |
| Modify | `apps/health-tracker-web/src/app/calendar/calendar-page.tsx`    |

---

## Tasks

- [x] [Task 01 — Add `onDayClick` to MonthGrid](task-01-month-grid-click.md)
- [x] [Task 02 — Create `useDayDetail` hook](task-02-use-day-detail-hook.md)
- [x] [Task 03 — Create `DayDetailSheet` component](task-03-day-detail-sheet.md)
- [x] [Task 04 — Wire everything in CalendarPage](task-04-wire-calendar-page.md)
- [x] [Task 05 — Definition of Done](task-05-definition-of-done.md)
