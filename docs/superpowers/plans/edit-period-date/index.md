# Edit Period Date — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Created:** 2026-05-01

**Status:** Planning

**Goal:** Let users pick a specific date (up to 90 days in the past) when logging or correcting their period start date, instead of always recording today.

**Architecture:** Extend `AppConfirmDialog` with a `children` slot, upgrade `LogPeriodDialog` to accept `initialDate`/`mode` props and render a `DatePicker`, add an always-visible edit icon to `CycleHero`, and replace the boolean `isDialogOpen` flag in `DashboardPage` with a `dialogMode` discriminant that drives both entry points.

**Tech Stack:** React 19, MUI v7, `@mui/x-date-pickers` v8 (already installed), Luxon (already the date adapter), TypeScript strict.

---

## Task Checklist

- [ ] [Task 01 — Extend AppConfirmDialog with children slot](task-01-app-confirm-dialog-children.md)
- [ ] [Task 02 — Upgrade LogPeriodDialog with DatePicker](task-02-log-period-dialog-date-picker.md)
- [ ] [Task 03 — Add edit icon button to CycleHero](task-03-cycle-hero-edit-button.md)
- [ ] [Task 04 — Wire DashboardPage](task-04-dashboard-wiring.md)

---

## File Structure

| File                                                                | Change                                                                                                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `apps/health-tracker-web/src/app/components/app-confirm-dialog.tsx` | Add optional `children?: ReactNode` prop rendered inside the content stack                                    |
| `apps/health-tracker-web/src/app/dashboard/log-period-dialog.tsx`   | Add `initialDate`, `mode` props; replace hardcoded today with a `DatePicker`                                  |
| `apps/health-tracker-web/src/app/dashboard/cycle-hero.tsx`          | Add `onEditPeriod` prop; render `EditRounded` icon button when `mode !== 'nudge'`                             |
| `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx`      | Replace `isDialogOpen: boolean` with `dialogMode: 'log' \| 'edit' \| null`; pass new props to dialog and hero |
