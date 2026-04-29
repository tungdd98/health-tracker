### Task 05 — Verification, tracking sync, and commit

**Files:**

- Modify: `docs/superpowers/plans/phase-11-chatbot-personalization/index.md`
- Modify: `docs/superpowers/plans/phase-11-chatbot-personalization/task-*.md`

- [x] **Step 1:** Chạy format cho đúng định nghĩa done.

Run: `yarn format`
Expected: format thành công, không còn diff style ngoài thay đổi chủ đích.

- [x] **Step 2:** Chạy lint toàn repo.

Run: `yarn lint`
Expected: PASS tất cả projects.

- [x] **Step 3:** Chạy build app web.

Run: `yarn build`
Expected: `health-tracker-web` build thành công.

- [x] **Step 4:** Đồng bộ tracking: tick `[x]` task hoàn tất trong `index.md` và checklists trong từng task file.
- [x] **Step 5:** Commit gói hoàn thiện phase personalization.

Run:

```bash
git add docs/superpowers/plans/phase-11-chatbot-personalization
git add apps/health-tracker-web/src/app/chat supabase/functions/chat-send supabase/migrations
git commit -m "feat: add chatbot personalization preference flow"
```
