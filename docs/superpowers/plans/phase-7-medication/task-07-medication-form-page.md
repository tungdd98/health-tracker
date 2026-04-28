# Task 07 — Medication form page (new/edit)

**Design:** `docs/superpowers/designs/2026-04-28-medications.pen`

- Frame `Medications / Form / Daily`
- Frame `Medications / Form / Course`

**Files:**

- Create: `apps/health-tracker-web/src/app/medications/medication-form-page.tsx`

---

- [x] **Step 1:** Mở `.pen` và đọc 2 frame form trước khi code.
- [x] **Step 2:** Dựng shared page cho create/edit dùng RHF + schema task 04.
- [x] **Step 3:** Render conditional fields cho `course` (start date, duration, computed end-date label).
- [x] **Step 4:** Wire submit create/update qua hooks, handle loading + inline network error.
- [x] **Step 5:** Wire cancel/back về `/medications`, prefill data khi edit.
- [x] **Step 6:** Verify validation UX: required, max length, min/max duration, min/max doses.
- [x] **Step 7:** Verify lint/build.

```bash
yarn lint && yarn build
```

**Expected outcome:** `/medications/new` và `/medications/:id/edit` hoạt động đúng rule daily/course.
