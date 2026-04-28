import { Box, Stack, Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

import { AppCard } from '@health-tracker/ui';

type SettingsSectionCardProps = PropsWithChildren<{
  title: string;
  description?: string;
  action?: ReactNode;
}>;

export function SettingsSectionCard({
  title,
  description,
  action,
  children,
}: SettingsSectionCardProps) {
  return (
    <AppCard sx={(theme) => ({ borderRadius: theme.appTokens.radius.xl, p: 2.5 })}>
      <Stack spacing={2}>
        <Box>
          <Typography sx={(theme) => theme.appTokens.typography.sectionValue} variant="subtitle1">
            {title}
          </Typography>
          {description ? (
            <Typography color="text.secondary" sx={{ mt: 0.75 }} variant="body2">
              {description}
            </Typography>
          ) : null}
        </Box>

        {children}

        {action ? <Box>{action}</Box> : null}
      </Stack>
    </AppCard>
  );
}
