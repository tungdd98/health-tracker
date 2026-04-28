import { Box, Drawer, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type DailyLogSheetLayoutProps = {
  open: boolean;
  onClose: () => void;
  isBusy: boolean;
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
};

export function DailyLogSheetLayout({
  open,
  onClose,
  isBusy,
  icon,
  title,
  description,
  children,
}: DailyLogSheetLayoutProps) {
  return (
    <Drawer anchor="bottom" open={open} onClose={isBusy ? undefined : onClose}>
      <Stack spacing={2.5} sx={{ p: 3, pb: 5 }}>
        <Box
          sx={(theme) => ({
            alignSelf: 'center',
            bgcolor: theme.palette.border.strong,
            borderRadius: theme.appTokens.radius.xs,
            height: 4,
            width: 36,
          })}
        />

        <Stack spacing={2}>
          <Box
            sx={(theme) => ({
              alignItems: 'center',
              bgcolor: theme.palette.surface.sunken,
              borderRadius: theme.appTokens.radius.pill,
              display: 'flex',
              height: 48,
              justifyContent: 'center',
              width: 48,
            })}
          >
            {icon}
          </Box>

          <Stack spacing={0.5}>
            <Typography sx={(theme) => theme.appTokens.typography.titleMd}>{title}</Typography>
            {description ? (
              <Typography
                color="text.secondary"
                sx={(theme) => theme.appTokens.typography.sectionLabel}
              >
                {description}
              </Typography>
            ) : null}
          </Stack>

          {children}
        </Stack>
      </Stack>
    </Drawer>
  );
}
