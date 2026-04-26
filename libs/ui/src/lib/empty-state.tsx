import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

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
      sx={{
        bgcolor: 'rgba(255,255,255,0.78)',
        borderRadius: 6,
        p: 3,
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          bgcolor: 'primary.light',
          borderRadius: 999,
          color: 'primary.main',
          display: 'flex',
          height: 52,
          justifyContent: 'center',
          width: 52,
        }}
      >
        {icon ?? <FavoriteRoundedIcon />}
      </Box>
      <Typography variant="h5">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
      {action}
    </Stack>
  );
}
