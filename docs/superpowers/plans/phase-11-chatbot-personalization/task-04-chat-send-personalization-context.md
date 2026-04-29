### Task 04 — Edge function personalization prompt injection

**Files:**

- Modify: `supabase/functions/chat-send/index.ts`
- Modify: `supabase/functions/chat-send/prompts.ts`
- Modify: `supabase/functions/chat-send/types.ts`
- Modify: `supabase/functions/chat-send/session.ts` (nếu đang chứa profile loading helper)

- [ ] **Step 1:** Thêm type rõ ràng cho `assistant_preferences` và `assistant_goals` trong `types.ts`.
- [ ] **Step 2:** Nạp personalization từ `profiles` trong luồng xử lý `chat-send` với JWT-scoped client.
- [ ] **Step 3:** Tạo helper trong `prompts.ts` để build personalization context block từ profile data.
- [ ] **Step 4:** Inject block personalization vào system/context prompt trước khi gọi Claude.
- [ ] **Step 5:** Thêm fallback mặc định khi dữ liệu personalization trống (`tone friendly`, `length medium`).
- [ ] **Step 6:** Đảm bảo personalization chỉ áp dụng cho message mới (không rewrite lịch sử cũ).
- [ ] **Step 7:** Commit.

Run:

```bash
git add supabase/functions/chat-send
git commit -m "feat: apply personalization context in chat function"
```
