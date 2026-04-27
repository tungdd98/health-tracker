import { Box, Typography, alpha, useTheme } from '@mui/material';
import { DateTime } from 'luxon';

import { computeCycleSnapshot } from '../dashboard/cycle-utils';

const GRID_HEADERS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

type MonthGridInput = {
  cycleLengthDays: number;
  lastPeriodStartDate: DateTime;
};

type MonthGridProps = {
  displayMonth: DateTime;
  input: MonthGridInput | null;
};

export function MonthGrid({ displayMonth, input }: MonthGridProps) {
  const theme = useTheme();
  const today = DateTime.local().startOf('day');
  const firstDayOfMonth = displayMonth.startOf('month');
  const firstCellDate = firstDayOfMonth.minus({ days: firstDayOfMonth.weekday % 7 });
  const cells = Array.from({ length: 42 }, (_, index) => firstCellDate.plus({ days: index }));

  return (
    <Box>
      <Box
        sx={{
          display: 'grid',
          gap: 0.5,
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
          mb: 0.5,
        }}
      >
        {GRID_HEADERS.map((header) => (
          <Typography align="center" color="text.secondary" key={header} variant="caption">
            {header}
          </Typography>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 0.5,
          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        }}
      >
        {cells.map((date) => {
          const isCurrentMonth = date.hasSame(displayMonth, 'month');
          const isToday = date.hasSame(today, 'day');
          const snapshot = input
            ? computeCycleSnapshot({
                cycleLengthDays: input.cycleLengthDays,
                lastPeriodStartDate: input.lastPeriodStartDate,
                targetDate: date,
              })
            : null;

          const backgroundColor =
            snapshot && isCurrentMonth ? theme.palette.phase[snapshot.phase] : 'transparent';

          return (
            <Box
              key={date.toISODate()}
              sx={{
                alignItems: 'center',
                aspectRatio: '1',
                bgcolor: backgroundColor,
                border: isToday
                  ? `1.5px solid ${theme.palette.primary.main}`
                  : '1px solid transparent',
                borderRadius: 1.5,
                display: 'flex',
                justifyContent: 'center',
                opacity: isCurrentMonth ? 1 : 0.4,
                position: 'relative',
              }}
            >
              {isToday ? (
                <Box
                  sx={{
                    border: `1px solid ${alpha(theme.palette.background.paper, 0.95)}`,
                    borderRadius: 1.25,
                    bottom: 3,
                    left: 3,
                    position: 'absolute',
                    right: 3,
                    top: 3,
                  }}
                />
              ) : null}
              <Typography
                color={isCurrentMonth ? 'text.primary' : 'text.secondary'}
                sx={{ position: 'relative' }}
                variant="body2"
              >
                {date.day}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
