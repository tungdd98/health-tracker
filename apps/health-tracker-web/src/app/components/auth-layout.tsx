import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { alpha } from '@mui/material/styles';
import { Box, Container, Stack, Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

import { AppCard } from '@health-tracker/ui';

type AuthLayoutProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  footer?: ReactNode;
}>;

export function AuthLayout({ eyebrow, title, description, footer, children }: AuthLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 4, sm: 6 },
        px: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ px: '0 !important' }}>
        <Stack spacing={2.5}>
          <Stack
            spacing={1.5}
            alignItems="center"
            textAlign="center"
            sx={{ px: { xs: 1.5, sm: 3 }, pt: { xs: 2, sm: 0 } }}
          >
            <Box
              sx={(theme) => ({
                width: 68,
                height: 68,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.light, 0.72),
                boxShadow: `0 18px 36px ${alpha(theme.palette.primary.main, 0.14)}`,
              })}
            >
              <FavoriteRoundedIcon />
            </Box>
            <Typography variant="overline" color="text.secondary">
              {eyebrow}
            </Typography>
            <Typography variant="h2" sx={{ maxWidth: 360 }}>
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
              {description}
            </Typography>
          </Stack>

          <AppCard
            sx={(theme) => ({
              borderRadius: '24px',
              p: { xs: 2.5, sm: 3.5 },
              backgroundColor: alpha(theme.palette.background.paper, 0.92),
              backdropFilter: 'blur(14px)',
              boxShadow: `0 24px 48px ${alpha(theme.palette.primary.main, 0.08)}`,
            })}
          >
            <Stack spacing={2.5}>{children}</Stack>
          </AppCard>

          {footer ? <Box sx={{ px: 1 }}>{footer}</Box> : null}
        </Stack>
      </Container>
    </Box>
  );
}
