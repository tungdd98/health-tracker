### Task 13: Implement CalendarPage

> **Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen`
> Frames to read: `calendar-with-data` (KjasN), `calendar-empty` (7rEiB), `calendar-loading` (dQken)
>
> Open the `.pen` file in Pencil and read all three frames before writing any JSX.

**Files:**

- Create: `apps/health-tracker-web/src/app/calendar/calendar-page.tsx`

- [ ] **Step 1: Open Pencil and read the 3 calendar frames**

Confirm: month nav strip (left chevron, centered label, right chevron), skeleton grid layout, empty-state card body and button, legend placement below grid.

- [ ] **Step 2: Create `calendar-page.tsx`**

```tsx
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { Box, Button, IconButton, Skeleton, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppCard, AppShell } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';
import { MonthGrid } from './month-grid';
import { PhaseLegend } from './phase-legend';

export function CalendarPage() {
  const navigate = useNavigate();
  const { isAuthResolved, onboardingProfile } = useAuthSession();
  const [displayMonth, setDisplayMonth] = useState(() => DateTime.local().startOf('month'));

  const handleNavChange = (value: string) => {
    if (value === 'home') {
      navigate('/');
      return;
    }
    if (value === 'settings') {
      navigate('/settings');
      return;
    }
    if (value === 'calendar') {
      navigate('/calendar');
    }
  };

  const monthLabel = `Thang ${displayMonth.month}, ${displayMonth.year}`;

  const lastPeriodStartDate = onboardingProfile.lastPeriodStartDate
    ? DateTime.fromISO(onboardingProfile.lastPeriodStartDate)
    : null;

  const hasData =
    Boolean(onboardingProfile.cycleLengthDays) && Boolean(lastPeriodStartDate?.isValid);

  const stripInput =
    onboardingProfile.cycleLengthDays && lastPeriodStartDate?.isValid
      ? { cycleLengthDays: onboardingProfile.cycleLengthDays, lastPeriodStartDate }
      : null;

  const isLoading = !isAuthResolved;

  return (
    <AppShell
      headerEyebrow="Lich chu ky"
      headerTitle={monthLabel}
      headerSubtitle="Theo doi chu ky theo thang"
      navValue="calendar"
      onNavChange={handleNavChange}
    >
      <Stack spacing={2}>
        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <IconButton
            aria-label="Previous month"
            onClick={() => setDisplayMonth((m) => m.minus({ months: 1 }))}
          >
            <ChevronLeftRoundedIcon />
          </IconButton>
          <Typography
            fontWeight={600}
            onClick={() => setDisplayMonth(DateTime.local().startOf('month'))}
            sx={{ cursor: 'pointer', userSelect: 'none' }}
          >
            {monthLabel}
          </Typography>
          <IconButton
            aria-label="Next month"
            onClick={() => setDisplayMonth((m) => m.plus({ months: 1 }))}
          >
            <ChevronRightRoundedIcon />
          </IconButton>
        </Stack>

        {isLoading ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.25 }}>
            {Array.from({ length: 42 }, (_, i) => (
              <Skeleton key={i} variant="rounded" sx={{ aspectRatio: '1', width: '100%' }} />
            ))}
          </Box>
        ) : (
          <MonthGrid displayMonth={displayMonth} input={stripInput} />
        )}

        {!isLoading && hasData ? <PhaseLegend /> : null}

        {!isLoading && !hasData ? (
          <AppCard sx={{ p: 3 }}>
            <Stack alignItems="flex-start" spacing={1.5}>
              <Typography color="text.secondary" variant="body2">
                Bo sung thong tin chu ky o Cai dat
              </Typography>
              <Button
                onClick={() => navigate('/settings')}
                size="small"
                startIcon={<SettingsRoundedIcon />}
                variant="outlined"
              >
                Mo cai dat
              </Button>
            </Stack>
          </AppCard>
        ) : null}

        <Typography align="center" color="text.secondary" variant="caption">
          Thong tin chi mang tinh uoc tinh dua tren du lieu ban cung cap. Khong thay the tu van y
          te.
        </Typography>
      </Stack>
    </AppShell>
  );
}
```

> Replace romanized strings with proper Vietnamese:
>
> - `headerEyebrow`: "Lịch chu kỳ"
> - `headerSubtitle`: "Theo dõi chu kỳ theo tháng"
> - `monthLabel`: "Tháng ${displayMonth.month}, ${displayMonth.year}"
> - Empty state body: "Bổ sung thông tin chu kỳ ở Cài đặt"
> - Empty state button: "Mở cài đặt"
> - Disclaimer: same as dashboard disclaimer

- [ ] **Step 3: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/health-tracker-web/src/app/calendar/calendar-page.tsx
git commit -m "feat: add CalendarPage with month nav, grid, legend, and empty state"
```

- [ ] **Step 5: Mark complete in index.md**

Check off Task 13 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
