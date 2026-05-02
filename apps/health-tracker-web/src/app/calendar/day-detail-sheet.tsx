import { Box, Chip, Drawer, Skeleton, Stack, Typography, useTheme } from '@mui/material';
import { DateTime } from 'luxon';
import { useRef } from 'react';

import { MOOD_LABELS } from '@health-tracker/api';

import {
  PHASE_LABELS,
  computeCycleSnapshot,
  getWeekdayShort,
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

type InfoRowProps = {
  label: string;
  value: string;
  valueFaded?: boolean;
};

function InfoRow({ label, value, valueFaded = false }: InfoRowProps) {
  return (
    <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={2}>
      <Typography color="text.secondary" flex="0 0 auto" variant="body2">
        {label}
      </Typography>
      <Typography
        align="right"
        color={valueFaded ? 'text.secondary' : 'text.primary'}
        variant="body2"
      >
        {value}
      </Typography>
    </Stack>
  );
}

export function DayDetailSheet({ selectedDay, input, userId, onClose }: DayDetailSheetProps) {
  const theme = useTheme();

  // Keep last non-null day alive so content doesn't flash empty during close animation
  const stableDay = useRef<DateTime | null>(null);
  if (selectedDay !== null) {
    stableDay.current = selectedDay;
  }
  const renderDay = stableDay.current;

  const today = DateTime.local().startOf('day');
  const dateStr = renderDay?.toISODate() ?? null;
  const isFuture = renderDay ? renderDay.startOf('day') > today : false;

  const snapshot =
    renderDay && input
      ? computeCycleSnapshot({
          cycleLengthDays: input.cycleLengthDays,
          lastPeriodStartDate: input.lastPeriodStartDate,
          targetDate: renderDay,
        })
      : null;

  // null when input is missing OR when day is before lastPeriodStartDate
  const hasNoCycleData = snapshot === null;

  const { log, isLoading } = useDayDetail(userId, isFuture ? null : dateStr);

  const cycleLength = snapshot ? snapshot.dayOfCycle + snapshot.daysUntilNextPeriod - 1 : null;

  return (
    <Drawer anchor="bottom" open={selectedDay !== null} onClose={onClose}>
      <Stack spacing={2.5} sx={{ p: 3, pb: 5 }}>
        <Box
          sx={{
            alignSelf: 'center',
            bgcolor: theme.palette.border.strong,
            borderRadius: theme.appTokens.radius.xs,
            height: 4,
            width: 36,
          }}
        />

        <Stack spacing={2}>
          {renderDay ? (
            <Stack alignItems="center" direction="row" spacing={1}>
              <Typography variant="h6">{formatDayHeader(renderDay, snapshot)}</Typography>
              {snapshot ? (
                <Chip
                  label={PHASE_LABELS[snapshot.phase]}
                  size="small"
                  sx={{
                    backgroundColor: PHASE_LABELS[snapshot.phase],
                  }}
                />
              ) : null}
            </Stack>
          ) : null}

          {hasNoCycleData ? (
            <Typography color="text.secondary" variant="body2">
              Không có dữ liệu chu kỳ
            </Typography>
          ) : null}

          {snapshot ? (
            <Stack spacing={1.5}>
              <Typography color="text.secondary" variant="subtitle1">
                Pha chu kỳ
              </Typography>
              <Stack spacing={1}>
                <InfoRow
                  label="Pha"
                  value={`${PHASE_LABELS[snapshot.phase]} · ${PHASE_DESCRIPTIONS[snapshot.phase]}`}
                />
                <InfoRow
                  label="Ngày trong chu kỳ"
                  value={`Ngày ${snapshot.dayOfCycle} / ${cycleLength}`}
                />
                <InfoRow label="Cửa sổ thụ thai" value={getFertileWindowText(snapshot)} />
              </Stack>
            </Stack>
          ) : null}

          {isFuture ? null : (
            <Stack spacing={1.5}>
              <Typography color="text.secondary" variant="subtitle1">
                Nhật ký ngày
              </Typography>
              <Stack spacing={1}>
                {isLoading ? (
                  <>
                    <Skeleton height={20} variant="rounded" />
                    <Skeleton height={20} variant="rounded" />
                    <Skeleton height={20} variant="rounded" />
                  </>
                ) : (
                  <>
                    <InfoRow
                      label="Tâm trạng"
                      value={log?.mood ? MOOD_LABELS[log.mood] : 'Chưa ghi'}
                      valueFaded={!log?.mood}
                    />
                    <InfoRow
                      label="Nhiệt độ cơ thể"
                      value={log?.bbtCelsius == null ? 'Chưa ghi' : `${log.bbtCelsius} °C`}
                      valueFaded={log?.bbtCelsius == null}
                    />
                    <InfoRow
                      label="Cân nặng"
                      value={log?.weightKg == null ? 'Chưa ghi' : `${log.weightKg} kg`}
                      valueFaded={log?.weightKg == null}
                    />
                  </>
                )}
              </Stack>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
}
