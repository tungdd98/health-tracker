# Task 07 — Verification, Tracking Sync, Commit

**Files:**

- Modify: `docs/superpowers/plans/phase-12-avatar-mood-sticker/index.md`

---

- [ ] **Step 1:** Chạy full verification.

```bash
yarn format && yarn lint && yarn build
```

Expected: tất cả pass không lỗi.

- [ ] **Step 2:** Smoke test thủ công trên `yarn dev` (port 4200).

Verify:

- [ ] Upload avatar trong Basic Profile step → loading overlay → wow screen hiện 5 sticker
- [ ] Skip avatar → onboarding tiếp tục bình thường (không có wow screen)
- [ ] Settings: thay avatar → dialog hỏi tạo lại → sticker cập nhật
- [ ] Toggle off _"Dùng sticker cá nhân"_ → mood bottom sheet về emoji
- [ ] Toggle on → mood bottom sheet hiện sticker
- [ ] Log mood → dashboard card hiện sticker tương ứng
- [ ] User không có avatar → toàn bộ emoji như cũ

- [ ] **Step 3:** Cập nhật `index.md` — đánh dấu tất cả tasks đã hoàn thành.

- [ ] **Step 4:** Commit cuối.

```bash
git add docs/superpowers/plans/phase-12-avatar-mood-sticker/
git commit -m "feat: complete avatar and mood sticker phase"
```
