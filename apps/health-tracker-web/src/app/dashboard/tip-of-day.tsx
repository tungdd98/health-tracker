import { Skeleton, Stack, Typography, alpha, useTheme } from '@mui/material';
import { DateTime } from 'luxon';

import { AppCard } from '@health-tracker/ui';

import { pickTip } from './tip-library';
import type { CyclePhase } from './cycle-utils';

type TipOfDayProps = {
  phase: CyclePhase;
  isLoading: boolean;
};

export function TipOfDay({ phase, isLoading }: TipOfDayProps) {
  const theme = useTheme();

  if (isLoading) {
    return (
      <AppCard
        sx={{
          bgcolor: alpha(theme.palette.primary.light, 0.3),
          p: 2,
        }}
      >
        <Stack spacing={0.75}>
          <Skeleton height={12} variant="rounded" width={84} />
          <Skeleton height={16} variant="rounded" width="100%" />
          <Skeleton height={16} variant="rounded" width="72%" />
        </Stack>
      </AppCard>
    );
  }

  const tip = pickTip(phase, DateTime.local());

  return (
    <AppCard
      sx={{
        bgcolor: alpha(theme.palette.primary.light, 0.3),
        p: 2,
      }}
    >
      <Stack spacing={0.75}>
        <Typography color="warning.main" variant="overline">
          Mẹo hôm nay
        </Typography>
        <Typography color="text.primary" variant="body2">
          {tip}
        </Typography>
      </Stack>
    </AppCard>
  );
}
