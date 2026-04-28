# Task 05 — MedicationStrip UI

**Design:** `docs/superpowers/designs/2026-04-28-medications.pen`

- Frame `Dashboard / MedicationStrip / Empty`
- Frame `Dashboard / MedicationStrip / WithDoses`

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/medication-strip.tsx`

---

- [ ] **Step 1:** Mở file `.pen` và đọc đúng 2 frame strip trước khi viết JSX.
- [ ] **Step 2:** Render loading state: 1 skeleton card.
- [ ] **Step 3:** Render empty state: icon + copy + action “Quản lý thuốc”.
- [ ] **Step 4:** Render with-doses state: header + counter + list rows + footer action.
- [ ] **Step 5:** Tap row để toggle log/unlog qua hook mutation (optimistic).
- [ ] **Step 6:** Áp dụng style token/theme hiện tại, icon MUI `Rounded`, font `Plus Jakarta Sans`.
- [ ] **Step 7:** Verify lint/build.

```bash
yarn lint && yarn build
```

**Expected outcome:** Dashboard có strip theo đúng frame design, tương tác check/uncheck liều hoạt động.
