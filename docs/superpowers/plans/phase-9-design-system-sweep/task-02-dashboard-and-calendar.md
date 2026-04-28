# Task 02: Refactor dashboard, daily-log, and calendar surfaces

**Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen`

**Files:**

- Modify: `apps/health-tracker-web/src/app/dashboard/cycle-hero.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/daily-log-strip.tsx`
- Create: `apps/health-tracker-web/src/app/dashboard/daily-log-sheet-layout.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/bbt-bottom-sheet.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/mood-bottom-sheet.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/weight-bottom-sheet.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/outlook-strip.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/medication-strip.tsx`
- Modify: `apps/health-tracker-web/src/app/calendar/calendar-page.tsx`
- Modify: `apps/health-tracker-web/src/app/calendar/month-grid.tsx`
- Modify: `apps/health-tracker-web/src/app/calendar/phase-legend.tsx`

- [x] Replace bottom-sheet and strip literals with semantic theme roles.
- [x] Keep phase colors in the theme and move warning/banner treatments to semantic roles.
- [x] Align card, chip, and metric typography across dashboard and calendar.

**Expected outcome:** Dashboard and calendar screens share consistent surface, border, shadow, and typography language.
