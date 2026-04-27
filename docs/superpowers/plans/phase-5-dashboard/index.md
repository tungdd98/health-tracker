# Health Tracker Dashboard Phase 5

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this phase task-by-task. Track progress in this file first, then inside the task file you are executing.

**Goal:** Replace the temporary `LandingPage` with a real cycle-aware dashboard at `/` and add a read-only calendar page at `/calendar`, backed by pure cycle math helpers and one mutation to log a new period start date.

**Architecture:** Pure cycle math in `dashboard/cycle-utils.ts` (no React imports) feeds declarative components. The hero, 7-day strip, and calendar grid all consume `computeCycleSnapshot()`. One mutation reuses the existing `updateOnboardingProfile` helper from `libs/api`. Bottom navigation reduced to three tabs.

**Tech Stack:** Nx, React 19, TypeScript strict, MUI v7, Luxon, React Router v7, Supabase via `useAuthSession` + `updateOnboardingProfile`, Zod schemas.

**Design file:** `docs/superpowers/designs/2026-04-26-dashboard.pen`

Frame IDs: `dashboard-predict` (aoNGi), `dashboard-overdue` (T25NG), `dashboard-stale` (wbhSh), `dashboard-nudge` (cz7cg), `dashboard-loading` (kfqEh), `calendar-with-data` (KjasN), `calendar-empty` (7rEiB), `calendar-loading` (dQken), `log-period-dialog-idle` (1GzPh), `log-period-dialog-error` (7w0ma).

Shell layout frame: tracked in task #10 (Pencil design for AppShell header + bottom nav). For the bottom nav tab change only, reference `dashboard-predict` (aoNGi).

---

## Tracking

- [x] Task 01: [Tighten cycleLengthDays schema to range 21-45](task-01-schema-tightening.md)
- [x] Task 02: [Update AppShell bottom nav to 3 tabs](task-02-appshell-nav.md)
- [x] Task 03: [Implement cycle math helpers](task-03-cycle-utils.md)
- [x] Task 04: [Implement tip-of-day library](task-04-tip-library.md)
- [x] Task 05: [Implement cycle hero mode derivation](task-05-cycle-hero-modes.md)
- [x] Task 06: [Implement CycleHero component](task-06-cycle-hero.md)
- [x] Task 07: [Implement LogPeriodDialog](task-07-log-period-dialog.md)
- [x] Task 08: [Implement 7-day OutlookStrip](task-08-outlook-strip.md)
- [x] Task 09: [Implement TipOfDay card](task-09-tip-of-day.md)
- [x] Task 10: [Compose DashboardPage](task-10-dashboard-page.md)
- [x] Task 11: [Implement PhaseLegend](task-11-phase-legend.md)
- [x] Task 12: [Implement MonthGrid](task-12-month-grid.md)
- [x] Task 13: [Implement CalendarPage](task-13-calendar-page.md)
- [x] Task 14: [Wire routes, remove LandingPage, update nav handlers](task-14-wire-routes.md)

---

## File Structure Map

**New files:**

| File                                                              | Responsibility                                                                         |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `apps/health-tracker-web/src/app/dashboard/cycle-utils.ts`        | CyclePhase, CycleSnapshot types, constants, PHASE_COLOR_TOKENS, computeCycleSnapshot() |
| `apps/health-tracker-web/src/app/dashboard/cycle-hero-modes.ts`   | CycleHeroMode type, deriveCycleHeroMode()                                              |
| `apps/health-tracker-web/src/app/dashboard/tip-library.ts`        | PHASE_TIPS constant, pickTip()                                                         |
| `apps/health-tracker-web/src/app/dashboard/cycle-hero.tsx`        | SVG ring hero with 4 modes + skeleton                                                  |
| `apps/health-tracker-web/src/app/dashboard/log-period-dialog.tsx` | Confirm dialog + markPeriodStartedToday mutation                                       |
| `apps/health-tracker-web/src/app/dashboard/outlook-strip.tsx`     | 7-day strip                                                                            |
| `apps/health-tracker-web/src/app/dashboard/tip-of-day.tsx`        | Tip card                                                                               |
| `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx`    | Page root: header + hero + tip + strip + CTA + disclaimer                              |
| `apps/health-tracker-web/src/app/calendar/month-grid.tsx`         | 42-cell month grid renderer                                                            |
| `apps/health-tracker-web/src/app/calendar/phase-legend.tsx`       | Four phase chips legend                                                                |
| `apps/health-tracker-web/src/app/calendar/calendar-page.tsx`      | Calendar page: AppShell + month nav + grid + legend                                    |

**Modified files:**

| File                                                               | Change                                                     |
| ------------------------------------------------------------------ | ---------------------------------------------------------- |
| `apps/health-tracker-web/src/app/profile/profile-schemas.ts`       | Add cycleLengthDaysSchema with min(21).max(45)             |
| `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts` | Use cycleLengthDaysSchema for cycleLengthDays              |
| `apps/health-tracker-web/src/app/settings/settings-schemas.ts`     | Use cycleLengthDaysSchema for cycleLengthDays              |
| `libs/ui/src/lib/app-shell.tsx`                                    | Change defaultNavItems to 3 tabs: Home, Calendar, Settings |
| `apps/health-tracker-web/src/app/router.tsx`                       | Swap LandingPage -> DashboardPage, add /calendar route     |
| `apps/health-tracker-web/src/app/pages/settings-page.tsx`          | Add calendar branch in handleNavChange                     |

**Deleted files:**

| File                                                     | Reason                    |
| -------------------------------------------------------- | ------------------------- |
| `apps/health-tracker-web/src/app/pages/landing-page.tsx` | Replaced by DashboardPage |

---

## Spec Coverage

- Schema tightening cycleLengthDays to [21, 45]: Task 01
- Bottom nav 3 tabs (Home, Calendar, Settings): Task 02
- computeCycleSnapshot + PHASE_COLOR_TOKENS: Task 03
- Tip-of-day rotating per phase + ordinal day: Task 04
- 4 hero modes (nudge/predict/overdue/stale): Tasks 05-06
- Log-new-period mutation + confirm dialog + snackbar: Tasks 07, 10
- 7-day outlook strip: Task 08
- Tip card hidden in nudge mode: Tasks 09, 10
- Dashboard composition with skeleton + disclaimer: Task 10
- Phase legend 4 chips: Task 11
- Month grid 42 cells, today highlight, out-of-month dimmed: Task 12
- Calendar page with month nav + empty state + legend: Task 13
- Route wiring, LandingPage removal, auth guards intact: Task 14

## Notes for Implementers

- All cycle math must live in `dashboard/cycle-utils.ts` with no React imports — it is consumed by hero, strip, and calendar alike.
- `computeCycleSnapshot` returns `null` when inputs are missing or `targetDate` is before `lastPeriodStartDate`; this maps to `nudge` mode, not an error.
- `isOverdue` = `daysSinceLastPeriod >= cycleLengthDays - 2`. This stays true through the grace window before staleness — do not use `daysUntilNextPeriod <= 2` which wraps to zero after modulo.
- `isStale` implies `isOverdue`; stale mode renders the ring + banner + log CTA (not a plain nudge card).
- Every UI task must open the `.pen` file in Pencil and read the corresponding frame(s) before writing any JSX.
- No new shared library (`libs/cycle`) is extracted in this phase.
- No animation, no per-day logging beyond `last_period_start_date`, no multi-cycle charts.
