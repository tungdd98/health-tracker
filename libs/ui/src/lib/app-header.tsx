import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type AppHeaderProps = {
  action?: ReactNode;
  eyebrow?: string;
  subtitle?: string;
  title?: string;
};

export function AppHeader({
  action,
  eyebrow = 'Health Tracker',
  subtitle = 'Design system foundation',
  title = 'Serene mobile health UI',
}: AppHeaderProps) {
  return (
    <Box component="header" sx={{ pb: 2, pt: 3 }}>
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
            <Typography color="primary.main" variant="overline">
              {eyebrow}
            </Typography>
            <Typography variant="h4">{title}</Typography>
            <Typography color="text.secondary" variant="body2">
              {subtitle}
            </Typography>
          </Stack>
        </Stack>
        {action ? (
          typeof action === 'string' ? (
            <IconButton color="primary" sx={{ bgcolor: 'rgba(255,255,255,0.72)' }}>
              {action}
            </IconButton>
          ) : (
            action
          )
        ) : null}
      </Stack>
    </Box>
  );
}
