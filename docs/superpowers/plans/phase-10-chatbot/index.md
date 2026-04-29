# Phase 10 — Chatbot

**Goal:** Thêm tab `Trò chuyện` cho phép người dùng hỏi đáp sức khoẻ bằng tiếng Việt, kết hợp dữ liệu cá nhân trong app với trả lời tổng quát từ Claude Haiku 4.5 qua Supabase Edge Function streaming.

**Architecture:** Phase này chia làm 3 lớp rõ ràng: schema Supabase cho session/message/usage, Edge Function `chat-send` xử lý auth + tool loop + SSE, và web app `/chat` để render session, stream, disclaimer, emergency/rate-limit states. Với phần UI, `docs/superpowers/designs/2026-04-29-chatbot.pen` là nguồn layout duy nhất; task implementation chỉ tham chiếu frame tương ứng thay vì mô tả visual bằng prose.

**Tech Stack:** Nx, React 19, TypeScript, React Router, MUI v7, TanStack React Query, Supabase Postgres, Supabase Edge Functions (Deno), Anthropic SDK, SSE, Zod.

**Spec:** `docs/superpowers/specs/2026-04-29-chatbot-design.md`

**Design file:** `docs/superpowers/designs/2026-04-29-chatbot.pen`

---

## Task Checklist

- [x] [Task 01 — Pencil design handoff and frame inventory](task-01-pencil-design-handoff.md)
- [ ] [Task 02 — Supabase chat schema and policies](task-02-supabase-chat-schema.md)
- [ ] [Task 03 — Edge Function transport, auth, and persistence foundation](task-03-edge-function-foundation.md)
- [ ] [Task 04 — Claude prompt, tools, and safety loop](task-04-claude-tools-and-safety.md)
- [ ] [Task 05 — Web chat data layer and streaming hooks](task-05-web-chat-data-layer.md)
- [x] [Task 06 — Chat route, shell wiring, and primary screens](task-06-chat-route-and-screens.md)
- [x] [Task 07 — Streaming, emergency, history, and rate-limit states](task-07-chat-runtime-states.md)
- [ ] [Task 08 — Verification, tracking sync, and commit](task-08-verification-tracking-and-commit.md)

---

## File Map

| File                                                                                         | Action                                                                   |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `docs/superpowers/specs/2026-04-29-chatbot-design.md`                                        | Reference                                                                |
| `docs/superpowers/designs/2026-04-29-chatbot.pen`                                            | Reference                                                                |
| `supabase/migrations/<timestamp>_chatbot.sql`                                                | Create                                                                   |
| `supabase/functions/chat-send/index.ts`                                                      | Create                                                                   |
| `supabase/functions/chat-send/claude.ts`                                                     | Create                                                                   |
| `supabase/functions/chat-send/tools.ts`                                                      | Create                                                                   |
| `supabase/functions/chat-send/session.ts`                                                    | Create                                                                   |
| `supabase/functions/chat-send/rate-limit.ts`                                                 | Create                                                                   |
| `supabase/functions/chat-send/prompts.ts`                                                    | Create                                                                   |
| `supabase/functions/chat-send/types.ts`                                                      | Create                                                                   |
| `libs/api/src/lib/chat.ts`                                                                   | Create                                                                   |
| `libs/api/src/index.ts`                                                                      | Modify                                                                   |
| `apps/health-tracker-web/src/app/router.tsx`                                                 | Modify                                                                   |
| `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx` or signed-in shell owner      | Modify                                                                   |
| `apps/health-tracker-web/src/app/chat/*`                                                     | Create                                                                   |
| `libs/ui/src/lib/*`                                                                          | Modify only if a real shared primitive emerges                           |
| `apps/health-tracker-web/src/app/pages/settings-page.tsx` and/or onboarding metadata helpers | Modify if emergency-contact/disclaimer persistence needs app-side wiring |

---

## Spec Coverage Summary

- Chat data model, RLS, and usage buckets: Task 02
- SSE request flow and session persistence: Tasks 03 and 05
- Claude system prompt, personal-data tools, and emergency behavior: Task 04
- `/chat` route, bottom-nav entry, and empty/default screen: Task 06
- Active chat, streaming, emergency card, disclaimer modal, history drawer, and rate-limit banner: Tasks 06 and 07
- Title generation, session switching, and archive/list flows: Tasks 03, 05, and 07
- Verification, tracking hygiene, and commit handoff: Task 08

---

## Notes For Implementers

- Bắt buộc mở frame Pencil liên quan trước khi viết JSX.
- Không mô tả spacing/hierarchy trong task UI nếu frame đã thể hiện; chỉ ghi state/behavior/data flow.
- Nếu trong lúc implement phát hiện spec lệch với schema/repo hiện tại, cập nhật plan task đang làm trước rồi mới sửa code.
- Chỉ đẩy primitive sang `libs/ui` khi pattern được dùng lặp lại ngoài `/chat`.
