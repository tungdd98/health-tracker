import { Box, Container, Stack, Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

import { AppCard } from '@health-tracker/ui';
import { FavoriteRounded } from '@mui/icons-material';

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
        alignItems: 'center',
        display: 'flex',
        minHeight: '100dvh',
        px: 2,
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="sm" sx={{ px: '0 !important' }}>
        <Stack spacing={2.5}>
          <Stack
            alignItems="center"
            spacing={1.5}
            sx={{ px: { xs: 1.5, sm: 3 }, pt: { xs: 2, sm: 0 } }}
            textAlign="center"
          >
            <Box
              sx={(theme) => ({
                alignItems: 'center',
                bgcolor: theme.palette.surface.accent,
                borderRadius: '50%',
                boxShadow: theme.appTokens.shadow.icon,
                color: theme.palette.primary.main,
                display: 'grid',
                height: 68,
                placeItems: 'center',
                width: 68,
              })}
            >
              <FavoriteRounded />
            </Box>
            <Typography color="text.secondary" variant="overline">
              {eyebrow}
            </Typography>
            <Typography sx={{ maxWidth: 360 }} variant="h5">
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 420 }} variant="body2">
              {description}
            </Typography>
          </Stack>

          <AppCard
            sx={(theme) => ({
              backdropFilter: 'blur(14px)',
              backgroundColor: theme.palette.surface.raised,
              borderRadius: theme.appTokens.radius.xl,
              boxShadow: theme.appTokens.shadow.modal,
              p: { xs: 2.5, sm: 3.5 },
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
