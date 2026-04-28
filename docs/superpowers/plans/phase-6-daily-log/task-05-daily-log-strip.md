# Task 05 — DailyLogStrip component

**Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen`

- Empty state → frame `dashboard-predict` (ID: `aoNGi`)
- Filled state → frame `dashboard-stale` (ID: `wbhSh`) — BBT 36.6°C, 😊 Vui, Cân nặng chưa log

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/daily-log-strip.tsx`

---

- [ ] **Step 1:** Open `docs/superpowers/designs/2026-04-26-dashboard.pen` in Pencil app. Read frame `dashboard-predict` (aoNGi) to understand the 3-card layout: equal-width columns, icon + label + value rows, spacing and corner radius.

- [ ] **Step 2:** Read frame `dashboard-stale` (wbhSh) to understand filled card state: accent border color (`primary.main`), value text vs "Chưa log" muted.

- [ ] **Step 3:** Create `daily-log-strip.tsx`. Implement `LogCard` subcomponent (icon, label, value) matching the frame. Props: `icon`, `label`, `value: string | null`, `onClick`.

- [ ] **Step 4:** Implement `DailyLogStrip`. Call `useDailyLog(userId, date)`. When `isLoading`, render 3 `Skeleton variant="rounded"` cards. When loaded, render 3 `LogCard`s with:
  - BBT: `DeviceThermostatRoundedIcon`, label `"BBT"`, value `bbtCelsius.toFixed(2) + "°C"` or null
  - Tâm trạng: smiley emoji icon, label `"Tâm trạng"`, value from `MOOD_EMOJI[mood]` or null
  - Cân nặng: `MonitorWeightRoundedIcon`, label `"Cân nặng"`, value `weightKg.toFixed(1) + " kg"` or null

  Mood emoji map (do not change order or values):

  ```typescript
  const MOOD_EMOJI: Record<MoodValue, string> = {
    sad: '😔',
    neutral: '😐',
    happy: '😊',
    very_happy: '😄',
    tired: '😴',
  };
  ```

- [ ] **Step 5:** Add `openSheet` state (`'bbt' | 'mood' | 'weight' | null`). Each card `onClick` calls `resetError()` then `setOpenSheet(...)`.

- [ ] **Step 6:** Render `<BbtBottomSheet>`, `<MoodBottomSheet>`, `<WeightBottomSheet>` (created in Tasks 06–08). Pass `open={openSheet === '...'}`, `onClose={() => setOpenSheet(null)}`, `currentLog={log}`, `date`, `isMutating={isPending}`, `mutationError={error}`, `onSave={save}`, `onResetError={resetError}`.

- [ ] **Step 7:** `yarn format && yarn lint`

- [ ] **Step 8:** Defer build + commit until after Task 08.
