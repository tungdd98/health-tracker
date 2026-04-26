import { Box, Card, Stack, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';

type PageSectionProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
}>;

export function PageSection({ eyebrow, title, description, children }: PageSectionProps) {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={2}>
        {eyebrow ? (
          <Typography color="primary.main" variant="overline">
            {eyebrow}
          </Typography>
        ) : null}
        <Box>
          <Typography variant="h2">{title}</Typography>
          {description ? <Typography color="text.secondary">{description}</Typography> : null}
        </Box>
        {children}
      </Stack>
    </Card>
  );
}
