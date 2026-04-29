# Task 02 — Supabase chat schema and policies

**Files:**

- Create: `supabase/migrations/<timestamp>_chatbot.sql`

---

- [x] **Step 1:** Tạo schema cho `chat_sessions`, `chat_messages`, `chat_usage` theo spec, gồm FK, indexes, timestamp fields, và các constraint cần thiết cho `role`/archive/session ordering.
- [x] **Step 2:** Enable RLS và thêm policy owner-only cho cả 3 bảng để mọi read/write đều bám `auth.uid()`.
- [x] **Step 3:** Giữ disclaimer/emergency-contact persistence ở app metadata layer nếu repo hiện tại vẫn dùng `user_metadata`; migration của task này chỉ bao phủ chat tables và policies.
- [x] **Step 4:** Verify migration trên Supabase workflow đang dùng cho repo.

```bash
supabase db push --linked
```

- [ ] **Step 5:** Commit schema change.

```bash
git add supabase/migrations/<timestamp>_chatbot.sql
git commit -m "feat: add chatbot schema and policies"
```

**Expected outcome:** Database đủ nền cho chat session history, per-user usage tracking, và truy cập an toàn qua RLS.
