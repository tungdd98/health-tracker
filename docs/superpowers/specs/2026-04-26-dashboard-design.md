# Health Tracker Dashboard Design

- Date: 2026-04-26
- Project: Health Tracker
- Phase: Dashboard foundation (phase 5)
- Primary app: `health-tracker-web`

## Goal

Replace the temporary post-onboarding landing page with a real cycle-aware dashboard for users in the `pre-pregnancy` phase, plus a separate read-only calendar page that visualizes their cycle across the month. The dashboard is a daily check-in surface centered on a cycle hero ("am I in my fertile window today, and when is the next event?") and supplies one quick mutation to keep that data fresh: `Đánh dấu kỳ kinh mới hôm nay`.

## Scope

Included in this phase:

- Dashboard route `/` rendering, in vertical order: an `AppHeader` greeting, a circular cycle hero, a tip-of-day card, a 7-day outlook strip, a CTA to the calendar page, and a footer disclaimer
- Cycle hero with four mutually exclusive modes: `predict`, `predict + log-new-period CTA` (when overdue), `nudge` (missing data), and `stale` (data older than two cycle lengths)
- Quick mutation `markPeriodStartedToday()` triggered from the hero CTA, gated by a confirmation dialog and confirmed by a success toast
- Tip-of-day rotating among 3-4 phrases per cycle phase, deterministic by ordinal day of year
- 7-day outlook strip showing today plus the next six days, each colored by phase
- Read-only calendar route `/calendar` with month grid, prev/next month navigation, today highlight, phase legend, and the same disclaimer
- Cycle math helpers (`computeCycleSnapshot`, phase derivation, day-of-cycle math) used by hero, strip, and calendar
- Bottom navigation reduced to three tabs: `Home`, `Calendar`, `Settings`
- Schema tightening: `cycle_length_days` minimum raised to `21` (currently positive integer only) so cycle math cannot produce a non-positive ovulation day; existing maximum, if any, kept; if no maximum is set today, add `≤ 45`
- Removal of the temporary `LandingPage` component once the dashboard replaces it

Explicitly excluded from this phase:

- Mood, symptom, or any per-day logging beyond `last_period_start_date`
- Period length tracking (a fixed constant of 5 days is used)
- Multi-cycle history or trend charts
- Editing cycle data from the calendar page (still happens in Settings only, plus the new hero CTA)
- AI-generated tips, notifications, or reminders
- Pregnancy-specific dashboard variants (the only supported phase remains `pre-pregnancy`)
- New shared library extraction for cycle math (helpers stay inside `apps/health-tracker-web`)

## Recommended Approach

Build the dashboard as a `Today view (cycle-first)` surface anchored by a single hero card, supported by lightweight context (welcome, tip, 7-day strip), and route the deeper "browse a month" experience to a dedicated `/calendar` page. Cycle calculations live in pure helpers next to the dashboard feature; UI components consume snapshots and stay declarative.

Why this approach:

- It answers the daily user question directly (`am I in my fertile window?` plus `when is the next event?`) without overloading the surface
- It separates "today" from "browse the month", keeping the dashboard scannable while giving the calendar room to grow later (mood markers, etc.)
- It reuses the existing onboarding/settings profile source of truth — no new persistence model
- It introduces only one mutation, keeping mutation surface area small and easy to verify
- It avoids premature abstraction: cycle math is pure and testable inside `apps/`; promotion to a shared library can happen when a second consumer needs it

## User Experience

### `/` Dashboard

Vertical layout on a mobile-first viewport (the existing `AppShell` `Container maxWidth="sm"` envelope is reused):

1. **`AppHeader` greeting** — `headerEyebrow="Hôm nay"`, `headerTitle` formatted as the current local date in Vietnamese (e.g. `Thứ Bảy, 26 tháng 4`), `headerSubtitle` as a short greeting that varies by phase (e.g. `Chúc một ngày bình an, An`). Header action slot stays empty.
2. **Cycle hero** — see "Cycle Hero" section.
3. **Tip-of-day card** — `AppCard` with overline `Mẹo hôm nay` and one phrase from the tip library matching the current phase. Hidden in `nudge` mode.
4. **7-day outlook strip** — horizontal `Stack` of seven cells (today plus the next six days). Each cell renders the short weekday abbreviation, day number, and a colored dot for the phase. Today is emphasized via background tint and ring border. Hidden in `nudge` mode.
5. **CTA to calendar** — text-style `Button` reading `Xem lịch chu kỳ` that navigates to `/calendar`. Always visible (the calendar still works in nudge mode, just with a plain grid).
6. **Footer disclaimer** — `Typography` caption, centered, color `text.secondary`: `Thông tin chỉ mang tính ước tính dựa trên dữ liệu bạn cung cấp. Không thay thế tư vấn y tế.`

Behavior expectations:

- The page renders skeleton placeholders for hero, strip, and tip-of-day while the auth session/profile snapshot is still loading. Skeletons must not flash `nudge` mode prematurely.
- The footer disclaimer renders unconditionally once the page is available (including during skeleton state).

### `/calendar` Calendar page

Vertical layout, also wrapped in `AppShell`:

1. **`AppHeader`** — `headerEyebrow="Lịch chu kỳ"`, `headerTitle` showing the displayed month (e.g. `Tháng 4, 2026`), `headerSubtitle="Theo dõi chu kỳ theo tháng"`.
2. **Month nav strip** — `Stack direction="row"` with `IconButton ChevronLeftRounded`, a tappable centered label showing month/year (tap returns to the current month), and `IconButton ChevronRightRounded`. The label itself does not open a picker in this phase.
3. **Month grid** — fixed 7-column grid with up to 6 rows, weekday headers `CN T2 T3 T4 T5 T6 T7`. Each day cell shows the day number and is colored by phase. Days outside the displayed month are rendered greyed (lower opacity), still part of the grid for visual continuity. Today gets a circular ring; selection/tap interactions are not introduced in this phase.
4. **Phase legend** — `Stack` of four chips below the grid, one per phase: `Kỳ kinh`, `Tiền rụng trứng`, `Cửa sổ thụ thai`, `Hoàng thể`. Legend hides when no cycle data is available.
5. **Empty state** — when cycle data is missing, the grid renders without colors (plain neutral cells) and a card under the grid says `Bổ sung thông tin chu kỳ ở Cài đặt`, with a `Mở cài đặt` button navigating to `/settings`.
6. **Footer disclaimer** — same string and styling as the dashboard.

## Cycle Hero

The hero card centers a 200×200 SVG ring representing the full cycle:

- A grey base circle for the entire cycle length
- A coral-tinted arc covering the menstrual days (`1..PERIOD_LENGTH_DAYS`)
- A warm-orange-tinted arc covering the fertile window (`ovulation_day - 5 .. ovulation_day + 1`)
- A small filled marker at the angular position of `dayOfCycle`
- Center text: phase badge (`CỬA SỔ THỤ THAI`, `PHA HOÀNG THỂ`, `PHA KỲ KINH`, `PHA TIỀN RỤNG TRỨNG`), then `Ngày X / Y`, then the most relevant countdown line

The four modes:

### Predict mode

Shown when a complete, non-stale snapshot is available. The hero renders the ring + center text + a single countdown sentence below the SVG: either `Cửa sổ thụ thai kết thúc · còn N ngày` (when in fertile), `Cửa sổ thụ thai bắt đầu · còn N ngày` (when before fertile in this cycle), or `Kỳ kinh tiếp theo · còn N ngày` (otherwise).

### Predict + log-new-period CTA

Triggered when `isOverdue` is true (i.e. `daysSinceLastPeriod >= cycleLengthDays - 2`). This covers both "approaching next period" and "past the predicted start without logging yet", up to the staleness threshold. Predict mode is rendered as-is, plus an outlined `Button` underneath the countdown line: `Đánh dấu kỳ kinh mới hôm nay`. Tap opens the confirm dialog described in "Mutation: log new period".

### Nudge mode

Shown when `cycle_length_days` or `last_period_start_date` is missing. The SVG is replaced by a friendly card body (no ring) reading `Bổ sung thông tin chu kỳ để xem dự đoán hôm nay`, with a primary `Mở cài đặt` button navigating to `/settings`. Tip-of-day and 7-day strip are hidden on the dashboard while in nudge mode (the dashboard CTA to calendar and disclaimer stay).

### Stale mode

Triggered when a snapshot exists but `isStale` is true (`daysSinceLastPeriod > 2 × cycleLengthDays`). The ring renders predict mode, but a small banner is overlaid at the top of the hero card: `Dữ liệu chu kỳ có vẻ cũ — hãy cập nhật để dự đoán chính xác hơn.` Because `isStale` implies `isOverdue`, the log-new-period CTA is shown alongside, with extra visual emphasis to nudge the update.

## Cycle Math Model

All cycle math lives in a pure module (no React imports) so it can be reused by the hero, the 7-day strip, and the calendar.

### Inputs

- `cycleLengthDays: number`
- `lastPeriodStartDate: DateTime` (Luxon — already used in this codebase)
- `targetDate: DateTime` — the date being inspected (today for the hero, or one specific day for the calendar/strip)

### Constants

- `PERIOD_LENGTH_DAYS = 5`
- `LUTEAL_LENGTH_DAYS = 14` (fixed; ovulation is computed as `cycleLengthDays - 14`)
- `FERTILE_WINDOW_BEFORE_OVULATION = 5`
- `FERTILE_WINDOW_AFTER_OVULATION = 1`

### Day-of-cycle calculation

```
const daysSinceLastPeriod = floor(targetDate.diff(lastPeriodStartDate, 'days'))
if (daysSinceLastPeriod < 0) return null
const dayOfCycle = (daysSinceLastPeriod % cycleLengthDays) + 1   // 1-indexed
```

### Phase boundaries (1-indexed)

- `menstrual`: `1 .. PERIOD_LENGTH_DAYS`
- `ovulationDay = cycleLengthDays - LUTEAL_LENGTH_DAYS`
- `fertile window`: `[ovulationDay - 5, ovulationDay + 1]`
- `follicular`: `PERIOD_LENGTH_DAYS + 1 .. fertileStart - 1`
- `luteal`: `fertileEnd + 1 .. cycleLengthDays`

Phase resolution priority for any `dayOfCycle`:

1. `menstrual` if within period days
2. `fertile` if within the fertile window (overrides follicular/luteal because it is the most user-relevant signal)
3. `follicular` if after period and before fertile
4. `luteal` if after fertile to end of cycle

### Output

```
type CyclePhase = 'menstrual' | 'follicular' | 'fertile' | 'luteal'

type CycleSnapshot = {
  dayOfCycle: number                    // 1..cycleLengthDays (modulo)
  phase: CyclePhase
  isOvulationDay: boolean
  isFertileWindow: boolean
  daysSinceLastPeriod: number           // raw, unbounded count from lastPeriodStartDate to targetDate
  daysUntilNextPeriod: number           // (cycleLengthDays - dayOfCycle + 1) within the active cycle
  daysUntilFertileEnd: number | null    // null when not in fertile
  daysUntilFertileStart: number | null  // null when fertile is in the past for this cycle or already in fertile
  isOverdue: boolean                    // daysSinceLastPeriod >= cycleLengthDays - 2
  isStale: boolean                      // daysSinceLastPeriod > 2 × cycleLengthDays
}

function computeCycleSnapshot(input): CycleSnapshot | null
```

The function returns `null` when inputs are missing or when `targetDate` is before `lastPeriodStartDate`.

`isOverdue` is the key signal for the log-new-period CTA: it stays true from two days before the predicted next period through the entire grace window before staleness, including the period where modulo would otherwise hide the CTA. `isStale` is a strictly stronger condition that overrides the predict-only mode with a banner.

### Validation alignment

To keep math safe across the app, the existing `optionalPositiveIntegerSchema` for `cycle_length_days` is tightened in this phase: minimum `21`, maximum `45`. Both the onboarding cycle step and the settings cycle/body section use the same schema, so the change applies uniformly.

## Tip-of-day Library

Tips are stored as a plain in-app constant; no fetching or i18n layer is added.

```
phaseTips: Record<CyclePhase, string[]>
```

Each phase has 3-4 short Vietnamese phrases (≤ 140 characters each). Selection is deterministic per local day:

```
pickTip(phase, today) = phaseTips[phase][today.ordinal % phaseTips[phase].length]
```

Tone is warm, supportive, and non-medical. The tip is hidden in nudge mode because no phase is known.

## 7-day Outlook Strip

The strip renders today plus the next six days. For each cell:

- Top: weekday abbreviation (`CN`, `T2`, …, `T7`)
- Middle: day number
- Bottom: a small dot in the phase color

Today's cell uses a tinted background and a subtle ring border to stand out. The strip uses the same `computeCycleSnapshot` per day; it does not perform any calendar/grid layout itself. The strip hides in nudge mode.

## Calendar Page Details

- Month state is local component state (no URL parameter for now), defaulting to the current month.
- The grid renders 42 cells (6 rows × 7 columns); cells outside the displayed month are dimmed but still computed (for visual continuity).
- Each cell calls `computeCycleSnapshot` for that date and applies a color token from a single source-of-truth map (`PHASE_COLOR_TOKENS`) shared with the hero, strip, and legend.
- The legend uses the same map so colors stay consistent.
- Today's cell renders an outlined ring matching the strip style.
- Tapping a cell does nothing in this phase.

## Mutation: Log New Period

The dashboard introduces exactly one mutation: patch `last_period_start_date` to today.

### Trigger

The hero CTA `Đánh dấu kỳ kinh mới hôm nay` opens a modal `Dialog` titled `Xác nhận kỳ kinh mới` with body `Đánh dấu hôm nay là ngày bắt đầu kỳ kinh mới? Hệ thống sẽ cập nhật dự đoán chu kỳ.` and two buttons: `Huỷ` (text) and `Xác nhận` (contained primary).

### Flow

1. User taps `Xác nhận`.
2. The mutation calls the existing profile-patch helper used by Settings, with payload `{ last_period_start_date: DateTime.local().toISODate() }`. If the existing helper requires a full section payload, a small wrapper `markPeriodStartedToday()` is added at the apps layer to keep the call site clean.
3. While the request is in flight: the `Xác nhận` button is disabled and shows a spinner; the dialog itself cannot be dismissed.
4. On success: the dialog closes, the profile snapshot refreshes via the same mechanism Settings already relies on, the hero re-renders against the new cycle, and a success `Snackbar` appears anchored bottom-center reading `Đã cập nhật kỳ kinh mới.`. The toast auto-dismisses after roughly 4 seconds.
5. On failure: the dialog stays open; an inline error message under the body reads `Không lưu được. Vui lòng thử lại.`; the buttons return to idle. No automatic retry.

### Idempotency

Tapping the CTA, confirming, then tapping again on the same day patches the same date again — accepted; the action is naturally idempotent. The dialog should not block based on "already updated today" in this phase.

## Data and Persistence

- All read paths use the existing `useAuthSession` hook, which already exposes `onboardingProfile` containing the fields the dashboard needs (`cycle_length_days`, `last_period_start_date`, `display_name`, `selected_phase`).
- No new React Query keys, tables, or columns are introduced.
- The single write path reuses the profile-patch helper introduced in the settings phase.
- After a successful write, the dashboard relies on the same snapshot refresh mechanism Settings already triggers; both surfaces stay coherent without a custom invalidation path.

## UI States and Error Handling

| Situation                     | Dashboard render                                   | Calendar render                         |
| ----------------------------- | -------------------------------------------------- | --------------------------------------- |
| Auth still loading            | Skeletons (hero + tip + strip)                     | Skeleton grid                           |
| Auth done, missing cycle data | Hero `nudge`; tip + strip hidden                   | Plain grid + nudge card; legend hidden  |
| Auth done, full data          | Hero `predict` (+ log CTA when `isOverdue`)        | Colored grid + legend                   |
| Stale data                    | Hero `predict` + stale banner + log CTA emphasized | Colored grid (math still runs) + legend |
| Mutation in flight            | Dialog buttons disabled + spinner                  | n/a                                     |
| Mutation success              | Dialog closes, snackbar appears, hero refreshes    | n/a                                     |
| Mutation failure              | Dialog stays open with inline error                | n/a                                     |

## Architecture and File Layout

Phase 5 does not introduce a new shared library. It adds two feature folders inside the web app and reuses primitives from `libs/ui`, `libs/api`, and `libs/forms`.

```
apps/health-tracker-web/src/app/
├── dashboard/
│   ├── cycle-utils.ts              // pure cycle math
│   ├── tip-library.ts              // phaseTips + pickTip
│   ├── cycle-hero.tsx              // SVG ring + mode rendering
│   ├── cycle-hero-modes.ts         // mode derivation from snapshot
│   ├── outlook-strip.tsx           // 7-day strip
│   ├── tip-of-day.tsx              // tip card
│   ├── log-period-dialog.tsx       // confirm dialog + mutation hook
│   └── dashboard-page.tsx          // composes everything + footer disclaimer
├── calendar/
│   ├── calendar-page.tsx           // AppShell wrapper + month nav + grid
│   ├── month-grid.tsx              // grid renderer using cycle-utils
│   └── phase-legend.tsx
├── pages/
│   ├── dashboard-page.tsx          // thin re-export of dashboard/dashboard-page
│   └── calendar-page.tsx           // thin re-export of calendar/calendar-page
└── router.tsx                      // updated routes + nav handlers
```

`PHASE_COLOR_TOKENS` lives in `dashboard/cycle-utils.ts` (or a small adjacent file) so the hero, strip, calendar grid, and legend all share one source of truth.

`apps/health-tracker-web/src/app/pages/landing-page.tsx` is removed once the dashboard replaces it; the corresponding import in `router.tsx` is updated. No backward-compatibility shim is kept.

## Routing and Navigation

`router.tsx` updates:

- `/` swaps from `<LandingPage />` to `<DashboardPage />`, still wrapped by `PrivateRoute`.
- New `/calendar` route renders `<CalendarPage />`, wrapped by `PrivateRoute`.

`libs/ui/src/lib/app-shell.tsx` updates:

- `defaultNavItems` becomes `[Home, Calendar, Settings]` (icons: `HomeRounded`, `CalendarMonthRounded`, `TuneRounded`). The previous `Log` and `Trends` items are removed.
- `DashboardPage`, `CalendarPage`, and the existing `SettingsPage` each pass the corresponding `navValue` (`home`, `calendar`, `settings`) and an `onNavChange` that routes to the matching path.

Existing `PrivateRoute` semantics are unchanged; both new pages benefit from auth + onboarding gating already in place.

## Validation Rules

Existing onboarding/settings field rules continue to apply, with one tightening:

- `cycle_length_days` must be in `[21, 45]` (previously: positive integer only). The change is applied to the schema reused by both onboarding and settings to keep behavior consistent. Any future entry path (e.g. settings cycle section) is automatically aligned because they consume the same schema.

No other field rules change in this phase.

## Verification

This phase is complete when the following are true:

- An authenticated user with `cycle_length_days` and `last_period_start_date` lands on `/` and sees the cycle hero in `predict` mode with the correct phase, day-of-cycle, countdown, tip-of-day, and 7-day strip; today is highlighted.
- An authenticated user without complete cycle data lands on `/` and sees the hero in `nudge` mode, no tip, no strip, but still sees the calendar CTA and the footer disclaimer; tapping `Mở cài đặt` navigates to `/settings`.
- When `isOverdue` is true, the hero shows the `Đánh dấu kỳ kinh mới hôm nay` CTA. Tapping it opens the confirm dialog. Confirming triggers the mutation; on success, the dialog closes, a snackbar appears, and the hero refreshes to day 1 of a new cycle.
- When the snapshot is stale, the hero shows the stale banner and emphasizes the log-new-period CTA regardless of where in the cycle today falls.
- Tapping the calendar CTA opens `/calendar`. With full data, the month grid is colored by phase, today shows a ring, the legend renders four chips, and prev/next month navigation updates both the displayed month label and the grid.
- Without cycle data, `/calendar` shows a plain grid plus the nudge card to settings; legend hides.
- Bottom navigation everywhere shows three tabs (`Home`, `Calendar`, `Settings`) with the active tab matching the current route.
- Unauthenticated access to `/` or `/calendar` redirects to `/login`; users with incomplete onboarding redirect to `/onboarding`. Existing guards already handle this — verification means it still works after route additions.
- `yarn format`, `yarn lint`, and `yarn build` all succeed.

## Risks and Controls

| Risk                                                                                | Control                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| User sets `last_period_start_date` to a future date through Settings, breaking math | `computeCycleSnapshot` returns `null` when `daysSinceLastPeriod < 0`, which falls through to nudge UI. Verification: settings date schema should reject future dates; if it does not today, add that rule when this phase is implemented |
| Cycle length values that make `ovulationDay ≤ 0` or `> cycleLength - 1`             | Schema raise to `[21, 45]` prevents both extremes                                                                                                                                                                                        |
| SVG hero ring is harder to style than text-based hero                               | Hero renders pure SVG inside an `AppCard`; all geometry is computed from snapshot fields; visual states are limited to four modes; no animation in this phase                                                                            |
| Tip rotation differs across devices in different time zones                         | Acceptable — tip variation per timezone has no functional impact; the rule is "deterministic per local ordinal day"                                                                                                                      |
| Mutation fires while another profile patch is in flight                             | Dialog disables buttons during the in-flight period; mutation hook relies on the same React Query in-flight protection used by Settings                                                                                                  |
| Calendar grid recomputes 42 snapshots per render                                    | 42 cells is small enough that explicit memoization is optional; if profile changes are infrequent, snapshots can be cached per `(monthKey, profileVersion)` if needed                                                                    |

## Constraints

- Keep this phase focused: no new logging surfaces, no period-length editing, no charts, no AI tips
- Do not extract a `libs/cycle` shared library yet; revisit when a second consumer needs the helpers
- Do not introduce new dependencies for SVG or calendar rendering — current React + MUI primitives are sufficient
- Do not let calendar or dashboard write any data other than the single `markPeriodStartedToday` mutation

## Success Criteria

The dashboard phase is successful when:

- A returning user opens `/` and immediately understands their fertile window status today and the next event
- The cycle hero stays accurate over time without forcing the user into Settings every cycle (the log-new-period CTA closes the loop)
- A user with incomplete or stale data is guided clearly back to a fix path (Settings or the same CTA), without ever seeing broken predictions
- The calendar page makes the month-level pattern of cycle phases legible at a glance, with no extra interaction required
- Implementation aligns with existing onboarding/settings data and patterns instead of introducing parallel sources of truth
