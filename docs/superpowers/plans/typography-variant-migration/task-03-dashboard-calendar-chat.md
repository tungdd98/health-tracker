# Task 03 - Migrate dashboard, calendar, and chat surfaces

**Files:**

- Modify: `apps/health-tracker-web/src/app/dashboard/bbt-bottom-sheet.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/cycle-hero.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/daily-log-sheet-layout.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/daily-log-strip.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/medication-strip.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/mood-bottom-sheet.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/outlook-strip.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/weight-bottom-sheet.tsx`
- Modify: `apps/health-tracker-web/src/app/calendar/day-detail-sheet.tsx`
- Modify: `apps/health-tracker-web/src/app/calendar/phase-legend.tsx`
- Modify: `apps/health-tracker-web/src/app/chat/components/disclaimer-welcome.tsx`
- Modify: `apps/health-tracker-web/src/app/chat/components/message-list.tsx`
- Modify: `apps/health-tracker-web/src/app/chat/components/session-history-drawer.tsx`

This task covers the dense display surfaces where the old token system was used most heavily. Keep the existing layout structure and state logic; only migrate the typography semantics.

---

- [x] **Step 1: Migrate prominent dashboard numeric and card headings**

Update [`cycle-hero.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/dashboard/cycle-hero.tsx), [`bbt-bottom-sheet.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/dashboard/bbt-bottom-sheet.tsx), and [`weight-bottom-sheet.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/dashboard/weight-bottom-sheet.tsx) so `metricValue`, `titleMd`, and helper text are expressed through `h5`, `subtitle1`/`subtitle2`, `caption`, and `overline` as appropriate.

- [x] **Step 2: Migrate dashboard strips and sheet labels**

Update [`daily-log-sheet-layout.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/dashboard/daily-log-sheet-layout.tsx), [`daily-log-strip.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/dashboard/daily-log-strip.tsx), [`medication-strip.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/dashboard/medication-strip.tsx), [`mood-bottom-sheet.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/dashboard/mood-bottom-sheet.tsx), and [`outlook-strip.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/dashboard/outlook-strip.tsx) to remove token spreads from `sx` and set variants on the rendered text nodes instead.

- [x] **Step 3: Migrate calendar headings, legends, and detail metadata**

Update [`day-detail-sheet.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/calendar/day-detail-sheet.tsx) and [`phase-legend.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/calendar/phase-legend.tsx) so labels, mini-headings, and helper descriptions use the default variants without local typography overrides.

- [x] **Step 4: Migrate chat welcome, message-list headings, and session history drawer labels**

Update [`disclaimer-welcome.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/chat/components/disclaimer-welcome.tsx), [`message-list.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/chat/components/message-list.tsx), and [`session-history-drawer.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/chat/components/session-history-drawer.tsx) so all remaining `titleMd`-style text uses explicit variants only.

- [x] **Step 5: Re-scan the dashboard, calendar, and chat areas**

Run:

```bash
rg -n "appTokens\\.typography" apps/health-tracker-web/src/app/dashboard apps/health-tracker-web/src/app/calendar apps/health-tracker-web/src/app/chat
```

Expected: no matches.
