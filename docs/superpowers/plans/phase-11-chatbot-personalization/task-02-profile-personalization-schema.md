### Task 02 — Supabase profile personalization schema

**Files:**

- Create: `supabase/migrations/<timestamp>_profile_assistant_personalization.sql`
- Modify: `apps/health-tracker-web/src/app/chat/schemas/chat-schemas.ts` (nếu cần type/runtime validation dùng chung)

- [ ] **Step 1:** Tạo migration thêm 2 cột JSONB vào `profiles`.

```sql
alter table profiles
  add column assistant_preferences jsonb,
  add column assistant_goals jsonb;
```

- [ ] **Step 2:** Thêm constraint kiểm tra shape cơ bản cho goals (mảng, tối đa 3 phần tử) bằng check constraint an toàn SQL.
- [ ] **Step 3:** Viết rollback trong migration (drop constraint, drop columns) theo chuẩn repo nếu migration pattern hiện tại yêu cầu.
- [ ] **Step 4:** Nếu app layer cần schema parse, thêm Zod schema thống nhất key `assistant_preferences` và `assistant_goals`.
- [ ] **Step 5:** Commit.

Run:

```bash
git add supabase/migrations apps/health-tracker-web/src/app/chat/schemas/chat-schemas.ts
git commit -m "feat: add profile personalization schema"
```
