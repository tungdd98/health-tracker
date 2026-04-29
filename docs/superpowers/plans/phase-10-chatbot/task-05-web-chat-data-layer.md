# Task 05 — Web chat data layer and streaming hooks

**Files:**

- Create: `libs/api/src/lib/chat.ts`
- Modify: `libs/api/src/index.ts`
- Create: `apps/health-tracker-web/src/app/chat/api/chat-client.ts`
- Create: `apps/health-tracker-web/src/app/chat/hooks/use-chat-stream.ts`
- Create: `apps/health-tracker-web/src/app/chat/hooks/use-chat-sessions.ts`
- Create: `apps/health-tracker-web/src/app/chat/hooks/use-chat-messages.ts`
- Create: `apps/health-tracker-web/src/app/chat/schemas/chat-schemas.ts`

---

- [x] **Step 1:** Tạo shared chat types và helper functions trong `libs/api` cho session list, message history, disclaimer persistence cần dùng ở web app.
- [x] **Step 2:** Tạo `chat-client.ts` để gọi `/functions/v1/chat-send`, parse SSE, và normalize stream events về app-facing shape.
- [x] **Step 3:** Implement `use-chat-stream.ts` để quản lý local runtime state: pending, streaming text, tool activity, emergency flag, retryable error.
- [x] **Step 4:** Implement React Query hooks cho session list/history và invalidate đúng lúc nhận `session`/`done`.
- [x] **Step 5:** Chốt request/response Zod schemas ở app boundary nếu cần guard payload và event parsing.

**Expected outcome:** App có lớp data riêng cho chat, tách biệt khỏi JSX, đủ để route `/chat` chỉ còn orchestration + rendering.
