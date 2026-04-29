# Avatar & Mood Sticker Design

- Date: 2026-04-29
- Project: Health Tracker
- Phase: Avatar & Mood Sticker (phase 12)
- Primary app: `health-tracker-web`

## Goal

Cá nhân hoá ứng dụng bằng cách cho phép user upload avatar, sau đó dùng Nano Banana (Google image generation qua OpenRouter) để sinh sẵn 5 sticker tâm trạng phong cách Zalo từ khuôn mặt user. Sticker được dùng thay thế emoji trong mood bottom sheet và dashboard card.

## Scope

Included:

- Avatar upload trong onboarding Basic Profile step (cùng với displayName, birthDate)
- Avatar upload + thay ảnh trong Settings (Thông tin cá nhân)
- Wow screen trong onboarding sau khi sinh sticker lần đầu
- Dialog xác nhận tạo lại sticker khi đổi avatar ở Settings
- Toggle bật/tắt sticker cá nhân trong Settings
- Mood bottom sheet dùng sticker ảnh thay emoji khi có
- Dashboard mood card hiển thị sticker ảnh khi có

Excluded:

- Crop/edit avatar
- Lịch sử sticker đã tạo
- Tạo ảnh AI cho BBT hay cân nặng
- Push notification khi sinh ảnh xong

## User Flows

### Flow 1 — Upload avatar lần đầu (Onboarding)

1. Basic Profile step hiển thị avatar picker tròn ở đầu, bên dưới là `display_name` và `birth_date`
2. User tap avatar → chọn ảnh từ gallery
3. Preview avatar tròn cập nhật ngay
4. User tap Continue
5. **Nếu có avatar**: loading overlay trên step _"Đang tạo sticker tâm trạng của bạn..."_ → gọi edge function
6. Wow screen: grid 5 sticker mood + label, nút _"Tiếp tục"_
7. Sang step tiếp theo bình thường
8. **Nếu không có avatar**: Continue thẳng sang step tiếp theo, không generate

### Flow 2 — Đổi avatar (Settings)

1. Thông tin cá nhân section: avatar tròn + nút _"Thay ảnh"_ ở đầu section
2. User chọn ảnh mới → lưu section
3. Dialog: _"Bạn muốn tạo lại sticker tâm trạng với avatar mới không?"_
4. [Tạo lại] → loading snackbar → upsert 5 sticker mới
5. [Bỏ qua] → giữ nguyên sticker cũ (nếu có)

### Flow 3 — Log mood hằng ngày

1. Tap Tâm trạng trên dashboard
2. **Có sticker**: bottom sheet hiện 5 ảnh sticker thay emoji, layout giữ nguyên (5 card ngang)
3. **Không có sticker**: giữ nguyên emoji mặc định
4. Chọn mood → tap Lưu → sheet đóng ngay (không chờ AI)
5. Dashboard mood card hiển thị sticker ảnh tương ứng mood đã chọn

### Flow 4 — Tắt sticker cá nhân

1. Settings → Thông tin cá nhân → toggle _"Dùng sticker cá nhân cho tâm trạng"_ (chỉ hiện khi đã có avatar)
2. Toggle off → app dùng emoji mặc định dù có sticker
3. Toggle on → app dùng sticker trở lại

## Data Model

### Migration: profiles table

```sql
alter table profiles
  add column avatar_url          text,
  add column use_avatar_mood      boolean not null default true;
```

### Migration: user_mood_images table (mới)

```sql
create table user_mood_images (
  user_id    uuid not null references auth.users(id) on delete cascade,
  mood       text not null check (mood in ('sad','neutral','happy','very_happy','tired')),
  image_url  text not null,
  created_at timestamptz default now(),
  primary key (user_id, mood)
);

alter table user_mood_images enable row level security;

create policy "own rows only" on user_mood_images
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

### Supabase Storage

- Bucket `avatars`: path `{user_id}/avatar` — ảnh avatar gốc (private, signed URL)
- Bucket `mood-images`: path `{user_id}/{mood}.png` — 5 sticker đã sinh (private, signed URL)

### daily_logs table

Không thay đổi. Khi render, app query `user_mood_images` theo `mood` của ngày đó.

## Architecture

### Edge Function: `generate-mood-images`

Input: `{ user_id: string, avatar_url: string }`

Steps:

1. Tạo signed URL cho avatar từ Supabase Storage
2. `Promise.all` — 5 call song song tới OpenRouter Nano Banana, mỗi call 1 mood
3. Mỗi call: gửi avatar image + prompt → nhận base64 image
4. Upload 5 file PNG lên `mood-images/{user_id}/{mood}.png`
5. Upsert 5 rows vào `user_mood_images`
6. Return `{ success: true }`

### Prompt template

```
Hãy tạo hình ảnh phong cách sticker zalo sử dụng khuôn mặt của avatar người dùng.
Nền sạch, đơn giản.
Biểu cảm: {MOOD}
```

Mood mapping:

- `sad` → `buồn`
- `neutral` → `bình thường`
- `happy` → `vui`
- `very_happy` → `rất vui`
- `tired` → `mệt mỏi`

### OpenRouter config

- Endpoint: `https://openrouter.ai/api/v1/chat/completions`
- Model: `google/nano-banana` (verify exact model ID trên OpenRouter khi implement)
- Modalities: `["image"]`
- Dùng chung `OPENROUTER_API_KEY` env var đã có cho chatbot
- Avatar gửi dưới dạng image content block trong `messages`

### React Query hook mới: `useUserMoodImages`

```ts
// Returns Record<MoodValue, string | undefined>
// Dùng trong mood bottom sheet + dashboard mood card
```

## UI Components

### Basic Profile step (onboarding)

- Avatar picker tròn (80px) ở đầu step, bên dưới là các field hiện tại
- Tap → `<input type="file" accept="image/*">` → upload lên `avatars/{user_id}/avatar`
- Cập nhật `profiles.avatar_url` ngay sau upload
- Continue → nếu `avatar_url` tồn tại → loading overlay → gọi edge function → wow screen

### Wow screen (onboarding, sau generate)

- Tiêu đề: _"Sticker của bạn đây!"_
- Grid 2 hàng (hàng 1: 3 sticker, hàng 2: 2 sticker căn giữa) hiển thị 5 sticker + label mood tiếng Việt
- Nút primary: _"Tiếp tục"_ → sang step kế tiếp

### Settings — Thông tin cá nhân section

- Avatar tròn (60px) + nút text _"Thay ảnh"_ ngay đầu section (trước các field hiện tại)
- Toggle _"Dùng sticker cá nhân cho tâm trạng"_ ở cuối section, chỉ render khi `avatar_url` có giá trị
- Khi lưu section có avatar mới → dialog xác nhận tạo lại sticker

### Mood Bottom Sheet

- Kiểm tra `userMoodImages`: nếu có đủ 5 ảnh và `use_avatar_mood = true` → render `<img>` trong card thay `<Emoji>`
- Layout 5 card ngang giữ nguyên, chỉ thay nội dung bên trong card

### Dashboard Mood Card (Daily Log Strip)

- Nếu mood đã log + có sticker + toggle on → hiển thị `<img>` sticker nhỏ thay emoji
- Các trường hợp còn lại: giữ nguyên như hiện tại

## Error Handling

- Edge function timeout (>30s): trả lỗi, client hiện toast _"Tạo sticker thất bại, bạn có thể thử lại trong Settings"_
- Upload avatar thất bại: giữ user ở Basic Profile step, hiện lỗi inline
- Một trong 5 mood generate lỗi: retry riêng mood đó, nếu vẫn lỗi → skip mood đó (hiện emoji fallback cho mood lỗi)
- `use_avatar_mood` default `true` nhưng nếu `user_mood_images` chưa đủ 5 → tự fallback emoji

## Architecture Boundaries

### App layer (`apps/health-tracker-web`)

- Avatar picker UI trong `basic-profile-step.tsx`
- Wow screen component trong `onboarding/`
- Avatar + toggle UI trong settings
- Mood bottom sheet conditional render
- Dashboard mood card conditional render

### Shared libraries

- `libs/api`: `uploadAvatar`, `getAvatarSignedUrl`, `getUserMoodImages`, `upsertUserMoodImages`
- Supabase Edge Function: `generate-mood-images` (trong `supabase/functions/`)

## Verification

Phase hoàn thành khi:

- User upload avatar trong onboarding → wow screen hiện 5 sticker đúng biểu cảm
- Skip avatar trong onboarding → không generate, onboarding tiếp tục bình thường
- Đổi avatar trong Settings → dialog hỏi tạo lại → tạo lại thành công
- Mood bottom sheet hiện sticker khi có, emoji khi không có
- Toggle off → app dùng emoji dù có sticker
- Dashboard mood card hiện sticker sau khi log mood
- `yarn lint` và `yarn build` pass
