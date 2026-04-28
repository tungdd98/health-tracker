# Task 02 — Data layer (libs/api)

**Files:**

- Create: `libs/api/src/lib/medication.ts`
- Modify: `libs/api/src/index.ts`

---

- [x] **Step 1:** Khai báo types: `ScheduleType`, `Dose`, `Medication`, `MedicationDraft`, `DoseLog`.
- [x] **Step 2:** Implement medication APIs: `listMedications`, `getMedication`, `createMedication`, `updateMedication`, `deleteMedication`.
- [x] **Step 3:** Implement dose log APIs: `listDoseLogs`, `logDose`, `unlogDose` (idempotent cho log).
- [x] **Step 4:** Export module từ `libs/api/src/index.ts`.
- [x] **Step 5:** Verify type/build.

```bash
yarn build
```

- [x] **Step 6:** Commit data layer.

```bash
git add libs/api/src/lib/medication.ts libs/api/src/index.ts
git commit -m "feat: add medication api layer"
```

**Expected outcome:** `libs/api` cung cấp đầy đủ API cho medication và dose logs.
