# Task 03 — Medication query hooks

**Files:**

- Create: `apps/health-tracker-web/src/app/medications/use-medications.ts`
- Create: `apps/health-tracker-web/src/app/medications/use-today-medications.ts`

---

- [x] **Step 1:** Implement `useMedications`, `useMedication`, `useCreateMedicationMutation`, `useUpdateMedicationMutation`, `useDeleteMedicationMutation`.
- [x] **Step 2:** Implement `useTodayMedications(userId, date)` để merge `listMedications` + `listDoseLogs`.
- [x] **Step 3:** Áp dụng eligibility logic cho `daily` / `course` đúng spec (today, start date, duration).
- [x] **Step 4:** Implement `useLogDoseMutation` + `useUnlogDoseMutation` với optimistic update/revert.
- [x] **Step 5:** Chuẩn query key và stale times theo spec.
- [x] **Step 6:** Verify lint/build.

```bash
yarn lint && yarn build
```

**Expected outcome:** Hook layer ổn định cho list/form/strip, có optimistic UX khi toggle liều.
