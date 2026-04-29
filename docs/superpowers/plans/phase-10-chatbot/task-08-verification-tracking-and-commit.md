# Task 08 — Verification, tracking sync, and commit

**Files:**

- Modify: `docs/superpowers/plans/phase-10-chatbot/index.md`
- Modify: `docs/superpowers/plans/phase-10-chatbot/task-*.md`

---

- [ ] **Step 1:** Cập nhật checkbox trong `index.md` và task file ngay khi từng task thực sự xong; không dồn tracking về cuối phiên.
- [ ] **Step 2:** Chạy formatting cho scope đã sửa.

```bash
yarn format
```

- [ ] **Step 3:** Chạy lint toàn repo.

```bash
yarn lint
```

- [ ] **Step 4:** Chạy build app cho thay đổi phase này.

```bash
yarn build
```

- [ ] **Step 5:** Manual smoke-check tối thiểu:
  - vào tab `Trò chuyện`
  - bắt đầu phiên mới
  - nhận stream bình thường
  - đổi session từ history drawer
  - thấy disclaimer/emergency/rate-limit state đúng kịch bản
- [ ] **Step 6:** Commit phase này với message ngắn, đúng conventional commit.

```bash
git add docs/superpowers/plans/2026-04-29-chatbot-implementation.md docs/superpowers/plans/phase-10-chatbot
git commit -m "docs: restructure chatbot implementation plan"
```

**Expected outcome:** Plan tracking khớp với thực tế thực thi, verification bám Definition of Done, và phase sẵn sàng để execute.
