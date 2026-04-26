import { Box, Stack, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';

import { AppCard } from './app-card';

type PageSectionProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
}>;

export function PageSection({ eyebrow, title, description, children }: PageSectionProps) {
  return (
    <AppCard sx={{ p: 3 }}>
      <Stack spacing={2.5}>
        {eyebrow ? (
          <Typography color="primary.main" variant="overline">
            {eyebrow}
          </Typography>
        ) : null}
        <Box>
          <Typography variant="h3">{title}</Typography>
          {description ? (
            <Typography color="text.secondary" sx={{ mt: 0.75 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {children}
      </Stack>
    </AppCard>
  );
}
