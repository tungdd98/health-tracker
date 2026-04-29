# Task 07 — Streaming, emergency, history, and rate-limit states

**Files:**

- Create: `apps/health-tracker-web/src/app/chat/components/tool-call-chip.tsx`
- Create: `apps/health-tracker-web/src/app/chat/components/emergency-alert-card.tsx`
- Create: `apps/health-tracker-web/src/app/chat/components/session-history-drawer.tsx`
- Modify: `apps/health-tracker-web/src/app/chat/chat-page.tsx`
- Modify: `apps/health-tracker-web/src/app/chat/components/message-list.tsx`
- Modify: `apps/health-tracker-web/src/app/chat/components/composer.tsx`

---

- [x] **Step 1:** Mở Pencil file và đọc các frame `ChatStreaming`, `ChatEmergency`, `ChatHistoryDrawer`, `ChatRateLimited` trước khi chỉnh UI state.
- [x] **Step 2:** Thêm runtime rendering cho streaming assistant bubble và tool-call chip trong lúc SSE đang chạy.
- [x] **Step 3:** Thêm emergency card + call actions khi backend emit event `emergency`, nhưng vẫn giữ transcript nhất quán.
- [x] **Step 4:** Dựng history drawer để liệt kê session, đổi session active, và khởi tạo `new chat` mà không pre-create DB row.
- [x] **Step 5:** Hiển thị rate-limit/upstream error state đúng chỗ, composer disable đúng lúc, và retry flow không làm mất user draft/message context nếu spec yêu cầu giữ lại.

**Expected outcome:** Chat UI cover đủ runtime states quan trọng của spec thay vì chỉ có default screen.
