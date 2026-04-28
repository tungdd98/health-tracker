# Task 05 — MedicationStrip UI

**Design:** `docs/superpowers/designs/2026-04-28-medications.pen`

- Frame `Dashboard / MedicationStrip / Empty`
- Frame `Dashboard / MedicationStrip / WithDoses`

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/medication-strip.tsx`

---

- [x] **Step 1:** Mở file `.pen` và đọc đúng 2 frame strip trước khi viết JSX.
- [x] **Step 2:** Render loading state: 1 skeleton card.
- [x] **Step 3:** Render empty state: icon + copy + action “Quản lý thuốc”.
- [x] **Step 4:** Render with-doses state: header + counter + list rows + footer action.
- [x] **Step 5:** Tap row để toggle log/unlog qua hook mutation (optimistic).
- [x] **Step 6:** Áp dụng style token/theme hiện tại, icon MUI `Rounded`, font `Plus Jakarta Sans`.
- [x] **Step 7:** Verify lint/build.

```bash
yarn lint && yarn build
```

**Expected outcome:** Dashboard có strip theo đúng frame design, tương tác check/uncheck liều hoạt động.
