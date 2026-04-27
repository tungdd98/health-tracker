### Task 12: Implement MonthGrid

> **Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen`
> Frames to read: `calendar-with-data` (KjasN), `calendar-empty` (7rEiB)
>
> Open the `.pen` file in Pencil and read both frames before writing any JSX.

**Files:**

- Create: `apps/health-tracker-web/src/app/calendar/month-grid.tsx`

- [ ] **Step 1: Open Pencil and read both calendar frames**

Confirm: 7-column grid, headers `CN T2 T3 T4 T5 T6 T7` (Sunday-first), day cells colored by phase, today has outline ring, out-of-month cells are dimmed (lower opacity), empty-state cells have no color.

- [ ] **Step 2: Create `month-grid.tsx`**

```tsx
import { Box, Typography } from '@mui/material';
import { DateTime } from 'luxon';

import { computeCycleSnapshot, PHASE_COLOR_TOKENS } from '../dashboard/cycle-utils';

const GRID_HEADERS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

type StripInput = {
  cycleLengthDays: number;
  lastPeriodStartDate: DateTime;
};

type MonthGridProps = {
  displayMonth: DateTime;
  input: StripInput | null;
};

export function MonthGrid({ displayMonth, input }: MonthGridProps) {
  const today = DateTime.local().startOf('day');
  const firstDayOfMonth = displayMonth.startOf('month');

  // Sunday-first grid. Luxon weekday: 1=Mon..7=Sun.
  // 7 % 7 = 0 (Sun needs 0 days subtracted), 1 % 7 = 1 (Mon subtracts 1), etc.
  const firstCellDate = firstDayOfMonth.minus({ days: firstDayOfMonth.weekday % 7 });

  const cells = Array.from({ length: 42 }, (_, i) => firstCellDate.plus({ days: i }));

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
        {GRID_HEADERS.map((h) => (
          <Typography
            key={h}
            align="center"
            color="text.secondary"
            fontWeight={600}
            variant="caption"
          >
            {h}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.25 }}>
        {cells.map((date) => {
          const isCurrentMonth = date.month === displayMonth.month;
          const isToday = date.startOf('day').valueOf() === today.valueOf();
          const snapshot = input
            ? computeCycleSnapshot({
                cycleLengthDays: input.cycleLengthDays,
                lastPeriodStartDate: input.lastPeriodStartDate,
                targetDate: date,
              })
            : null;
          const bgColor =
            snapshot && isCurrentMonth ? PHASE_COLOR_TOKENS[snapshot.phase] : 'transparent';

          return (
            <Box
              key={date.toISODate()}
              sx={{
                alignItems: 'center',
                aspectRatio: '1',
                bgcolor: bgColor,
                border: isToday ? '2px solid' : 'none',
                borderColor: 'primary.main',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'center',
                opacity: isCurrentMonth ? 1 : 0.35,
              }}
            >
              <Typography fontSize={11} fontWeight={isToday ? 700 : 400} variant="caption">
                {date.day}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
```

- [ ] **Step 3: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/health-tracker-web/src/app/calendar/month-grid.tsx
git commit -m "feat: add MonthGrid with 42-cell Sunday-first layout"
```

- [ ] **Step 5: Mark complete in index.md**

Check off Task 12 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
