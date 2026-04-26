import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
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
    <Box component="header" sx={{ pb: 2, pt: 0 }}>
      <Stack alignItems="flex-start" direction="row" justifyContent="space-between" spacing={2}>
        <Stack direction="row" spacing={1.5}>
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: 'rgba(255,255,255,0.74)',
              borderRadius: 999,
              display: 'flex',
              height: 48,
              justifyContent: 'center',
              width: 48,
            }}
          >
            <FavoriteRoundedIcon color="primary" />
          </Box>
          <Stack spacing={0.5}>
            {eyebrow ? (
              <Typography color="primary.main" variant="overline">
                {eyebrow}
              </Typography>
            ) : null}
            {title ? <Typography variant="h4">{title}</Typography> : null}
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
        </Stack>
        {actionNode}
      </Stack>
    </Box>
  );
}
