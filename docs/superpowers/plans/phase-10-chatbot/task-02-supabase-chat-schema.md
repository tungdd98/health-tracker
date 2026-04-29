# Task 02 — Supabase chat schema and policies

**Files:**

- Create: `supabase/migrations/<timestamp>_chatbot.sql`

---

- [ ] **Step 1:** Tạo schema cho `chat_sessions`, `chat_messages`, `chat_usage` theo spec, gồm FK, indexes, timestamp fields, và các constraint cần thiết cho `role`/archive/session ordering.
- [ ] **Step 2:** Enable RLS và thêm policy owner-only cho cả 3 bảng để mọi read/write đều bám `auth.uid()`.
- [ ] **Step 3:** Bổ sung phần lưu dữ liệu cần cho phase này trong migration nếu spec chốt cần persistence ngoài chat tables, ví dụ disclaimer/emergency-contact support.
- [ ] **Step 4:** Verify migration trên Supabase workflow đang dùng cho repo.

```bash
supabase db push --linked
```

- [ ] **Step 5:** Commit schema change.

```bash
git add supabase/migrations/<timestamp>_chatbot.sql
git commit -m "feat: add chatbot schema and policies"
```

**Expected outcome:** Database đủ nền cho chat session history, per-user usage tracking, và truy cập an toàn qua RLS.
