import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { Box, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type AppListItemProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
};

export function AppListItem({ title, subtitle, leading, trailing }: AppListItemProps) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        bgcolor: theme.palette.surface.raised,
        borderRadius: theme.appTokens.radius.xl,
        overflow: 'hidden',
      })}
    >
      <ListItemButton sx={{ minHeight: 72, px: 2.25, py: 1.5 }}>
        {leading ? (
          <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>{leading}</ListItemIcon>
        ) : null}
        <ListItemText
          primary={title}
          secondary={subtitle}
          primaryTypographyProps={{ fontWeight: 700 }}
          secondaryTypographyProps={{ color: 'text.secondary' }}
        />
        <Box alignItems="center" display="flex" gap={1}>
          {typeof trailing === 'string' ? (
            <Typography color="text.secondary" variant="body2">
              {trailing}
            </Typography>
          ) : (
            trailing
          )}
          <ChevronRightRoundedIcon color="disabled" />
        </Box>
      </ListItemButton>
    </Paper>
  );
}
