import { Alert, Button, Snackbar, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useState, type SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppShell } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';
import { useAppNavChange } from '../use-app-nav-change';
import { deriveCycleHeroMode } from './cycle-hero-modes';
import { CycleHero } from './cycle-hero';
import { DailyLogStrip } from './daily-log-strip';
import { MedicationStrip } from './medication-strip';
import { computeCycleSnapshot } from './cycle-utils';
import { LogPeriodDialog } from './log-period-dialog';
import { OutlookStrip } from './outlook-strip';
import { TipOfDay } from './tip-of-day';
import { CalendarMonthRounded } from '@mui/icons-material';

const VN_WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const VN_MONTHS = [
  'tháng 1',
  'tháng 2',
  'tháng 3',
  'tháng 4',
  'tháng 5',
  'tháng 6',
  'tháng 7',
  'tháng 8',
  'tháng 9',
  'tháng 10',
  'tháng 11',
  'tháng 12',
];

const DASHBOARD_DISCLAIMER =
  'Thông tin chỉ mang tính ước tính dựa trên dữ liệu bạn cung cấp. Không thay thế tư vấn y tế.';

const formatVietnameseDate = (date: DateTime): string => {
  const jsDate = date.toJSDate();
  return `${VN_WEEKDAYS[jsDate.getDay()]}, ${date.day} ${VN_MONTHS[date.month - 1]}`;
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { isAuthResolved, onboardingProfile, user } = useAuthSession();
  const [dialogMode, setDialogMode] = useState<'log' | 'edit' | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const handleNavChange = useAppNavChange();

  const today = DateTime.local();
  const greetingName =
    onboardingProfile.displayName?.trim() || user?.email?.split('@')[0]?.trim() || 'bạn';
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
  const hasCycleData = Boolean(snapshot);
  const showTipAndStrip = !isLoading && hasCycleData && mode !== 'stale';
  const stripInput =
    onboardingProfile.cycleLengthDays && lastPeriodStartDate?.isValid
      ? {
          cycleLengthDays: onboardingProfile.cycleLengthDays,
          lastPeriodStartDate,
        }
      : null;

  const handleSnackbarClose = (_event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  return (
    <AppShell
      headerEyebrow="Hôm nay"
      headerSubtitle={`Chúc một ngày bình an, ${greetingName}`}
      headerTitle={formatVietnameseDate(today)}
      navValue="home"
      onNavChange={handleNavChange}
    >
      <Stack spacing={2}>
        <CycleHero
          dailyLogSlot={
            user && snapshot ? <DailyLogStrip userId={user.id} date={today.toISODate()!} /> : null
          }
          isLoading={isLoading}
          mode={mode}
          onEditPeriod={() => setDialogMode('edit')}
          onLogPeriod={() => setDialogMode('log')}
          snapshot={snapshot}
        />

        {showTipAndStrip && snapshot ? <TipOfDay isLoading={false} phase={snapshot.phase} /> : null}

        {user && snapshot ? <MedicationStrip userId={user.id} date={today.toISODate()!} /> : null}

        {showTipAndStrip ? <OutlookStrip input={stripInput} isLoading={false} /> : null}

        <Button
          fullWidth
          onClick={() => navigate('/calendar')}
          startIcon={<CalendarMonthRounded />}
          variant="outlined"
        >
          Xem lịch chu kỳ
        </Button>

        <Typography align="center" color="text.secondary" variant="caption">
          {DASHBOARD_DISCLAIMER}
        </Typography>
      </Stack>

      {user ? (
        <LogPeriodDialog
          initialDate={
            dialogMode === 'edit'
              ? (onboardingProfile.lastPeriodStartDate ?? today.toISODate()!)
              : today.toISODate()!
          }
          mode={dialogMode === 'edit' ? 'edit' : 'log'}
          onClose={() => setDialogMode(null)}
          onSuccess={() => {
            setDialogMode(null);
            setSnackbarOpen(true);
          }}
          open={dialogMode !== null}
          user={user}
        />
      ) : null}

      <Snackbar
        anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        open={snackbarOpen}
      >
        <Alert color="success" onClose={handleSnackbarClose} variant="filled">
          Đã cập nhật kỳ kinh mới.
        </Alert>
      </Snackbar>
    </AppShell>
  );
}
