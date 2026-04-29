# Task 06 — Chat route, shell wiring, and primary screens

**Files:**

- Modify: `apps/health-tracker-web/src/app/router.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx` or current nav owner
- Create: `apps/health-tracker-web/src/app/chat/chat-page.tsx`
- Create: `apps/health-tracker-web/src/app/chat/components/message-list.tsx`
- Create: `apps/health-tracker-web/src/app/chat/components/message-bubble.tsx`
- Create: `apps/health-tracker-web/src/app/chat/components/composer.tsx`
- Create: `apps/health-tracker-web/src/app/chat/components/disclaimer-welcome.tsx`

---

- [x] **Step 1:** Mở Pencil file `docs/superpowers/designs/2026-04-29-chatbot.pen` và đọc các frame `ChatEmpty`, `ChatActive`, `ChatDisclaimer` trước khi viết JSX.
- [x] **Step 2:** Thêm route private `/chat` và nối bottom nav sang tab `Trò chuyện`, giữ icon MUI `Rounded` theo rule của repo.
- [x] **Step 3:** Dựng `chat-page.tsx` làm route orchestrator: active session selection, disclaimer gate, empty-vs-active shell, send action entrypoint.
- [x] **Step 4:** Dựng các component nền cho message list, bubble, và composer bám frame Pencil; không re-invent layout ngoài design artifact.
- [x] **Step 5:** Wire first-message flow: chưa có session thì gửi với `session_id: null`, nhận event `session`, rồi đồng bộ state/query.

**Expected outcome:** Người dùng vào được tab `Trò chuyện`, thấy đúng shell theo design, và có thể bắt đầu một phiên chat mới.
