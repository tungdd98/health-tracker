# Task 09 — Verification and smoke test

Verification only.

---

- [ ] **Step 1:** Run required DoD commands.

```bash
yarn format
yarn lint
yarn build
```

- [ ] **Step 2:** Manual smoke test core flow:
  - Login vào app
  - Vào `/medications` thấy empty state
  - Tạo daily 3 liều (08:00, 14:00, 20:00)
  - Tạo course start hôm nay duration=5
  - Tạo course start tương lai
  - Toggle active=false cho 1 thuốc
  - Từ dashboard check/uncheck dose và reload xác nhận persistence
  - Edit thuốc đổi tên/giờ
  - Delete thuốc với confirm dialog

- [ ] **Step 3:** Regression check phase 6 daily log (BBT/mood/weight vẫn thao tác được).

**Expected outcome:** Toàn bộ acceptance criteria trong spec pass trên local.
