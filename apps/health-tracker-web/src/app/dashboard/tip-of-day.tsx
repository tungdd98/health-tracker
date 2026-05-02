import { Skeleton, Stack, Typography, alpha, useTheme } from '@mui/material';

import { AppCard } from '@health-tracker/ui';

import type { CyclePhase } from './cycle-utils';
import { useDailyTip } from './use-daily-tip';

type TipOfDayProps = {
  userId: string;
  phase: CyclePhase;
  date: string;
  chatbotName: string | null;
};

export function TipOfDay({ userId, phase, date, chatbotName }: TipOfDayProps) {
  const theme = useTheme();
  const { tip, isLoading } = useDailyTip(userId, phase, date);

  const title = chatbotName ? `Lời khuyên của ${chatbotName}` : 'Lời khuyên của AI';

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

  return (
    <AppCard
      sx={{
        bgcolor: alpha(theme.palette.primary.light, 0.3),
        p: 2,
      }}
    >
      <Stack spacing={0.75}>
        <Typography color="warning.main" variant="subtitle1">
          {title}
        </Typography>
        <Typography color="text.primary" variant="body2">
          {tip}
        </Typography>
      </Stack>
    </AppCard>
  );
}
