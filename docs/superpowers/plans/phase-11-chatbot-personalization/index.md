# Phase 11 — Chatbot Personalization

**Goal:** Thêm cá nhân hoá chatbot theo hướng Preference-first: người dùng chỉnh cách trả lời + mục tiêu hiện tại ngay trong màn chat, và backend áp dụng cấu hình đó cho các tin nhắn mới.

**Architecture:** Phase này tách thành 4 lớp: Pencil handoff cho UI source-of-truth, migration mở rộng `profiles` bằng 2 cột JSONB, web app thêm icon `TuneRounded` + bottom sheet để quản lý preferences/goals, và edge function `chat-send` nạp personalization vào prompt context trước khi gọi model.

**Tech Stack:** Nx, React 19, TypeScript, MUI v7, React Hook Form, Zod, Supabase Postgres, Supabase Edge Functions (Deno), Anthropic SDK.

**Spec:** `docs/superpowers/specs/2026-04-29-chatbot-personalization-design.md`

---

## Task Checklist

- [x] [Task 01 — Pencil design for assistant personalization sheet](task-01-pencil-personalization-design.md)
- [x] [Task 02 — Supabase profile personalization schema](task-02-profile-personalization-schema.md)
- [x] [Task 03 — Chat personalization UI and form behavior](task-03-chat-personalization-sheet-ui.md)
- [x] [Task 04 — Edge function personalization prompt injection](task-04-chat-send-personalization-context.md)
- [x] [Task 05 — Verification, tracking sync, and commit](task-05-verification-tracking-and-commit.md)

---

## Spec Coverage Summary

- Icon settings + bottom sheet interaction: Tasks 01 and 03
- Structured preferences/goals persistence model: Task 02
- Runtime prompt personalization for new messages: Task 04
- Validation limits and fallback defaults: Tasks 03 and 04
- Verification + plan tracking hygiene: Task 05

## Notes For Implementers

- Các task UI trong phase này bắt buộc review frame bằng Pencil MCP; không dùng đọc JSON/text `.pen` để thay thế.
