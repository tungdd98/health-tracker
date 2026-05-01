# Task 03 — Create `DayDetailSheet` component

**Files:**

- Create: `apps/health-tracker-web/src/app/calendar/day-detail-sheet.tsx`

Pattern to follow: `apps/health-tracker-web/src/app/dashboard/daily-log-sheet-layout.tsx` — use MUI `Drawer` with `anchor="bottom"`, drag handle pill at top, `Stack` with `p: 3, pb: 5`.

---

- [ ] **Step 1: Define props and key constants**

```ts
import { type DateTime } from 'luxon';

import { type MoodValue } from '@health-tracker/api';

import {
  computeCycleSnapshot,
  getWeekdayShort,
  PHASE_LABELS,
  type CyclePhase,
  type CycleSnapshot,
} from '../dashboard/cycle-utils';
import { useDayDetail } from './use-day-detail';

type CycleInput = {
  cycleLengthDays: number;
  lastPeriodStartDate: DateTime;
};

type DayDetailSheetProps = {
  selectedDay: DateTime | null;
  input: CycleInput | null;
  userId: string | undefined;
  onClose: () => void;
};

const PHASE_DESCRIPTIONS: Record<CyclePhase, string> = {
  menstrual: 'Nghỉ ngơi và nạp năng lượng',
  follicular: 'Năng lượng tăng dần, thích hợp hoạt động',
  fertile: 'Đỉnh năng lượng và khả năng sinh sản',
  luteal: 'Cơ thể chuẩn bị cho chu kỳ mới',
};

const MOOD_LABELS: Record<MoodValue, string> = {
  sad: 'Buồn',
  neutral: 'Bình thường',
  happy: 'Vui',
  very_happy: 'Rất vui',
  tired: 'Mệt mỏi',
};
```

- [ ] **Step 2: Define helper functions**

```ts
const formatDayHeader = (date: DateTime, snapshot: CycleSnapshot | null): string => {
  const weekday = getWeekdayShort(date);
  const dayCycleText = snapshot ? ` · Ngày ${snapshot.dayOfCycle}` : '';
  return `${weekday}, ${date.day} tháng ${date.month}${dayCycleText}`;
};

const getFertileWindowText = (snapshot: CycleSnapshot): string => {
  if (snapshot.isFertileWindow) return 'Đang trong cửa sổ thụ thai';
  if (snapshot.daysUntilFertileStart !== null)
    return `Cửa sổ thụ thai bắt đầu · còn ${snapshot.daysUntilFertileStart} ngày`;
  return 'Không trong cửa sổ thụ thai';
};
```

- [ ] **Step 3: Derive display state inside the component**

```ts
export function DayDetailSheet({ selectedDay, input, userId, onClose }: DayDetailSheetProps) {
  const today = DateTime.local().startOf('day');
  const dateStr = selectedDay?.toISODate() ?? null;
  const isFuture = selectedDay ? selectedDay.startOf('day') > today : false;

  const snapshot =
    selectedDay && input
      ? computeCycleSnapshot({
          cycleLengthDays: input.cycleLengthDays,
          lastPeriodStartDate: input.lastPeriodStartDate,
          targetDate: selectedDay,
        })
      : null;

  // null when input is missing OR when day is before lastPeriodStartDate
  const hasNoCycleData = snapshot === null;

  const { log, isLoading } = useDayDetail(userId, isFuture ? null : dateStr);
  // Pass null for future days so the query is never enabled.
```

- [ ] **Step 4: Render the component**

The component renders a MUI `Drawer` (`anchor="bottom"`, `open={selectedDay !== null}`, `onClose={onClose}`).

Structure inside the drawer (follow `DailyLogSheetLayout` spacing: `Stack spacing={2.5} p={3} pb={5}`):

**Drag handle:** `Box` with `alignSelf: center`, `bgcolor: border.strong`, `borderRadius: radius.xs`, `height: 4`, `width: 36`.

**Header:** date string from `formatDayHeader(selectedDay, snapshot)` as `Typography variant="subtitle1"`. If `snapshot` is not null, show a phase color chip badge next to it — a small `Box` using `theme.palette.phase[snapshot.phase]` as background, containing `PHASE_LABELS[snapshot.phase]` as `Typography variant="caption"`.

**No-data state** (`hasNoCycleData === true`): render a single `Typography color="text.secondary"` with text `"Không có dữ liệu chu kỳ"`.

**Section 1 — Pha chu kỳ** (shown when `snapshot !== null`):
Three read-only info rows. Each row is a `Stack direction="row" justifyContent="space-between"`:

- Row 1: label `"Pha chu kỳ"` / value `PHASE_LABELS[snapshot.phase] + ' · ' + PHASE_DESCRIPTIONS[snapshot.phase]`
- Row 2: label `"Ngày trong chu kỳ"` / value `` `Ngày ${snapshot.dayOfCycle} / ${snapshot.dayOfCycle + snapshot.daysUntilNextPeriod - 1}` ``
- Row 3: label `"Cửa sổ thụ thai"` / value `getFertileWindowText(snapshot)`

**Section 2 — Nhật ký ngày** (hidden when `isFuture === true`):
Three read-only rows (same layout as Section 1):

- Row 1: label `"Tâm trạng"` / value `log?.mood ? MOOD_LABELS[log.mood] : 'Chưa ghi'`
- Row 2: label `"Nhiệt độ cơ thể"` / value `log?.bbtCelsius != null ? \`${log.bbtCelsius} °C\` : 'Chưa ghi'`
- Row 3: label `"Cân nặng"` / value `log?.weightKg != null ? \`${log.weightKg} kg\` : 'Chưa ghi'`

Show a `Skeleton` for Section 2 rows while `isLoading === true`.

Empty/null values use `color="text.secondary"`.

- [ ] **Step 5: Commit**

```bash
git add apps/health-tracker-web/src/app/calendar/day-detail-sheet.tsx \
        apps/health-tracker-web/src/app/calendar/use-day-detail.ts
git commit -m "feat(calendar): add DayDetailSheet bottom sheet component"
```
