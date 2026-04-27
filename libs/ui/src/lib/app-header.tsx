import { Box, IconButton, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type AppHeaderProps = {
  action?: ReactNode;
  eyebrow?: string;
  subtitleFontWeight?: number;
  subtitle?: string;
  title?: string;
};

export function AppHeader({
  action,
  eyebrow,
  subtitleFontWeight,
  subtitle,
  title,
}: AppHeaderProps) {
  let actionNode: ReactNode = null;

  if (action) {
    actionNode =
      typeof action === 'string' ? (
        <IconButton color="primary" sx={{ bgcolor: 'rgba(255,255,255,0.72)' }}>
          {action}
        </IconButton>
      ) : (
        action
      );
  }

  return (
    <Box component="header" sx={{ pb: 2.5, pt: 0.5, px: 0.5 }}>
      <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={2}>
        <Stack spacing={0.5}>
          {eyebrow ? (
            <Typography color="text.secondary" variant="overline">
              {eyebrow}
            </Typography>
          ) : null}
          {title ? <Typography variant="h3">{title}</Typography> : null}
          {subtitle ? (
            <Typography
              color="text.secondary"
              sx={{ fontWeight: subtitleFontWeight }}
              variant="body2"
            >
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
        {actionNode}
      </Stack>
    </Box>
  );
}
