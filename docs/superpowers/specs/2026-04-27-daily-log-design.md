# Daily Log Dashboard Design

- Date: 2026-04-27
- Project: Health Tracker
- Phase: Daily Log (phase 6)
- Primary app: `health-tracker-web`

## Goal

Bổ sung vào dashboard hiện có một **Daily Log strip** gồm 3 thẻ nhỏ (BBT · Tâm trạng · Cân nặng), cho phép người dùng ghi nhanh 3 chỉ số mỗi sáng. Mỗi thẻ hiển thị giá trị đã log hôm nay (nếu có) hoặc trạng thái "Chưa log". Tap mở Bottom Sheet để nhập. Không có chart hay lịch sử trong phase này.

## Scope

Included in this phase:

- Supabase CLI setup (`supabase init`, migration workflow)
- Migration `20260427000000_create_daily_logs.sql` tạo bảng `daily_logs` + RLS
- `libs/api` — hàm `getDailyLog` và `upsertDailyLog`
- React Query hook `useDailyLog` (query + mutation)
- `DailyLogStrip` — 3 thẻ nhỏ inline trên dashboard
- 3 Bottom Sheet riêng: BBT, Tâm trạng, Cân nặng
- Dashboard hiển thị giá trị đã log hôm nay trên mỗi thẻ

Explicitly excluded from this phase:

- Trend chart hoặc lịch sử log
- Hiển thị BBT/mood trên calendar page
- Export dữ liệu
- Reminder/notification nhắc log buổi sáng
- Các trường log khác (triệu chứng, giấc ngủ, nước uống)

## Recommended Approach

Supabase table `daily_logs` với unique constraint `(user_id, date)` và upsert pattern. Bottom Sheet (`Drawer anchor="bottom"`) cho nhập liệu — nhất quán với UX mobile; `Dialog` giữ nguyên chỉ cho xác nhận (như `LogPeriodDialog` hiện tại).

## Database Schema

```sql
create table daily_logs (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  date         date not null,
  bbt_celsius  numeric(4,2),
  mood         text check (mood in ('sad','neutral','happy','very_happy','tired')),
  weight_kg    numeric(5,2),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now(),
  unique (user_id, date)
);

alter table daily_logs enable row level security;

create policy "own rows only" on daily_logs
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

- `date` lưu theo giờ địa phương dạng `YYYY-MM-DD` (`DateTime.local().toISODate()`)
- Tất cả trường log đều nullable — người dùng có thể chỉ log 1 trong 3 trường
- `updated_at` được set thủ công trong `upsertDailyLog` (`updated_at: new Date().toISOString()`) — không dùng trigger

## Supabase CLI Setup

### Khởi tạo (một lần)

```bash
yarn add -D supabase
npx supabase init           # tạo supabase/config.toml + supabase/migrations/
npx supabase login
npx supabase link --project-ref <project-ref>
```

`SUPABASE_DB_PASSWORD` cần có trong `.env.local` để chạy `db push`.

### Apply migration

```bash
npx supabase db push
```

### Workflow sau này

```bash
npx supabase migration new <tên>   # tạo file migration mới
# viết SQL vào file được tạo
npx supabase db push               # apply lên remote
```

## Data Layer — `libs/api`

### File mới: `libs/api/src/lib/daily-log.ts`

```ts
export type MoodValue = 'sad' | 'neutral' | 'happy' | 'very_happy' | 'tired';

export type DailyLog = {
  id: string;
  userId: string;
  date: string;          // YYYY-MM-DD
  bbtCelsius: number | null;
  mood: MoodValue | null;
  weightKg: number | null;
};

export type DailyLogPatch = {
  date: string;
  bbtCelsius?: number | null;
  mood?: MoodValue | null;
  weightKg?: number | null;
};

export const getDailyLog = async (userId: string, date: string): Promise<DailyLog | null>
export const upsertDailyLog = async (userId: string, patch: DailyLogPatch): Promise<DailyLog>
```

`upsertDailyLog` dùng Supabase `.upsert()` với `onConflict: 'user_id,date'` và set `updated_at: new Date().toISOString()`.

Export qua `libs/api/src/index.ts`.

## React Query Hook — `use-daily-log.ts`

```ts
// apps/health-tracker-web/src/app/dashboard/use-daily-log.ts

export function useDailyLog(userId: string | undefined, date: string) {
  // useQuery(['daily-log', userId, date], ...)
  // useMutation(upsertDailyLog, { onSuccess: invalidate ['daily-log', userId, date] })
}
```

Query key: `['daily-log', userId, date]`. `staleTime: 60 * 60 * 1000` (1 giờ — đủ cho pattern log 1 lần/ngày, không refetch liên tục). Mutation on success invalidates query key → thẻ cập nhật ngay.

## UI — Daily Log Strip

### Vị trí trên Dashboard

```
CycleHero
DailyLogStrip     ← mới, sau CycleHero trước TipOfDay
TipOfDay
OutlookStrip
[CTA calendar]
[Disclaimer]
```

Chỉ hiển thị khi `isAuthResolved && user` — ẩn khi đang loading (3 `Skeleton` thay thế).

### Thẻ log

`Stack direction="row" spacing={1}` gồm 3 `AppCard` flex bằng nhau. Mỗi thẻ:

```
[Icon]
[Nhãn]       ← "BBT" / "Tâm trạng" / "Cân nặng"
[Giá trị]    ← "36.5°C" / "😊" / "52.5 kg"  hoặc  "Chưa log" (mờ)
```

Tap vào thẻ → mở Bottom Sheet tương ứng. Toàn bộ thẻ là vùng tap (`onClick`).

| Thẻ       | Icon MUI                  | Đơn vị | Chưa log   |
| --------- | ------------------------- | ------ | ---------- |
| BBT       | `DeviceThermostatRounded` | °C     | "Chưa log" |
| Tâm trạng | emoji của mood hiện tại   | —      | "Chưa log" |
| Cân nặng  | `MonitorWeightRounded`    | kg     | "Chưa log" |

## UI — Bottom Sheets

Dùng MUI `Drawer anchor="bottom"` với `PaperProps={{ sx: { borderRadius: '16px 16px 0 0', p: 3 } }}`. Handle bar decorative ở trên cùng.

### BBT Bottom Sheet (`bbt-bottom-sheet.tsx`)

- Label: "Nhiệt độ cơ thể buổi sáng"
- Hint: "Đo trước khi ra khỏi giường"
- `TextField type="number"` inputProps: `{ step: 0.05, min: 35, max: 42 }`
- Đơn vị `°C` hiển thị bên phải field
- Pre-fill giá trị hiện có nếu đã log hôm nay
- Validation: phải trong khoảng 35–42; nếu ngoài range hiện lỗi inline
- Nút: Huỷ (outlined) + Lưu (contained primary)

### Mood Bottom Sheet (`mood-bottom-sheet.tsx`)

- Label: "Tâm trạng hôm nay"
- 5 ô emoji theo hàng ngang, tap để chọn 1; ô được chọn có highlight border
- Tên mood hiển thị bên dưới row emoji
- Pre-select mood hiện có nếu đã log hôm nay
- Nút Lưu active khi đã chọn ít nhất 1

| Value        | Emoji | Nhãn        |
| ------------ | ----- | ----------- |
| `sad`        | 😔    | Buồn        |
| `neutral`    | 😐    | Bình thường |
| `happy`      | 😊    | Vui         |
| `very_happy` | 😄    | Rất vui     |
| `tired`      | 😴    | Mệt mỏi     |

### Weight Bottom Sheet (`weight-bottom-sheet.tsx`)

- Label: "Cân nặng hôm nay"
- `TextField type="number"` inputProps: `{ step: 0.1, min: 20, max: 300 }`
- Đơn vị `kg` hiển thị bên phải field
- Pre-fill giá trị hiện có nếu đã log hôm nay
- Validation: phải trong khoảng 20–300

### Error handling trong Bottom Sheet

- Lỗi mạng / Supabase: hiển thị inline error text bên dưới form (không dùng Dialog)
- Sheet không đóng khi có lỗi
- Nút Lưu disabled + spinner khi đang submit
- Nút Huỷ disabled khi đang submit

## UI States

| Tình huống                      | Strip render                                          |
| ------------------------------- | ----------------------------------------------------- |
| Auth loading                    | 3 Skeleton cards                                      |
| Auth done, chưa log hôm nay     | 3 thẻ hiện "Chưa log"                                 |
| Auth done, đã log một số trường | Thẻ đã log hiện giá trị, thẻ chưa log hiện "Chưa log" |
| Mutation in flight              | Bottom Sheet: nút disabled + spinner                  |
| Mutation success                | Sheet đóng, thẻ cập nhật giá trị mới                  |
| Mutation failure                | Sheet mở, inline error, form idle                     |

## Architecture & File Layout

```
supabase/
├── config.toml
└── migrations/
    └── 20260427000000_create_daily_logs.sql

libs/api/src/lib/
└── daily-log.ts                         (mới)

apps/health-tracker-web/src/app/dashboard/
├── daily-log-strip.tsx                  (mới)
├── bbt-bottom-sheet.tsx                 (mới)
├── mood-bottom-sheet.tsx                (mới)
├── weight-bottom-sheet.tsx              (mới)
├── use-daily-log.ts                     (mới)
└── dashboard-page.tsx                   (cập nhật: thêm DailyLogStrip)
```

Không đụng: `CycleHero`, `TipOfDay`, `OutlookStrip`, `LogPeriodDialog`, router, auth guards, `libs/ui`, `libs/forms`, `libs/state`, `libs/theme`.

## Validation Rules

- `bbt_celsius`: 35.00–42.00, step 0.05
- `weight_kg`: 20.0–300.0, step 0.1
- `mood`: một trong 5 giá trị enum; không thể lưu giá trị ngoài list
- `date`: luôn là `DateTime.local().toISODate()` — không cho phép nhập ngày tùy ý trong phase này

## Verification

Phase 6 hoàn thành khi:

- `supabase init` + migration chạy thành công, bảng `daily_logs` tồn tại trên remote với RLS đúng
- User đăng nhập, vào dashboard thấy 3 thẻ "Chưa log"
- Tap thẻ BBT → Bottom Sheet mở, nhập 36.5 → Lưu → thẻ hiện "36.5°C"
- Tap thẻ Tâm trạng → chọn 😊 → Lưu → thẻ hiện "😊"
- Tap thẻ Cân nặng → nhập 52.5 → Lưu → thẻ hiện "52.5 kg"
- Tap thẻ đã log → Bottom Sheet mở với giá trị pre-filled → có thể chỉnh lại
- Reload trang → giá trị vẫn còn (persisted qua Supabase)
- Nhập BBT ngoài range 35–42 → lỗi inline, không submit được
- `yarn format`, `yarn lint`, `yarn build` đều pass

## Risks and Controls

| Risk                                           | Control                                                                           |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| `date` timezone mismatch (server vs client)    | Luôn dùng `DateTime.local().toISODate()` phía client, không tính toán phía server |
| Upsert race condition nếu user mở 2 tab        | Supabase upsert là atomic; last-write-wins chấp nhận được                         |
| BBT input float precision (36.55 → 36.5500001) | `numeric(4,2)` trong Postgres tự làm tròn; hiển thị dùng `toFixed(2)`             |
| `supabase db push` push nhầm lên production    | Luôn `supabase link` đúng project-ref, kiểm tra trước khi push                    |
