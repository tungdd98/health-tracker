# Task 08 — Router wiring + dashboard integration

**Files:**

- Modify: `apps/health-tracker-web/src/app/app.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx`

---

- [x] **Step 1:** Add private routes:
  - `/medications`
  - `/medications/new`
  - `/medications/:id/edit`
- [x] **Step 2:** Insert `MedicationStrip` vào dashboard ngay sau `DailyLogStrip`.
- [x] **Step 3:** Đảm bảo bottom nav giữ nguyên 3 item hiện tại.
- [x] **Step 4:** Chạy lint/build regression.

```bash
yarn lint && yarn build
```

**Expected outcome:** Route + dashboard flow hoàn chỉnh, không phá các phần phase 5/6.
