# Task 03 — Edge Function transport, auth, and persistence foundation

**Files:**

- Create: `supabase/functions/chat-send/index.ts`
- Create: `supabase/functions/chat-send/session.ts`
- Create: `supabase/functions/chat-send/rate-limit.ts`
- Create: `supabase/functions/chat-send/types.ts`

---

- [x] **Step 1:** Tạo request/response contract cho `chat-send`, gồm body input, SSE event union, và server-side message/session types.
- [x] **Step 2:** Implement request handler nhận JWT từ user, bootstrap Supabase client đúng auth context, và reject các request unauthenticated.
- [x] **Step 3:** Tách logic session bootstrap/load/persist vào `session.ts`, gồm create-session-when-null, load history, update `last_message_at`, và title update hook-point cho later step.
- [x] **Step 4:** Tách rate-limit read/increment vào `rate-limit.ts` theo ngưỡng đã chốt trong spec.
- [x] **Step 5:** Hoàn thiện SSE transport trong `index.ts` với các event nền: `session`, `delta`, `tool_call`, `emergency`, `done`, `error`.
- [ ] **Step 6:** Smoke-test function locally hoặc theo workflow deploy preview đang dùng cho repo.

**Expected outcome:** Edge Function đã có khung auth + session + rate-limit + SSE ổn định để bước Claude/tool loop cắm vào.
