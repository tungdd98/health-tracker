# Calendar Day Detail — Design Spec

**Date:** 2026-05-01
**Status:** Approved

## Overview

Enhance the calendar page (`apps/health-tracker-web/src/app/calendar/calendar-page.tsx`) so that tapping any day opens a read-only bottom sheet with two sections: cycle phase info and the daily log summary for that day.

## Behavior

- Tapping any day cell in `MonthGrid` opens the day detail bottom sheet.
- The sheet is **read-only** — no logging actions from here.
- The sheet closes on backdrop tap or swipe down.
- Days before `lastPeriodStartDate` or when no cycle data is configured: Section 1 shows "Không có dữ liệu chu kỳ"; Section 2 is hidden.
- Future days (after today): Section 1 is shown (predicted phase), Section 2 is hidden entirely.
- Past days and today: both sections shown.

## Bottom Sheet Layout

### Header

- Date label: e.g. `"Thứ 3, 1 tháng 5 · Ngày 8"`
- Phase color chip badge using the same phase colors from `theme.palette.phase` (already used in `PhaseLegend` and `CycleRing`).

### Section 1 — Pha chu kỳ

Three info rows:
| Row | Content |
|-----|---------|
| Phase name | Full phase label + 1-line description (e.g. "Nang trứng · Năng lượng tăng, thích hợp hoạt động") |
| Day in cycle | e.g. "Ngày 8 / 28" |
| Fertile window | "Đang trong cửa sổ thụ thai" if active; countdown e.g. "Cửa sổ thụ thai bắt đầu · còn 3 ngày"; or "Không trong cửa sổ thụ thai" |

Phase descriptions (one per phase):

- **menstrual** — "Nghỉ ngơi và nạp năng lượng"
- **follicular** — "Năng lượng tăng dần, thích hợp hoạt động"
- **ovulatory** — "Đỉnh năng lượng và khả năng sinh sản"
- **luteal** — "Cơ thể chuẩn bị cho chu kỳ mới"

### Section 2 — Nhật ký ngày

Three read-only rows (mood, BBT, weight). Each row shows the logged value if available, or `"Chưa ghi"` in `text.secondary`. Data fetched from Supabase daily logs for the selected date.

| Field           | Display                              |
| --------------- | ------------------------------------ |
| Tâm trạng       | Mood label or "Chưa ghi"             |
| Nhiệt độ cơ thể | BBT value with unit or "Chưa ghi"    |
| Cân nặng        | Weight value with unit or "Chưa ghi" |

## Architecture

### New files

- `apps/health-tracker-web/src/app/calendar/day-detail-sheet.tsx` — the bottom sheet component
- `apps/health-tracker-web/src/app/calendar/use-day-detail.ts` — query hook fetching daily log for a given date from Supabase

### Modified files

- `apps/health-tracker-web/src/app/calendar/calendar-page.tsx` — hold `selectedDay` state, pass tap handler to `MonthGrid`, render `DayDetailSheet`
- `apps/health-tracker-web/src/app/calendar/month-grid.tsx` — accept `onDayClick` prop, wire tap to each day cell

### Data

- **Cycle phase info** — derived client-side from existing `cycleLengthDays` + `lastPeriodStartDate` via `cycle-utils` (no new API call needed).
- **Daily log** — single Supabase query by `user_id` + `date`; reuses the existing query pattern from `use-daily-log.ts` on the dashboard.

### Component boundaries

- `DayDetailSheet` receives `selectedDay: DateTime | null`, `input` (cycle params), and `userId`. It owns the Supabase fetch internally via `useDayDetail`.
- `MonthGrid` gets an optional `onDayClick: (day: DateTime) => void` prop — backward-compatible, no default behavior change.

## Out of scope

- Logging or editing data from within the sheet.
- Navigating between days inside the sheet.
- Showing symptom tags beyond mood, BBT, and weight.
