### Task 10: Compose DashboardPage

> **Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen`
> Frames to read: `dashboard-predict` (aoNGi), `dashboard-loading` (kfqEh), `dashboard-nudge` (cz7cg)
>
> Open the `.pen` file in Pencil and read all three frames before writing any JSX.

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx`

- [ ] **Step 1: Open Pencil and read the 3 dashboard frames**

Confirm vertical layout order: header (via AppShell) → hero → tip → strip → calendar CTA → disclaimer. Confirm that tip and strip are hidden in nudge mode. Confirm that the disclaimer renders in all modes.

- [ ] **Step 2: Create `dashboard-page.tsx`**

```tsx
import { Alert, Button, Snackbar, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppShell } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';
import { computeCycleSnapshot } from './cycle-utils';
import { deriveCycleHeroMode } from './cycle-hero-modes';
import { CycleHero } from './cycle-hero';
import { LogPeriodDialog } from './log-period-dialog';
import { OutlookStrip } from './outlook-strip';
import { TipOfDay } from './tip-of-day';

const VN_WEEKDAYS = ['Chu Nhat', 'Thu Hai', 'Thu Ba', 'Thu Tu', 'Thu Nam', 'Thu Sau', 'Thu Bay'];
const VN_MONTHS = [
  'thang 1',
  'thang 2',
  'thang 3',
  'thang 4',
  'thang 5',
  'thang 6',
  'thang 7',
  'thang 8',
  'thang 9',
  'thang 10',
  'thang 11',
  'thang 12',
];

const formatVietnameseDate = (date: DateTime): string => {
  const jsDate = date.toJSDate();
  return `${VN_WEEKDAYS[jsDate.getDay()]}, ${date.day} ${VN_MONTHS[date.month - 1]}`;
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthResolved, onboardingProfile, user } = useAuthSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const today = DateTime.local();
  const greetingName =
    onboardingProfile.displayName?.trim() || user?.email?.split('@')[0]?.trim() || 'ban';

  const lastPeriodStartDate = onboardingProfile.lastPeriodStartDate
    ? DateTime.fromISO(onboardingProfile.lastPeriodStartDate)
    : null;

  const snapshot =
    onboardingProfile.cycleLengthDays && lastPeriodStartDate?.isValid
      ? computeCycleSnapshot({
          cycleLengthDays: onboardingProfile.cycleLengthDays,
          lastPeriodStartDate,
          targetDate: today,
        })
      : null;

  const mode = deriveCycleHeroMode(snapshot);
  const isLoading = !isAuthResolved;
  const showTipAndStrip = !isLoading && mode !== 'nudge';

  const stripInput =
    onboardingProfile.cycleLengthDays && lastPeriodStartDate?.isValid
      ? { cycleLengthDays: onboardingProfile.cycleLengthDays, lastPeriodStartDate }
      : null;

  const handleNavChange = (value: string) => {
    if (value === 'calendar') {
      navigate('/calendar');
      return;
    }
    if (value === 'settings') {
      navigate('/settings');
      return;
    }
    if (value === 'home') {
      navigate('/');
    }
  };

  const handleSnackbarClose = (_event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  return (
    <AppShell
      headerEyebrow="Hom nay"
      headerTitle={formatVietnameseDate(today)}
      headerSubtitle={`Chuc mot ngay binh an, ${greetingName}`}
      navValue="home"
      onNavChange={handleNavChange}
    >
      <Stack spacing={2}>
        <CycleHero
          mode={mode}
          snapshot={snapshot}
          isLoading={isLoading}
          onLogPeriod={() => setIsDialogOpen(true)}
        />

        {showTipAndStrip && snapshot ? <TipOfDay phase={snapshot.phase} isLoading={false} /> : null}

        {showTipAndStrip ? <OutlookStrip input={stripInput} isLoading={false} /> : null}

        <Button
          onClick={() => navigate('/calendar')}
          sx={{ alignSelf: 'flex-start' }}
          variant="text"
        >
          Xem lich chu ky
        </Button>

        <Typography align="center" color="text.secondary" variant="caption">
          Thong tin chi mang tinh uoc tinh dua tren du lieu ban cung cap. Khong thay the tu van y
          te.
        </Typography>
      </Stack>

      {user && (
        <LogPeriodDialog
          open={isDialogOpen}
          user={user}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={() => {
            setIsDialogOpen(false);
            setSnackbarOpen(true);
          }}
        />
      )}

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        open={snackbarOpen}
      >
        <Alert color="success" onClose={handleSnackbarClose} variant="filled">
          Da cap nhat ky kinh moi.
        </Alert>
      </Snackbar>
    </AppShell>
  );
}
```

> Replace all romanized ASCII strings with proper Vietnamese strings with diacritics. Specific strings:
>
> - `headerEyebrow`: "Hôm nay"
> - `headerSubtitle` greeting: "Chúc một ngày bình an, {name}"
> - `VN_WEEKDAYS`: "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
> - `VN_MONTHS`: "tháng 1" .. "tháng 12"
> - CTA button: "Xem lịch chu kỳ →"
> - Disclaimer: "Thông tin chỉ mang tính ước tính dựa trên dữ liệu bạn cung cấp. Không thay thế tư vấn y tế."
> - Snackbar: "Đã cập nhật kỳ kinh mới."

- [ ] **Step 3: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx
git commit -m "feat: compose DashboardPage with hero, tip, strip, and disclaimer"
```

- [ ] **Step 5: Mark complete in index.md**

Check off Task 10 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
