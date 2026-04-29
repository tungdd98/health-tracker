# Chatbot tư vấn sức khoẻ — Design Spec

**Date:** 2026-04-29
**Status:** Approved (pending user review)
**Phase:** 10 (chatbot)

## 1. Mục tiêu

Thêm tab "Trò chuyện" cho phép Hoàng hậu (end-user) trò chuyện với một trợ lý AI có thể:

- **Tư vấn dữ liệu cá nhân** — đọc profile, medications, daily logs từ Supabase và trả lời các câu hỏi về tình trạng cụ thể của user (e.g. "tuần này tôi uống thuốc đều không", "huyết áp 5 ngày qua thế nào").
- **Tư vấn sức khoẻ tổng quát** — kiến thức y tế chung (dinh dưỡng, thuốc men, triệu chứng) với tone thân thiết bằng tiếng Việt.

Không nằm trong scope phase này: nhắc nhở chủ động (push notification, daily check-in), nhập liệu hội thoại (conversational logging), tích hợp wearable.

## 2. Kiến trúc tổng thể

```
Frontend (React/Vite SPA)              Backend                    External
┌──────────────────────────┐    ┌──────────────────────────┐    ┌────────────┐
│ Tab "Trò chuyện" (/chat) │───▶│ Supabase Edge Function   │───▶│ Anthropic  │
│ - ChatPage               │SSE │ "chat-send" (Deno)       │    │ Claude     │
│ - MessageList/Bubble     │    │                          │    │ Haiku 4.5  │
│ - Composer               │    │ 1. Verify JWT            │    └────────────┘
│ - SessionHistoryDrawer   │    │ 2. Rate-limit check      │
│ - EmergencyAlertCard     │    │ 3. Load history          │           ▲
└──────────────────────────┘    │ 4. Tool-call loop ◀──────┼───────────┘
                                │ 5. Stream tokens         │
                                │ 6. Persist messages      │
                                └──────────┬───────────────┘
                                           │ RLS-scoped queries
                                           ▼
                                ┌──────────────────────────┐
                                │ Postgres (Supabase)      │
                                │ chat_sessions, messages, │
                                │ usage + existing tables  │
                                └──────────────────────────┘
```

**Quyết định cốt lõi:**

- **LLM provider**: Anthropic Claude Haiku 4.5 (đã có $5 credit, rẻ ~$0.005/lượt, prompt caching native).
- **Backend**: Một Supabase Edge Function duy nhất `chat-send` xử lý mọi message — đặt cùng nơi với Postgres để latency tool-call thấp + auth context có sẵn.
- **RLS triệt để**: Edge Function khởi tạo Supabase client với JWT của user (KHÔNG dùng service_role) → mọi tool query đi qua RLS, không thể leak data user khác dù có bug logic.
- **Streaming**: SSE từ Edge Function → frontend hiện token dần như ChatGPT.
- **Prompt caching**: `cache_control: ephemeral` trên system prompt + tool definitions, giảm ~90% chi phí input token sau lần đầu.

## 3. Database schema

### Bảng mới (file `supabase/migrations/<timestamp>_chatbot.sql`)

```sql
create table chat_sessions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text,                     -- auto-summary từ message đầu, nullable
  created_at    timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  is_archived   boolean not null default false
);
create index on chat_sessions (user_id, last_message_at desc);

create table chat_messages (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references chat_sessions(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  role          text not null check (role in ('user','assistant','tool')),
  content       jsonb not null,           -- nguyên payload Anthropic
  token_input   int,
  token_output  int,
  created_at    timestamptz not null default now()
);
create index on chat_messages (session_id, created_at);

create table chat_usage (
  user_id       uuid not null references auth.users(id) on delete cascade,
  hour_bucket   timestamptz not null,
  message_count int not null default 0,
  primary key (user_id, hour_bucket)
);

alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;
alter table chat_usage enable row level security;

create policy "owner only" on chat_sessions for all using (auth.uid() = user_id);
create policy "owner only" on chat_messages for all using (auth.uid() = user_id);
create policy "owner only" on chat_usage    for all using (auth.uid() = user_id);
```

### Sửa bảng `profiles`

```sql
alter table profiles
  add column emergency_contact_name  text,
  add column emergency_contact_phone text,
  add column has_seen_chat_disclaimer boolean not null default false;
```

`has_seen_chat_disclaimer` để show welcome modal đúng 1 lần.

### Lý do design

- `content` là `jsonb` để lưu nguyên payload Anthropic (text + tool_use + tool_result trộn). Replay history chỉ cần map thẳng vào API.
- Lưu token in/out mỗi message → có thể truy chi phí từng phiên khi credit cạn nhanh bất thường.
- `chat_usage` tách riêng (không count `chat_messages`) → rate-limit check chỉ 1 query có index PK.

## 4. Edge Function `chat-send`

### Cấu trúc

```
supabase/functions/chat-send/
  index.ts          # entry point, request handler
  claude.ts         # Anthropic SDK wrapper, streaming
  tools.ts          # 5 tool definitions + dispatch
  session.ts        # load/persist session & messages
  rate-limit.ts     # check + increment chat_usage
  prompts.ts        # system prompt template
  types.ts
```

### Request/Response

```ts
// POST /functions/v1/chat-send
// Headers: Authorization: Bearer <supabase_jwt>
// Body:
{ session_id?: string,        // null → tạo phiên mới
  user_message: string }

// Response: text/event-stream (SSE)
// Events:
//   session    → { session_id }
//   delta      → { text: "..." }
//   tool_call  → { name, input }
//   emergency  → { reason }
//   done       → { message_id, usage: { input, output } }
//   error      → { code, message }
```

### Flow xử lý

1. **Auth & rate limit** — verify JWT → user_id. Query `chat_usage`: nếu `sum(message_count where hour_bucket >= now() - 1h) >= 30` hoặc `... >= 24h ≥ 200` → trả `error: rate_limited`, không charge token.

2. **Session bootstrap** — nếu `session_id` null thì insert `chat_sessions`, gửi event `session`. Load `chat_messages where session_id = ? order by created_at`.

3. **Truncation** — nếu count > 40, drop message cũ nhất giữ lại 30 message gần nhất. MVP đơn giản, không tóm tắt.

4. **System prompt** (cached qua `cache_control: ephemeral`):

   ```
   Bạn là trợ lý sức khoẻ thân thiết của <user.full_name>. Trả lời bằng tiếng
   Việt tự nhiên, ngắn gọn, ấm áp. Khi cần dữ liệu cá nhân, hãy gọi tool
   tương ứng thay vì đoán.

   QUY TẮC AN TOÀN (BẮT BUỘC):
   - Nếu phát hiện tín hiệu cấp cứu (đau ngực dữ dội, khó thở, mất ý thức,
     đột quỵ, chảy máu không cầm, ngộ độc, ý nghĩ tự gây hại...), DỪNG tư vấn
     thông thường. Trả về chính xác token "[[EMERGENCY]]" rồi nói ngắn gọn:
     "Hãy gọi 115 ngay" + nhắc liên hệ <emergency_contact_name nếu có>.
   - Khi nói về liều thuốc / đổi thuốc, luôn kèm câu "hãy hỏi bác sĩ trước
     khi thay đổi".
   - Không bịa thông tin y khoa. Không biết → nói không biết.
   ```

5. **Tool definitions** (cached cùng system prompt):
   - `get_profile()` — full profile bao gồm tuổi, bệnh nền, dị ứng, emergency_contact.
   - `get_medications({active_only?: boolean})` — danh sách thuốc và lịch.
   - `get_medication_adherence({days: number})` — % tuân thủ thuốc N ngày qua.
   - `get_daily_logs({from_date, to_date, metrics?: string[]})` — log huyết áp, đường huyết, cân nặng, mood theo khoảng.
   - `get_log_summary({days: number})` — tóm tắt thống kê (avg, min, max, trend).

   Mỗi tool = SQL query qua Supabase client với JWT user (RLS tự lọc theo `auth.uid()`).

6. **Tool-call loop**:

   ```
   while true:
     stream = anthropic.messages.stream({ model: 'claude-haiku-4-5-20251001', messages, tools, system })
     for chunk in stream:
       if text_delta: emit SSE 'delta'
       if tool_use complete: collect
       if text contains '[[EMERGENCY]]': emit SSE 'emergency', strip token from output
     if stop_reason == 'tool_use':
       run tools (parallel if multiple), append tool_result to messages
       continue
     break
   ```

   Cap **6 round tool_use** để tránh loop vô hạn.

7. **Persist & finalize** — insert user + assistant + tool messages, update `chat_sessions.last_message_at`, increment `chat_usage`. Nếu phiên mới: fire-and-forget call Haiku phụ tóm tiêu đề ≤ 40 ký tự → update `chat_sessions.title`. Emit `done` rồi close.

### Bí mật & cấu hình

- `ANTHROPIC_API_KEY` — Supabase Edge Function secret (`supabase secrets set`).
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` đã có sẵn trong runtime Edge Function.

### Error mapping

| Tình huống          | SSE event                 | UI hiển thị                                      |
| ------------------- | ------------------------- | ------------------------------------------------ |
| Rate limit          | `error: rate_limited`     | Toast "Đã đạt 30 tin/giờ, thử lại sau X phút"    |
| Anthropic 5xx       | `error: upstream`         | Banner "Bot đang nghỉ ngơi, thử lại sau" + retry |
| Anthropic 429       | `error: upstream_busy`    | "Bot đang quá tải, thử lại sau" + retry          |
| Tool query lỗi      | feed về Claude            | bot tự xin lỗi và chuyển hướng                   |
| Tool result quá to  | server-side truncate      | note `[truncated, showing latest 100 records]`   |
| Tool loop > 6 round | break                     | "Bot xin lỗi, chưa thể trả lời lúc này"          |
| JWT hết hạn         | HTTP 401                  | redirect login                                   |
| Anthropic 401       | `error: server_misconfig` | "Lỗi cấu hình, liên hệ admin"                    |

## 5. Frontend (UI tab "Trò chuyện")

### Cấu trúc

```
apps/health-tracker-web/src/app/chat/
  ChatPage.tsx              # route /chat, orchestrator
  components/
    MessageList.tsx
    MessageBubble.tsx       # phân biệt role user/assistant/tool/emergency
    ToolCallChip.tsx        # "🔍 Đang tra cứu medications..." inline
    EmergencyAlertCard.tsx  # full-width đỏ, nút "Gọi 115" / "Gọi <tên>"
    Composer.tsx            # textarea + send + loading
    SessionHistoryDrawer.tsx
    NewChatButton.tsx
    DisclaimerWelcome.tsx   # show 1 lần, lưu profile.has_seen_chat_disclaimer
  hooks/
    useChatStream.ts        # SSE consumer
    useChatSessions.ts      # React Query: list + create + archive
    useChatMessages.ts      # React Query: load history of active session
  api/
    chat-client.ts          # fetch wrapper cho /functions/v1/chat-send
  schemas/
    chat-schemas.ts         # Zod cho request/response shapes
```

Component tái dùng cao (`ChatBubble`, `ChatComposer`, `EmergencyCard`) đặt ở `libs/ui/src/lib/`.

### Bottom nav

Từ 3 tab → **4 tab**: `[Trang chủ] [Chu kỳ] [Trò chuyện] [Cài đặt]`. Icon: `ChatBubbleRoundedIcon` (giữ rule rounded variants). Vị trí cuối cùng chốt khi vẽ Pencil.

### State machine của ChatPage

```
idle ──user gửi──▶ pending (composer disabled)
pending ──SSE delta──▶ streaming (assistant bubble nối thêm text)
streaming ──SSE tool_call──▶ streaming (chip xuất hiện inline)
streaming ──SSE emergency──▶ emergency (card hiện + tiếp tục stream)
streaming ──SSE done──▶ idle
* ──SSE error──▶ error (banner + retry, message user vẫn còn)
```

### Persistence flow

- `useChatSessions().active` query: phiên active mới nhất chưa archive. Nếu null → empty state "Bắt đầu trò chuyện".
- Message đầu tiên + chưa có active session → request với `session_id: null` → Edge Function tạo session, frontend nhận event `session` → set `activeSessionId` → invalidate sessions list.
- Nút "+" tạo phiên mới: clear local state + `setActiveSessionId(null)`. KHÔNG pre-create row DB.
- Drawer history: tap phiên cũ → `setActiveSessionId(id)` → fetch history, hiển thị + cho gửi tiếp.

### Design system

- Tận dụng `libs/ui` hiện có: `AppShell`, `AppHeader`, `AppCard`.
- Toàn bộ tuân thủ design system contract phase 8/9 — không hard-code màu, dùng `theme.palette.*`.
- Streaming hiện cursor blink `▋` cuối câu khi đang stream, ẩn khi `done`.
- MUI icons: dùng `Rounded` variants.

### Pencil designs cần vẽ trước khi code

File: `docs/superpowers/designs/2026-04-29-chatbot.pen`. 7 frames:

1. **Empty state** — chưa có message nào trong phiên active.
2. **Active conversation** — list message + composer.
3. **Streaming state** — assistant đang gõ + tool_call chip.
4. **Emergency alert** — card đỏ với 2 nút lớn.
5. **History drawer** — danh sách phiên với title + thời gian + archive.
6. **Welcome disclaimer modal** — show lần đầu vào tab.
7. **Rate limited state** — banner + countdown.

Plan tasks UI MUST reference từng frame name cụ thể trước khi viết JSX (CLAUDE.md rule).

## 6. Error handling & edge cases

### Anthropic API lỗi giữa stream

- Stream đứt giữa chừng: bắt error trong loop, emit `error: upstream`, close SSE. User message **đã insert DB** nhưng assistant message **chưa insert** (chỉ insert khi `done`) → không có rác.
- Anthropic 429 overloaded: `error: upstream_busy`. Có nút "Thử lại" gửi lại payload.
- API key sai/hết hạn (401): `error: server_misconfig` — log Edge Function, UI hiện thông báo cấu hình.

### Tool call thất bại

- SQL query lỗi → catch trong dispatch, trả về Claude `tool_result: { error: "..." }` (không break loop).
- Tool result quá to (>10k token) → server-side truncate, kèm note truncated.
- Cap **6 round tool_use** trong 1 turn → vượt qua break loop.

### Context overflow

- Tổng token tiến gần 200k của Haiku → đếm bằng `tokenCount` API trước khi gọi, vượt 150k thì drop messages cũ nhất đến khi vừa. Deterministic, không tóm.

### Emergency detection edge cases

- Bot quên emit `[[EMERGENCY]]` → known risk, mitigation phase sau bằng regex backup quét keyword cấp cứu trên user input.
- False positive → user vẫn có thể đóng card và tiếp tục chat. Card không block input.
- Emergency contact có/không → 2 nút (115 + tên) hoặc 1 nút (115) + nudge.

### Race conditions

- User gửi message thứ 2 khi message 1 đang stream → composer disabled trong state `pending|streaming`, không gửi được.
- 2 tab cùng phiên → MVP chấp nhận overlap (hiếm), không lock optimistic.

### Migration & rollout

- Migration SQL apply qua `supabase db push` (local) và Supabase dashboard SQL editor (prod).
- Edge Function deploy: `supabase functions deploy chat-send`. Secret `ANTHROPIC_API_KEY` set trước.
- Không feature flag — ship thẳng vì là tab mới.

### Cost runaway protection

- Mỗi request log token in/out vào `chat_messages.token_input/output`.
- Phase này không auto-cutoff khi hết credit. Anthropic trả 401, Edge Function map thành `server_misconfig`. Hoàng Thượng nạp credit tiếp là chạy lại.
- Dashboard "Chi phí Claude tháng này" có thể bổ sung sau.

## 7. Testing & verification

### Verification gate

- `yarn format`
- `yarn lint`
- `yarn build`
- `deno check supabase/functions/chat-send/index.ts`

### Manual smoke test checklist

Chạy trên `supabase start` local + Anthropic API key thật. Mỗi mục phải pass trước merge:

- Auth gate: chưa login → redirect; login xong → vào được /chat.
- Welcome disclaimer: hiện lần đầu, dismiss xong không hiện lại sau reload.
- First message: "Chào bạn" → stream phản hồi tiếng Việt, phiên mới xuất hiện trong drawer.
- Tool call profile: "Tôi có dị ứng gì?" → bot gọi `get_profile`, trả lời chính xác.
- Tool call medications: "Tuần này tôi uống thuốc đều không?" → bot gọi `get_medication_adherence({days: 7})`.
- Tool call daily logs: "Huyết áp 5 ngày qua thế nào?" → bot gọi `get_daily_logs`, tóm tắt xu hướng.
- Tool call multi-round: "Cân nặng tháng qua so với BMI khuyến nghị?" → 2 tool + tổng hợp.
- Disclaimer mềm về thuốc: "Tôi tăng liều X được không?" → có câu nhắc "hãy hỏi bác sĩ".
- Emergency trigger: "Tôi đang đau ngực dữ dội và khó thở" → EmergencyAlertCard hiện.
- Emergency có người thân: set `emergency_contact_phone` → có thêm nút "Gọi <tên>".
- Emergency không người thân: clear field → chỉ "Gọi 115" + nudge.
- New chat: "+" → state reset, gửi message → tạo phiên mới.
- Open old session: tap phiên cũ → load history, gửi tiếp → nối phiên cũ.
- Truncation: seed 50 message → gửi mới, kiểm logs xác nhận drop, response vẫn liên quan.
- Rate limit per hour: gửi 31 message → request thứ 31 nhận `rate_limited`.
- Rate limit per day: update `chat_usage` giả 200 → bị chặn.
- Network drop mid-stream: throttle Offline → banner lỗi, retry hoạt động.
- Anthropic 5xx: set sai API key → bot trả lỗi cấu hình, không crash.
- RLS sanity: login user A, paste session_id user B → trả 404/403, không leak.
- Cost tracking: query `sum(token_input/output)` → khớp Anthropic usage.

### Automated test (mức tối thiểu)

Repo chưa có test runner. Phase này KHÔNG setup runner để giữ scope. Thay vào đó:

- `supabase/functions/chat-send/__tests__/tools.test.ts` chạy bằng `deno test --allow-net` — test pure functions trong `tools.ts` (parse input, format SQL params, truncate result).
- Frontend type-safe schemas `chat-schemas.ts` được kiểm qua `tsc` (đã nằm trong `yarn build`).
- Vitest + Playwright có thể bổ sung phase sau.

### Definition of Done

1. Migration SQL applied local + production.
2. Edge Function `chat-send` deployed, secret set.
3. Frontend tab Chat tích hợp, bottom nav có 4 mục.
4. Pencil file `2026-04-29-chatbot.pen` có đủ 7 frame.
5. Toàn bộ smoke test manual checklist pass trên local + 1 lượt trên production sau deploy.
6. `yarn format && yarn lint && yarn build` xanh.
7. Commit theo conventional commits, screenshot UI gửi kèm trong PR.

## 8. Open questions / future work

- **Regex backup cho emergency detection** — phase sau, nếu thấy bot bỏ sót.
- **Title summarizer phụ** — có thể lười thay bằng "Hội thoại 29/04 14:30" nếu Haiku call phụ tốn kém quá.
- **Memory/recommendations** (write back DB) — gạt khỏi MVP, có thể đưa vào Phase 11.
- **Proactive coaching** (push notification, daily check-in) — đã loại khỏi scope, để Phase tương lai.
- **Conversational data entry** — đã loại khỏi scope.
- **Cost dashboard** — có thể bổ sung sau khi có vài tuần data.
