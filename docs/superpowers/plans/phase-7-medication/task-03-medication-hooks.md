# Task 03 — Medication query hooks

**Files:**

- Create: `apps/health-tracker-web/src/app/medications/use-medications.ts`
- Create: `apps/health-tracker-web/src/app/medications/use-today-medications.ts`

---

- [ ] **Step 1:** Implement `useMedications`, `useMedication`, `useCreateMedicationMutation`, `useUpdateMedicationMutation`, `useDeleteMedicationMutation`.
- [ ] **Step 2:** Implement `useTodayMedications(userId, date)` để merge `listMedications` + `listDoseLogs`.
- [ ] **Step 3:** Áp dụng eligibility logic cho `daily` / `course` đúng spec (today, start date, duration).
- [ ] **Step 4:** Implement `useLogDoseMutation` + `useUnlogDoseMutation` với optimistic update/revert.
- [ ] **Step 5:** Chuẩn query key và stale times theo spec.
- [ ] **Step 6:** Verify lint/build.

```bash
yarn lint && yarn build
```

**Expected outcome:** Hook layer ổn định cho list/form/strip, có optimistic UX khi toggle liều.
