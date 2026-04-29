# Chatbot Personalization (Preference-first) — Design Spec

**Date:** 2026-04-29
**Status:** Draft for review
**Phase:** 10 (chatbot follow-up)

## 1. Mục tiêu

Cá nhân hoá chatbot theo hướng nhẹ, kiểm soát được, và triển khai nhanh bằng cách thêm lớp cấu hình người dùng rõ ràng:

- Nhớ bền vững giữa các phiên cho **cách giao tiếp**.
- Nhớ bền vững cho **mục tiêu sức khoẻ hiện tại**.
- Chỉ phản hồi khi user nhắn trước; không chủ động mở lời.

Ngoài scope pha này:

- Bot tự rút memory từ lịch sử chat mà không có cấu hình tường minh.
- Chủ động nhắc theo lịch hoặc theo event dữ liệu.
- Màn cài đặt độc lập ngoài màn chat.

## 2. Quyết định UX chính

- Điểm vào `Tuỳ chỉnh trợ lý` là icon `TuneRounded` ở góc phải `AppHeader` của màn chat.
- Icon luôn hiển thị ở cả trạng thái chat rỗng, đang chat, và streaming.
- Khi bấm, mở `bottom sheet` (mobile-first), không điều hướng sang màn hình mới.

### Nguồn thiết kế UI

- File: `docs/superpowers/designs/2026-04-29-chatbot-personalization.pen`
- Frames:
  - `ChatHeaderSettingsEntry`
  - `AssistantPersonalizationSheetDefault`
  - `AssistantPersonalizationSheetGoalsFilled`
  - `AssistantPersonalizationSheetValidationError`

## 3. Cấu trúc Bottom Sheet

### 3.1 Section A — Cách trợ lý trả lời

- `Cách xưng hô mong muốn` (text ngắn)
- `Độ dài mặc định` (enum): `ngắn | vừa | chi tiết`
- `Giọng điệu` (enum): `thân thiện | trung tính | chuyên gia`

### 3.2 Section B — Mục tiêu hiện tại

- Danh sách mục tiêu active (1-3 mục tiêu)
- Cho phép thêm/sửa/xoá từng mục tiêu
- Mỗi mục tiêu là text ngắn, tối đa 120 ký tự

### 3.3 Hành động cuối sheet

- `Lưu thay đổi` (primary)
- `Khôi phục mặc định` (text button)

## 4. Mô hình dữ liệu

Dùng hướng Preference-first: lưu cấu hình trực tiếp vào `profiles` để giảm độ phức tạp.

- `profiles.assistant_preferences jsonb`
  - `addressing_style?: string`
  - `response_length?: 'short' | 'medium' | 'detailed'`
  - `tone?: 'friendly' | 'neutral' | 'expert'`
- `profiles.assistant_goals jsonb`
  - `goals: string[]` (tối đa 3 mục tiêu)

Lý do chọn:

- Không cần thêm bảng mới ở pha đầu.
- Dễ đọc/ghi cùng luồng profile hiện tại.
- Dễ mở rộng sang mô hình hybrid ở pha sau.

## 5. Data Flow Runtime

Khi user gửi tin nhắn:

1. `chat-send` xác thực JWT như luồng hiện tại.
2. Đọc `profiles` của user, lấy `assistant_preferences` + `assistant_goals`.
3. Build block ngữ cảnh cá nhân hoá và ghép vào system/context prompt.
4. Gọi model, stream SSE như hiện tại.

Nguyên tắc áp dụng:

- Personalization chỉ tác động từ **tin nhắn mới sau khi user bấm Lưu**.
- Nếu chưa có dữ liệu cá nhân hoá: fallback mặc định (`tone thân thiện`, `độ dài vừa`).
- Không đổi logic safety hiện tại của chatbot.

## 6. Validation và Safety

- Chặn lưu khi số mục tiêu > 3.
- Chặn lưu khi một mục tiêu > 120 ký tự.
- Trim khoảng trắng đầu/cuối trước khi lưu.
- Không cho mục tiêu rỗng.
- `Khôi phục mặc định` xoá cấu hình về trạng thái null/empty an toàn.

## 7. Thành phần cần cập nhật

### Frontend

- `apps/health-tracker-web/src/app/chat/chat-page.tsx`
  - Thêm action mở sheet từ header.
- `apps/health-tracker-web/src/app/chat/components/*`
  - Thêm component `assistant-personalization-sheet`.
  - Thêm form controls cho preferences + goals.
- (Nếu cần) shared form/ui primitives hiện có từ `libs/forms`, `libs/ui`.

### Backend

- `supabase/migrations/*`
  - Thêm 2 cột jsonb vào `profiles`.
- `supabase/functions/chat-send/*`
  - Nạp personalization từ profile và inject vào prompt context.

## 8. Tiêu chí hoàn thành

- User đổi tone/độ dài/cách xưng hô trong sheet, tin nhắn kế tiếp phản ánh đúng thay đổi.
- User thêm mục tiêu, phản hồi chatbot có tham chiếu mục tiêu khi phù hợp.
- User có thể khôi phục mặc định thành công.
- Không làm hỏng luồng chat hiện tại (SSE, session history, emergency handling).

## 9. Trade-off và hướng mở rộng

Trade-off của Preference-first:

- Ưu: nhanh, rõ, kiểm soát cao, dễ giải thích với user.
- Nhược: chưa “thông minh tự học” từ lịch sử chat.

Mở rộng pha sau:

- Bổ sung memory tự rút từ chat ở dạng suggestion để user duyệt trước khi ghi chính thức (hybrid).
