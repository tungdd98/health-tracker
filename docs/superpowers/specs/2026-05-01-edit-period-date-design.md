# Edit Period Date — Design Spec

**Date:** 2026-05-01
**Feature area:** Dashboard / Cycle tracking

## Problem

The "Đánh dấu kỳ kinh mới" dialog hardcodes today's date. Users who forgot to log their period, or who tapped the button on the wrong day, have no way to correct the `lastPeriodStartDate` without going into Settings and editing cycle info manually.

## Goals

- Allow users to backdate a period they forgot to log.
- Allow users to correct a previously logged date.
- Keep the common "starting today" path fast (one dialog, pre-filled to today).

## Out of Scope

- Period history / multiple logged periods.
- Cycle length editing (remains in Settings).

---

## Entry Points

Two entry points open the same unified dialog:

### 1. "Đánh dấu kỳ kinh mới" button

- Existing button on `CycleHero`, shown only when `mode === 'overdue' || mode === 'stale'`.
- Opens dialog with `mode='log'`, `initialDate = today`.

### 2. Edit icon button (new)

- A small `EditRounded` icon button in the top-right corner of the `CycleHero` card.
- Visible whenever `mode !== 'nudge'` (i.e. a snapshot exists).
- Must have `aria-label="Chỉnh sửa ngày bắt đầu kỳ kinh"`.
- Opens dialog with `mode='edit'`, `initialDate = onboardingProfile.lastPeriodStartDate`.

`CycleHero` receives one new prop: `onEditPeriod: () => void`.

---

## Dialog: `LogPeriodDialog`

### Props changes

| Prop          | Type              | Notes                                                  |
| ------------- | ----------------- | ------------------------------------------------------ |
| `initialDate` | `string`          | ISO date (e.g. `"2026-04-28"`). Passed from dashboard. |
| `mode`        | `'log' \| 'edit'` | Controls title copy.                                   |

### Behaviour

- **Title:** `"Xác nhận kỳ kinh mới"` (`log`) / `"Chỉnh sửa ngày bắt đầu"` (`edit`).
- **Body:** MUI `DatePicker` (from `@mui/x-date-pickers`) pre-filled with `initialDate`.
  - `maxDate`: today.
  - `minDate`: today minus 90 days.
- **Confirm button:** disabled when no date is selected or date is out of range.
- **Submit:** calls `updateOnboardingProfile(user, { lastPeriodStartDate: selectedDate })`.
- **Error / loading:** unchanged from current implementation.

`AppConfirmDialog` should be extended with a `children` slot to host the date picker; if that is awkward, `LogPeriodDialog` may switch to a plain MUI `Dialog` directly.

---

## Dashboard Wiring

Replace `isDialogOpen: boolean` with `dialogMode: 'log' | 'edit' | null`.

| Action          | Sets `dialogMode` | `initialDate` passed                                                    |
| --------------- | ----------------- | ----------------------------------------------------------------------- |
| `onLogPeriod`   | `'log'`           | `DateTime.local().toISODate()`                                          |
| `onEditPeriod`  | `'edit'`          | `onboardingProfile.lastPeriodStartDate ?? DateTime.local().toISODate()` |
| Close / success | `null`            | —                                                                       |

`open` prop on `LogPeriodDialog`: `dialogMode !== null`.

On success, the existing refetch / profile invalidation flow is unchanged.

---

## Data

No schema changes. `lastPeriodStartDate` in Supabase user metadata already stores any ISO date string. The only change is that the value written may now be a past date chosen by the user rather than today.

---

## Date Constraints

| Bound | Value           | Reason                                          |
| ----- | --------------- | ----------------------------------------------- |
| Max   | Today           | Cannot log a future period                      |
| Min   | Today − 90 days | Covers ~3 cycles; prevents obviously stale data |
