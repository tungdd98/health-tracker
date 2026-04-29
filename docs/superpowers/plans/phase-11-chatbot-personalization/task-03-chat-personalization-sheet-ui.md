### Task 03 — Chat personalization UI and form behavior

**Files:**

- Modify: `apps/health-tracker-web/src/app/chat/chat-page.tsx`
- Create: `apps/health-tracker-web/src/app/chat/components/assistant-personalization-sheet.tsx`
- Create: `apps/health-tracker-web/src/app/chat/hooks/use-chat-personalization.ts`
- Reference: `docs/superpowers/designs/2026-04-29-chatbot-personalization.pen` (frames ở Task 01)

- [ ] **Step 1:** Mở `.pen` bằng Pencil MCP và đọc frame `ChatHeaderSettingsEntry` + các frame sheet trước khi viết JSX (đọc JSON/text `.pen` không hợp lệ cho bước này).
- [ ] **Step 2:** Thêm header action icon `TuneRounded` trong `chat-page.tsx` để mở/đóng bottom sheet.
- [ ] **Step 3:** Implement `assistant-personalization-sheet.tsx` gồm 2 section: `Cách trợ lý trả lời` và `Mục tiêu hiện tại`.
- [ ] **Step 4:** Implement validation UI: tối đa 3 goals, mỗi goal <= 120 ký tự, goal rỗng không được lưu.
- [ ] **Step 5:** Implement CTA `Lưu thay đổi` + `Khôi phục mặc định` và trạng thái loading/disabled theo shared submit pattern.
- [ ] **Step 6:** Thêm hook `use-chat-personalization.ts` đọc/ghi profile personalization qua Supabase API layer hiện có.
- [ ] **Step 7:** Commit.

Run:

```bash
git add apps/health-tracker-web/src/app/chat
git commit -m "feat: add chat personalization bottom sheet"
```
