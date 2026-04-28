# Task 06 — Medications list page

**Design:** `docs/superpowers/designs/2026-04-28-medications.pen`

- Frame `Medications / List / Empty`
- Frame `Medications / List / WithItems`
- Frame `Medications / DeleteConfirm`

**Files:**

- Create: `apps/health-tracker-web/src/app/medications/medication-list-page.tsx`

---

- [x] **Step 1:** Mở `.pen` và đọc 3 frame tương ứng.
- [x] **Step 2:** Dựng page header, action `+ Thêm`, empty state.
- [x] **Step 3:** Dựng list cards: active switch, menu edit/delete, schedule label, dose times.
- [x] **Step 4:** Dựng delete confirm dialog theo frame `DeleteConfirm`.
- [x] **Step 5:** Wire mutations: toggle active, delete, navigate edit/new.
- [x] **Step 6:** Handle loading/error/empty states theo spec.
- [x] **Step 7:** Verify lint/build.

```bash
yarn lint && yarn build
```

**Expected outcome:** `/medications` hỗ trợ list + toggle + edit/delete đầy đủ.
