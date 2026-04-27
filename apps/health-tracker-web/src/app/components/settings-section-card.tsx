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
    <AppCard sx={{ borderRadius: '24px', p: 2.5 }}>
      <Stack spacing={2}>
        <Box>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600 }} variant="subtitle1">
            {title}
          </Typography>
          {description ? (
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
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
