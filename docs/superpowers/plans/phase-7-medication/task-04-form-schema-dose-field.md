# Task 04 — Medication form schema + dose field

**Files:**

- Create: `apps/health-tracker-web/src/app/medications/medication-form-schema.ts`
- Create: `apps/health-tracker-web/src/app/medications/dose-time-list-field.tsx`

---

- [ ] **Step 1:** Dựng Zod schema theo spec: required `name`, max lengths, `scheduleType`, conditional validation cho `course`.
- [ ] **Step 2:** Validate `doses` (min 1, max 12), `HH:mm` regex.
- [ ] **Step 3:** Tạo `DoseTimeListField` dùng `useFieldArray` (add/remove/reorder nhẹ theo sort).
- [ ] **Step 4:** Hỗ trợ hiển thị lỗi inline cho từng row/time field.
- [ ] **Step 5:** Verify lint/build.

```bash
yarn lint && yarn build
```

**Expected outcome:** Form foundation đầy đủ validation/rules cho daily + course.
