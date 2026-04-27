import { Box, Skeleton, Stack, Typography, alpha, useTheme } from '@mui/material';
import { DateTime } from 'luxon';

import { computeCycleSnapshot, getWeekdayShort } from './cycle-utils';

type StripInput = {
  cycleLengthDays: number;
  lastPeriodStartDate: DateTime;
};

type OutlookStripProps = {
  input: StripInput | null;
  isLoading: boolean;
};

export function OutlookStrip({ input, isLoading }: OutlookStripProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Stack direction="row" spacing={0.75}>
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton key={index} sx={{ borderRadius: 2.5, flex: 1 }} variant="rounded" height={62} />
        ))}
      </Stack>
    );
  }

  const today = DateTime.local().startOf('day');
  const days = Array.from({ length: 7 }, (_, index) => today.plus({ days: index }));

  return (
    <Stack direction="row" spacing={0.75}>
      {days.map((date, index) => {
        const isToday = index === 0;
        const snapshot = input
          ? computeCycleSnapshot({
              cycleLengthDays: input.cycleLengthDays,
              lastPeriodStartDate: input.lastPeriodStartDate,
              targetDate: date,
            })
          : null;
        const dotColor = snapshot
          ? theme.palette.phase[snapshot.phase]
          : alpha(theme.palette.text.secondary, 0.2);

        return (
          <Box
            key={date.toISODate()}
            sx={{
              alignItems: 'center',
              bgcolor: isToday ? alpha(theme.palette.primary.light, 0.5) : 'background.paper',
              border: '1px solid',
              borderColor: isToday ? 'primary.main' : 'transparent',
              borderRadius: 2.5,
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              gap: 0.5,
              justifyContent: 'center',
              minHeight: 62,
              px: 0.5,
              py: 1,
            }}
          >
            <Typography color="text.secondary" sx={{ letterSpacing: 0.5 }} variant="caption">
              {getWeekdayShort(date)}
            </Typography>
            <Typography fontWeight={isToday ? 700 : 600} variant="body2">
              {date.toFormat('dd')}
            </Typography>
            <Box
              sx={{
                bgcolor: dotColor,
                borderRadius: '50%',
                height: 6,
                width: 6,
              }}
            />
          </Box>
        );
      })}
    </Stack>
  );
}
