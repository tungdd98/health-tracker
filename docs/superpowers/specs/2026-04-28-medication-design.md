# Medication Schedule Design

- Date: 2026-04-28
- Project: Health Tracker
- Phase: Medication (phase 7)
- Primary app: `health-tracker-web`

## Goal

Cho phép Hoàng Hậu quản lý danh mục thuốc đang uống và check ✓ "đã uống" cho từng liều mỗi ngày. Phase này tập trung vào **tracking / compliance log** — không có push notification, không có cycle-day-based schedule, không có history view. Một strip mới trên dashboard cho phép check liều ngay khi mở app; một sub-page riêng phục vụ CRUD danh mục thuốc.

## Scope

Included in this phase:

- Migration `20260428000000_create_medications.sql` tạo 3 bảng `medications`, `medication_doses`, `dose_logs` + RLS
- RPC `create_medication_with_doses`, `update_medication_with_doses` (atomic upsert thuốc + doses)
- `libs/api/src/lib/medication.ts` — CRUD medication + dose log API
- React Query hooks: `useMedications`, `useMedication`, `useTodayMedications`, các mutation tương ứng
- `MedicationStrip` — strip mới trên dashboard liệt kê liều hôm nay với checkbox toggle
- Sub-page `/medications` — list thuốc, toggle active, menu sửa/xoá
- Sub-page `/medications/new`, `/medications/:id/edit` — form RHF + Zod
- Hỗ trợ 2 schedule type: `daily` (uống mỗi ngày, không thời hạn) và `course` (start_date + N ngày)
- Đa liều/ngày, mỗi liều có time-of-day chính xác (HH:mm)
- Field thuốc: tên (bắt buộc), liều lượng (string optional), ghi chú (optional), active

Explicitly excluded from this phase:

- Push notification / web push reminder
- Cycle-day-based schedule (CD3–CD7, etc.)
- Day-of-week pattern (T2/T4/T6), every-N-days pattern
- History view / compliance chart
- Hiển thị dose log trên calendar page (chấm trên ngày)
- Export dữ liệu thuốc (CSV/JSON)
- Drug interaction warning, drug name autocomplete
- Multiple users / chia sẻ lịch thuốc
- Icon / màu phân biệt thuốc, phân loại (category) thuốc

## Recommended Approach

Schema 3 bảng chuẩn hoá (`medications` + `medication_doses` + `dose_logs`), giữ FK constraint giữa log và dose. UI có strip trên dashboard cho daily action + sub-page riêng cho CRUD — không thêm tab vào bottom nav. Eligibility "thuốc nào xuất hiện hôm nay" tính ở client (số lượng thuốc/user dự kiến < 50). Atomic insert/update thuốc + doses qua Supabase RPC để đảm bảo consistency.

## Architecture & Routing

Thêm 3 route private:

```
/medications              → MedicationListPage   (list + active toggle + menu)
/medications/new          → MedicationFormPage   (form thêm)
/medications/:id/edit     → MedicationFormPage   (form sửa)
```

Truy cập từ nút "Quản lý thuốc" trên `MedicationStrip` (dashboard). Bottom nav giữ nguyên 3 items (Trang chủ · Chu kỳ · Cài đặt).

### File layout

```
supabase/migrations/
└── 20260428000000_create_medications.sql

libs/api/src/lib/
└── medication.ts                            (mới)

apps/health-tracker-web/src/app/
├── medications/                             (mới)
│   ├── medication-list-page.tsx
│   ├── medication-form-page.tsx
│   ├── medication-form-schema.ts
│   ├── dose-time-list-field.tsx
│   ├── use-medications.ts
│   └── use-today-medications.ts
├── dashboard/
│   ├── medication-strip.tsx                 (mới)
│   └── dashboard-page.tsx                   (cập nhật: thêm MedicationStrip)
└── app/                                     (cập nhật router)
```

Không đụng: `CycleHero`, `TipOfDay`, `OutlookStrip`, `DailyLogStrip`, calendar page, auth guards, `libs/state`, `libs/theme`, bottom nav, `libs/ui`, `libs/forms`.

## Database Schema

```sql
-- 1. medications: định nghĩa loại thuốc + lịch
create table medications (
  id                    uuid primary key default gen_random_uuid(),
  user_id               uuid not null references auth.users(id) on delete cascade,
  name                  text not null check (length(trim(name)) > 0),
  dosage                text,
  notes                 text,
  schedule_type         text not null check (schedule_type in ('daily','course')),
  course_start_date     date,
  course_duration_days  integer check (course_duration_days > 0),
  active                boolean not null default true,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint course_fields_consistency check (
    (schedule_type = 'daily' and course_start_date is null and course_duration_days is null)
    or
    (schedule_type = 'course' and course_start_date is not null and course_duration_days is not null)
  )
);

create index medications_user_active_idx on medications (user_id, active);

-- 2. medication_doses: danh sách giờ uống của 1 thuốc
create table medication_doses (
  id              uuid primary key default gen_random_uuid(),
  medication_id   uuid not null references medications(id) on delete cascade,
  time_of_day     time not null,
  sort_order      integer not null default 0,
  created_at      timestamptz not null default now()
);

create index medication_doses_medication_idx on medication_doses (medication_id);

-- 3. dose_logs: ghi nhận liều đã uống
create table dose_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  dose_id     uuid not null references medication_doses(id) on delete cascade,
  date        date not null,
  taken_at    timestamptz not null default now(),
  created_at  timestamptz not null default now(),
  unique (dose_id, date)
);

create index dose_logs_user_date_idx on dose_logs (user_id, date);

-- RLS
alter table medications enable row level security;
alter table medication_doses enable row level security;
alter table dose_logs enable row level security;

create policy "own medications" on medications
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own dose_logs" on dose_logs
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own medication_doses" on medication_doses
  using (
    exists (select 1 from medications m
            where m.id = medication_doses.medication_id and m.user_id = auth.uid())
  )
  with check (
    exists (select 1 from medications m
            where m.id = medication_doses.medication_id and m.user_id = auth.uid())
  );
```

### Schema decisions

| Vấn đề                       | Quyết định                                    | Lý do                                               |
| ---------------------------- | --------------------------------------------- | --------------------------------------------------- |
| Lưu giờ uống                 | Postgres `TIME` (`08:00:00`)                  | Native, sort được, không parse string               |
| Course end date              | Lưu `start + duration_days`                   | "Uống N ngày" trực giác hơn "đến ngày X"            |
| Course bao gồm ngày bắt đầu? | Có. 7 ngày từ 01/05 = 01/05–07/05 (inclusive) | Trực giác "uống N ngày"                             |
| Khi course kết thúc          | `medications` row vẫn tồn tại, ẩn khỏi strip  | User có thể clone/extend thay vì mất hẳn            |
| Pause thuốc                  | `active = false`                              | Soft pause, giữ lịch sử                             |
| Xoá thuốc                    | Hard delete (CASCADE doses + logs)            | Đơn giản; user có thể `active=false` để giữ lịch sử |
| Unique constraint dose log   | `(dose_id, date)`                             | 1 liều = 1 log/ngày, idempotent                     |
| Uncheck đã uống              | DELETE row                                    | Đơn giản; sau cần audit thì migrate                 |
| `taken_at`                   | timestamp lúc check                           | Sau dùng cho "đã uống lúc 8:23" nếu cần             |

### Eligibility logic (client-side)

```
m.active = true
AND (
  m.schedule_type = 'daily'
  OR (
    m.schedule_type = 'course'
    AND today >= m.course_start_date
    AND today <  m.course_start_date + m.course_duration_days   -- exclusive end
  )
)
```

`today = DateTime.local().toISODate()`. Filter chạy ở client sau khi fetch `listMedications`.

### Atomic write — Supabase RPC

Vì Supabase JS client không có transaction, tạo và update thuốc kèm doses qua RPC plpgsql:

```sql
create or replace function create_medication_with_doses(payload jsonb)
returns medications
language plpgsql security definer
as $$
declare
  new_med medications;
  dose jsonb;
  idx int := 0;
begin
  insert into medications (user_id, name, dosage, notes, schedule_type,
                           course_start_date, course_duration_days, active)
  values (
    auth.uid(),
    payload->>'name',
    payload->>'dosage',
    payload->>'notes',
    payload->>'schedule_type',
    nullif(payload->>'course_start_date','')::date,
    nullif(payload->>'course_duration_days','')::int,
    coalesce((payload->>'active')::bool, true)
  )
  returning * into new_med;

  for dose in select * from jsonb_array_elements(payload->'doses') loop
    insert into medication_doses (medication_id, time_of_day, sort_order)
    values (new_med.id, (dose->>'time_of_day')::time, idx);
    idx := idx + 1;
  end loop;

  return new_med;
end;
$$;
```

`update_medication_with_doses(target_id uuid, payload jsonb)` tương tự: UPDATE row + DELETE doses cũ + INSERT doses mới.

### Trade-off: edit doses xoá log lịch sử

Khi update thuốc, doses cũ bị DELETE → CASCADE xoá `dose_logs` liên quan. Vì phase 7 không có history view, vấn đề này chưa visible. Phase 8 (history & analytics) sẽ refactor sang diff-based update — chỉ DELETE doses không còn, INSERT doses mới, UPDATE doses giữ giờ → log không bị mất.

## Data Layer — `libs/api/src/lib/medication.ts`

```ts
export type ScheduleType = 'daily' | 'course';

export type Dose = {
  id: string;
  timeOfDay: string; // 'HH:mm'
  sortOrder: number;
};

export type Medication = {
  id: string;
  userId: string;
  name: string;
  dosage: string | null;
  notes: string | null;
  scheduleType: ScheduleType;
  courseStartDate: string | null;
  courseDurationDays: number | null;
  active: boolean;
  doses: Dose[];
};

export type MedicationDraft = {
  name: string;
  dosage?: string | null;
  notes?: string | null;
  scheduleType: ScheduleType;
  courseStartDate?: string | null;
  courseDurationDays?: number | null;
  active: boolean;
  doses: Array<{ timeOfDay: string }>;
};

export type DoseLog = {
  id: string;
  doseId: string;
  date: string;
  takenAt: string;
};

export async function listMedications(userId: string): Promise<Medication[]>;
export async function getMedication(id: string): Promise<Medication | null>;
export async function createMedication(userId: string, draft: MedicationDraft): Promise<Medication>;
export async function updateMedication(id: string, draft: MedicationDraft): Promise<Medication>;
export async function deleteMedication(id: string): Promise<void>;

export async function listDoseLogs(userId: string, date: string): Promise<DoseLog[]>;
export async function logDose(userId: string, doseId: string, date: string): Promise<DoseLog>;
export async function unlogDose(userId: string, doseId: string, date: string): Promise<void>;
```

| Function           | Implementation                                                                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `listMedications`  | Supabase nested select `select=*,medication_doses(*)`; sort doses theo `(sort_order, time_of_day)` ở client |
| `createMedication` | RPC `create_medication_with_doses` với payload JSON                                                         |
| `updateMedication` | RPC `update_medication_with_doses`                                                                          |
| `deleteMedication` | DELETE row → CASCADE                                                                                        |
| `logDose`          | INSERT ON CONFLICT DO NOTHING (idempotent)                                                                  |
| `unlogDose`        | DELETE WHERE `dose_id = $1 AND date = $2`                                                                   |

Export qua `libs/api/src/index.ts`.

## React Query Hooks

```ts
// apps/health-tracker-web/src/app/medications/use-medications.ts
useMedications(userId); // ['medications', userId]
useMedication(id); // ['medication', id]
useCreateMedicationMutation();
useUpdateMedicationMutation();
useDeleteMedicationMutation();

// apps/health-tracker-web/src/app/medications/use-today-medications.ts
useTodayMedications(userId, date); // merge medications + dose_logs
useLogDoseMutation();
useUnlogDoseMutation();
```

`TodayDose` derived ở client:

```ts
type TodayDose = {
  medicationId: string;
  medicationName: string;
  dosage: string | null;
  notes: string | null;
  doseId: string;
  timeOfDay: string;
  taken: boolean;
  takenAt: string | null;
};
```

`useTodayMedications` chạy 2 query song song (`listMedications` + `listDoseLogs(today)`), merge ở client, filter eligibility, sort theo `timeOfDay`.

| Query key                     | Stale time                |
| ----------------------------- | ------------------------- |
| `['medications', userId]`     | 5 phút                    |
| `['medication', id]`          | 5 phút                    |
| `['dose-logs', userId, date]` | 1 giờ (giống `daily-log`) |

Mutation invalidates các key liên quan. Toggle log dùng optimistic update (instant feedback, revert nếu fail).

## UI — `MedicationStrip` (dashboard)

### Vị trí

```
CycleHero
DailyLogStrip
MedicationStrip      ← mới, sau DailyLogStrip
TipOfDay
OutlookStrip
[CTA calendar]
[Disclaimer]
```

### States

| Tình huống                               | Render                                                                                               |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Auth loading                             | 1 Skeleton card                                                                                      |
| Auth done, không có thuốc active hôm nay | 1 `AppCard` empty: icon `MedicationRounded` + "Chưa có thuốc nào hôm nay" + nút text "Quản lý thuốc" |
| Có thuốc                                 | Card: header + counter "N/M đã uống" + danh sách liều + footer nút "Quản lý thuốc"                   |

### Card layout (có thuốc)

- Header: tiêu đề "Thuốc hôm nay" + counter "3/5 đã uống" bên phải
- Danh sách liều sort theo `timeOfDay` ASC, mỗi hàng:
  - Checkbox icon (left)
  - Time `HH:mm` (mono)
  - Tên thuốc + `·` + dosage (nếu có)
  - Notes ở dòng phụ (nếu có), font nhỏ + secondary color
- Tap toàn bộ hàng → toggle log/unlog (optimistic)
- Đã uống: tên gạch ngang + opacity 60%
- Footer: nút "Quản lý thuốc →" link `/medications`

## UI — Sub-page `/medications`

### Header

`AppHeader` với back button, tiêu đề "Quản lý thuốc", action button "+ Thêm" góc phải → `/medications/new`.

### List

- Empty: illustration + "Chưa có thuốc nào" + nút "Thêm thuốc đầu tiên"
- Mỗi thuốc 1 `AppCard`:
  - Tên (heading)
  - `Switch` cho `active` (góc phải)
  - Menu `⋮`: Sửa · Xoá (xoá có Dialog confirm)
  - Sub-line: dosage (nếu có) + `·` + schedule label
  - Schedule label:
    - `daily` → "Hằng ngày"
    - `course` chưa bắt đầu → "Bắt đầu DD/MM/YYYY"
    - `course` đang chạy → "Còn N ngày"
    - `course` đã hết → chip "Đã kết thúc" + card faded
  - Doses: list giờ ngắn `08:00 · 14:00 · 20:00`
- Tap card body → `/medications/:id/edit`

## UI — Sub-page `/medications/new` và `/medications/:id/edit`

Shared component `MedicationFormPage` dùng React Hook Form + Zod, fields qua `libs/forms`:

| Field                 | Component                          | Note                                                            |
| --------------------- | ---------------------------------- | --------------------------------------------------------------- |
| Tên thuốc             | `FormTextField`                    | required, max 100                                               |
| Liều lượng            | `FormTextField`                    | optional, max 50, vd "1 viên"                                   |
| Ghi chú               | `FormTextField multiline`          | optional, max 500                                               |
| Loại lịch             | `FormSelectField` hoặc radio group | `daily` / `course`                                              |
| Ngày bắt đầu (course) | `FormDateField`                    | conditional render khi `scheduleType=course`                    |
| Số ngày (course)      | `FormTextField type=number`        | min 1, max 365                                                  |
| Lịch uống             | `dose-time-list-field.tsx`         | `useFieldArray`, mỗi item TimePicker; +/× button; min 1, max 12 |
| Trạng thái            | `FormSwitchField`                  | `active`                                                        |

- Course end date hiển thị live (read-only label) = `start + duration - 1` ngày
- Submit: nút Lưu (contained primary), Huỷ (outlined) — back về `/medications` khi success
- Error mạng: inline error text dưới nút Lưu, form không reset

### Pencil design step

Theo project rule (CLAUDE.md → "UI implementation rule"), trước khi viết JSX của bất kỳ component nào, plan task UI **phải** mở `.pen` artifact. Implementation plan sẽ tạo `docs/superpowers/designs/2026-04-28-medications.pen` với các frame:

- `Dashboard / MedicationStrip / Empty`
- `Dashboard / MedicationStrip / WithDoses`
- `Medications / List / Empty`
- `Medications / List / WithItems`
- `Medications / Form / Daily`
- `Medications / Form / Course`
- `Medications / DeleteConfirm`

## Validation Rules

```ts
const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const medicationSchema = z
  .object({
    name: z.string().trim().min(1, 'Tên thuốc bắt buộc').max(100),
    dosage: z.string().trim().max(50).nullish(),
    notes: z.string().trim().max(500).nullish(),
    scheduleType: z.enum(['daily', 'course']),
    courseStartDate: z.string().nullish(),
    courseDurationDays: z.number().int().min(1).max(365).nullish(),
    active: z.boolean(),
    doses: z
      .array(
        z.object({
          timeOfDay: z.string().regex(timePattern, 'Giờ không hợp lệ'),
        }),
      )
      .min(1, 'Cần ít nhất 1 liều')
      .max(12, 'Tối đa 12 liều/ngày'),
  })
  .superRefine((data, ctx) => {
    if (data.scheduleType === 'course') {
      if (!data.courseStartDate)
        ctx.addIssue({ path: ['courseStartDate'], code: 'custom', message: 'Bắt buộc' });
      if (!data.courseDurationDays)
        ctx.addIssue({ path: ['courseDurationDays'], code: 'custom', message: 'Bắt buộc' });
    }
  });
```

## Edge Cases

| Tình huống                       | Hành vi                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| Course start date trong quá khứ  | Cho phép (user nhập sau khi đã bắt đầu uống)                            |
| Course duration = 1              | OK — 1 ngày duy nhất                                                    |
| Course đã kết thúc, user mở edit | Form hiện bình thường; có thể đổi sang `daily` hoặc gia hạn             |
| Course chưa bắt đầu              | Không xuất hiện trong strip; vẫn thấy trong list (chip "Bắt đầu DD/MM") |
| Active=false                     | Không xuất hiện trong strip; thấy trong list (faded)                    |
| Tap log dose offline             | Optimistic update → retry; fail vĩnh viễn → revert + toast              |
| 2 liều trùng giờ                 | Cho phép; sort_order phân biệt; hiển thị 2 hàng riêng                   |
| Đổi giờ liều                     | CASCADE xoá log cũ (đã document; phase 8 fix)                           |
| Xoá thuốc đang có log            | Confirm Dialog cảnh báo; CASCADE                                        |
| User đổi timezone                | `date` luôn dùng `DateTime.local().toISODate()`                         |

## Error Handling

| Loại lỗi                        | Xử lý                                                                   |
| ------------------------------- | ----------------------------------------------------------------------- |
| Mạng / Supabase fail trong form | Inline error dưới nút Lưu; nút Lưu disabled + spinner; form không reset |
| Mạng fail khi toggle log        | Optimistic revert + toast "Không thể lưu, thử lại"                      |
| Validation fail                 | Inline lỗi cạnh field theo react-hook-form                              |
| RLS reject                      | Toast generic "Thao tác không được phép" + log console                  |
| Empty data                      | Empty state UI                                                          |

## Loading States

| Tình huống                | UI                                           |
| ------------------------- | -------------------------------------------- |
| Strip dashboard đang load | 1 Skeleton card                              |
| List sub-page đang load   | 3 Skeleton cards                             |
| Form (edit) đang load     | Skeleton form                                |
| Submit form               | Nút Lưu disabled + spinner; nút Huỷ disabled |
| Toggle log                | Optimistic instant; spinner ẩn               |

## Verification

Phase 7 hoàn thành khi:

- Migration `20260428000000_create_medications.sql` chạy thành công, RLS đúng
- RPC `create_medication_with_doses` và `update_medication_with_doses` hoạt động atomic
- User truy cập `/medications` thấy empty state khi chưa có thuốc
- Tạo thuốc daily 3 liều (08:00, 14:00, 20:00) → list + dashboard strip cập nhật ngay
- Tạo course (start=hôm nay, duration=5) → strip; ngày thứ 6 không còn xuất hiện
- Tạo course start trong tương lai → không xuất hiện trên strip cho tới ngày start
- Toggle active=false → biến mất khỏi strip; vẫn còn trong list (faded)
- Tap dose trên strip → check ✓ → counter cập nhật; reload → vẫn check
- Tap lại dose đã check → uncheck → counter giảm
- Edit thuốc → đổi tên, đổi giờ → list cập nhật
- Xoá thuốc → confirm dialog → mất khỏi list
- Validate: tên trống → lỗi inline; course thiếu start/duration → lỗi inline; doses < 1 → lỗi inline
- BBT/mood/cân nặng (phase 6) vẫn hoạt động (regression check)
- `yarn format`, `yarn lint`, `yarn build` đều pass

## Risks and Controls

| Risk                                             | Control                                                                              |
| ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| RPC SQL bug làm insert thuốc thất bại giữa chừng | RPC chạy trong implicit tx của plpgsql; fail mid-loop sẽ rollback                    |
| User đổi giờ liều xoá mất log lịch sử            | Document trong code; phase 8 refactor sang diff-based update                         |
| Số thuốc lớn → strip dashboard quá dài           | Max 12 liều/ngày/thuốc; phase này không paginate                                     |
| `TIME` Postgres không có TZ                      | Chủ ý — giờ uống là "8 giờ sáng theo TZ user", không cần TZ-aware                    |
| Optimistic update conflict (2 tab)               | React Query refetch on focus đã tắt theo cấu hình dự án; user có thể reload thủ công |
| `supabase db push` push nhầm production          | Luôn `supabase link` đúng project-ref, kiểm tra trước khi push                       |
