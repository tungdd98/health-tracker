# Task 08 — Weight Bottom Sheet

**Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen` → frame `weight-bottom-sheet` (ID: `tQYyK`)

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/weight-bottom-sheet.tsx`

Same props shape as `BbtBottomSheetProps` (substitute component name).

---

- [ ] **Step 1:** Open Pencil, read frame `weight-bottom-sheet` (tQYyK): scales icon bubble, title "Cân nặng hôm nay", hint "Cân trước bữa sáng", input row with kg unit, Huỷ/Lưu row.

- [ ] **Step 2:** Implement matching the frame — same Drawer/handle bar/button row structure as BBT sheet. Substitute: `MonitorWeightRoundedIcon`, title `"Cân nặng hôm nay"`, hint `"Cân trước bữa sáng"`, `inputProps={{ step: 0.1, min: 20, max: 300 }}`, `kg` adornment.

- [ ] **Step 3:** Validation: `20 ≤ num ≤ 300`, error `"Cân nặng phải trong khoảng 20–300 kg"`.

- [ ] **Step 4:** `useEffect` on `open`: pre-fill from `currentLog?.weightKg`, clear error, call `onResetError()`.

- [ ] **Step 5:** `yarn format && yarn lint`

- [ ] **Step 6:** Build all UI files

```bash
yarn build
```

Expected: No TypeScript errors.

- [ ] **Step 7:** Commit all UI files (Tasks 05–08)

```bash
git add \
  apps/health-tracker-web/src/app/dashboard/daily-log-strip.tsx \
  apps/health-tracker-web/src/app/dashboard/bbt-bottom-sheet.tsx \
  apps/health-tracker-web/src/app/dashboard/mood-bottom-sheet.tsx \
  apps/health-tracker-web/src/app/dashboard/weight-bottom-sheet.tsx
git commit -m "feat: add DailyLogStrip and 3 bottom sheet components"
```
