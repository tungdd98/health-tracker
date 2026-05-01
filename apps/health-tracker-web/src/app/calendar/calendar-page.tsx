import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppCard, AppShell } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';
import { useAppNavChange } from '../use-app-nav-change';
import { DayDetailSheet } from './day-detail-sheet';
import { MonthGrid } from './month-grid';
import { PhaseLegend } from './phase-legend';
import { ChevronLeftRounded, ChevronRightRounded, SettingsRounded } from '@mui/icons-material';

const DASHBOARD_DISCLAIMER =
  'Thông tin chỉ mang tính ước tính dựa trên dữ liệu bạn cung cấp. Không thay thế tư vấn y tế.';

const formatMonthLabel = (date: DateTime) => `Tháng ${date.month}, ${date.year}`;

export function CalendarPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthResolved, onboardingProfile, user } = useAuthSession();
  const [displayMonth, setDisplayMonth] = useState(() => DateTime.local().startOf('month'));
  const [selectedDay, setSelectedDay] = useState<DateTime | null>(null);
  const handleNavChange = useAppNavChange();

  const lastPeriodStartDate = onboardingProfile.lastPeriodStartDate
    ? DateTime.fromISO(onboardingProfile.lastPeriodStartDate)
    : null;
  const input =
    onboardingProfile.cycleLengthDays && lastPeriodStartDate?.isValid
      ? {
          cycleLengthDays: onboardingProfile.cycleLengthDays,
          lastPeriodStartDate,
        }
      : null;
  const isLoading = !isAuthResolved;
  const hasData = Boolean(input);
  const monthLabel = formatMonthLabel(displayMonth);

  return (
    <AppShell
      headerEyebrow="Lịch chu kỳ"
      headerSubtitle="Theo dõi chu kỳ theo tháng"
      headerTitle={monthLabel}
      navValue="calendar"
      onNavChange={handleNavChange}
    >
      <Stack spacing={2}>
        <Stack alignItems="center" direction="row" justifyContent="space-between" px={1}>
          <IconButton
            aria-label="Tháng trước"
            onClick={() => setDisplayMonth((current) => current.minus({ months: 1 }))}
            sx={{
              bgcolor: theme.palette.surface.raised,
              border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
            }}
          >
            <ChevronLeftRounded />
          </IconButton>

          <Typography variant="subtitle1">{monthLabel}</Typography>

          <IconButton
            aria-label="Tháng sau"
            onClick={() => setDisplayMonth((current) => current.plus({ months: 1 }))}
            sx={{
              bgcolor: theme.palette.surface.raised,
              border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
            }}
          >
            <ChevronRightRounded />
          </IconButton>
        </Stack>

        {isLoading ? (
          <Stack spacing={0.5}>
            <Box
              sx={{
                display: 'grid',
                gap: 0.5,
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              }}
            >
              {Array.from({ length: 7 }, (_, index) => (
                <Skeleton height={16} key={index} variant="rounded" />
              ))}
            </Box>
            <Box
              sx={{
                display: 'grid',
                gap: 0.5,
                gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
              }}
            >
              {Array.from({ length: 42 }, (_, index) => (
                <Skeleton height={42} key={index} variant="rounded" />
              ))}
            </Box>
          </Stack>
        ) : (
          <MonthGrid displayMonth={displayMonth} input={input} onDayClick={setSelectedDay} />
        )}

        {!isLoading && hasData ? <PhaseLegend /> : null}

        {!isLoading && !hasData ? (
          <AppCard sx={{ p: 3, textAlign: 'center' }}>
            <Stack alignItems="center" spacing={1.5}>
              <Typography color="text.primary" variant="subtitle1">
                Cần thêm dữ liệu chu kỳ
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 260 }} variant="body2">
                Bổ sung thông tin chu kỳ ở Cài đặt. Khi đủ dữ liệu, lịch sẽ tự động tô màu theo từng
                pha.
              </Typography>
              <Button
                onClick={() => navigate('/settings')}
                size="small"
                startIcon={<SettingsRounded />}
                variant="contained"
              >
                Mở cài đặt
              </Button>
            </Stack>
          </AppCard>
        ) : null}

        <Typography align="center" color="text.secondary" variant="caption">
          {DASHBOARD_DISCLAIMER}
        </Typography>
      </Stack>

      <DayDetailSheet
        input={input}
        selectedDay={selectedDay}
        userId={user?.id}
        onClose={() => setSelectedDay(null)}
      />
    </AppShell>
  );
}
