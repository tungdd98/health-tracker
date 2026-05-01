import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { FavoriteRounded } from '@mui/icons-material';

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Stack
      alignItems="flex-start"
      spacing={2}
      sx={(theme) => ({
        bgcolor: theme.palette.surface.raised,
        borderRadius: theme.appTokens.radius.xl,
        boxShadow: theme.appTokens.shadow.card,
        p: 3,
      })}
    >
      <Box
        sx={(theme) => ({
          alignItems: 'center',
          bgcolor: theme.palette.surface.accent,
          borderRadius: theme.appTokens.radius.pill,
          color: 'primary.main',
          display: 'flex',
          height: 52,
          justifyContent: 'center',
          width: 52,
        })}
      >
        {icon ?? <FavoriteRounded />}
      </Box>
      <Typography variant="h5">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
      {action}
    </Stack>
  );
}
