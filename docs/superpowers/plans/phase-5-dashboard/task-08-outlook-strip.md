### Task 08: Implement 7-day OutlookStrip

> **Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen` — frame `dashboard-predict` (aoNGi)
>
> Open the `.pen` file in Pencil and read frame `dashboard-predict` before writing any JSX. Focus on the strip cell layout: weekday abbreviation on top, day number in middle, colored dot at bottom. Today's cell has tinted background and ring border.

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/outlook-strip.tsx`

- [x] **Step 1: Open Pencil and read `dashboard-predict` frame**

Confirm cell dimensions, today highlight style, dot size, and spacing between cells.

- [x] **Step 2: Create `outlook-strip.tsx`**

```tsx
import { Box, Skeleton, Stack } from '@mui/material';
import { DateTime } from 'luxon';

import { computeCycleSnapshot, getWeekdayShort, PHASE_COLOR_TOKENS } from './cycle-utils';

type StripInput = {
  cycleLengthDays: number;
  lastPeriodStartDate: DateTime;
};

type OutlookStripProps = {
  input: StripInput | null;
  isLoading: boolean;
};

export function OutlookStrip({ input, isLoading }: OutlookStripProps) {
  if (isLoading) {
    return (
      <Stack direction="row" spacing={0.5}>
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} variant="rounded" width={40} height={64} sx={{ flexGrow: 1 }} />
        ))}
      </Stack>
    );
  }

  const today = DateTime.local().startOf('day');
  const days = Array.from({ length: 7 }, (_, i) => today.plus({ days: i }));

  return (
    <Stack direction="row" spacing={0.5}>
      {days.map((date, i) => {
        const isToday = i === 0;
        const snapshot = input
          ? computeCycleSnapshot({
              cycleLengthDays: input.cycleLengthDays,
              lastPeriodStartDate: input.lastPeriodStartDate,
              targetDate: date,
            })
          : null;
        const dotColor = snapshot ? PHASE_COLOR_TOKENS[snapshot.phase] : '#E0E0E0';

        return (
          <Box
            key={date.toISODate()}
            sx={{
              alignItems: 'center',
              bgcolor: isToday ? 'rgba(255,138,101,0.10)' : 'transparent',
              border: '1.5px solid',
              borderColor: isToday ? 'rgba(255,138,101,0.40)' : 'transparent',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              gap: 0.5,
              py: 1,
            }}
          >
            <Box sx={{ fontSize: 10, color: 'text.secondary', lineHeight: 1 }}>
              {getWeekdayShort(date)}
            </Box>
            <Box
              sx={{
                fontSize: 13,
                fontWeight: isToday ? 700 : 400,
                lineHeight: 1,
              }}
            >
              {date.day}
            </Box>
            <Box
              sx={{
                bgcolor: dotColor,
                borderRadius: '50%',
                height: 8,
                width: 8,
              }}
            />
          </Box>
        );
      })}
    </Stack>
  );
}
```

- [x] **Step 3: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [x] **Step 4: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/outlook-strip.tsx
git commit -m "feat: add 7-day OutlookStrip component"
```

- [x] **Step 5: Mark complete in index.md**

Check off Task 08 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
