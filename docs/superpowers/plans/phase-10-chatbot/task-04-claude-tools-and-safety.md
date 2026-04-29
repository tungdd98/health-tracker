# Task 04 — Claude prompt, tools, and safety loop

**Files:**

- Create: `supabase/functions/chat-send/claude.ts`
- Create: `supabase/functions/chat-send/tools.ts`
- Create: `supabase/functions/chat-send/prompts.ts`
- Modify: `supabase/functions/chat-send/index.ts`

---

- [x] **Step 1:** Viết `prompts.ts` cho system prompt tiếng Việt theo spec, gồm personal-data guidance, medication caution, và emergency rule với token `[[EMERGENCY]]`.
- [x] **Step 2:** Khai báo tool definitions trong `tools.ts` cho profile, medications, adherence, daily logs, và summary; mọi query phải chạy bằng Supabase client mang JWT user.
- [x] **Step 3:** Implement tool dispatcher và server-side truncation rule khi tool result quá lớn.
- [x] **Step 4:** Bọc Anthropic streaming + prompt caching trong `claude.ts`.
- [x] **Step 5:** Nối tool-use loop vào `index.ts`, cap số round hợp lý, emit `tool_call`/`emergency`, và map upstream/server errors sang SSE error codes đã chốt trong spec.
- [ ] **Step 6:** Verify bằng 3 kịch bản tối thiểu: hỏi dữ liệu cá nhân, hỏi kiến thức chung, và prompt có tín hiệu cấp cứu.

**Expected outcome:** Backend trả lời được bằng stream, biết gọi tool khi cần dữ liệu cá nhân, và cư xử an toàn với emergency cases.
