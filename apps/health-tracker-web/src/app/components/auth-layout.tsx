import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { alpha } from '@mui/material/styles';
import { Box, Container, Stack, Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

import { AppCard, AppChip } from '@health-tracker/ui';

type AuthLayoutProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  chips?: string[];
  footer?: ReactNode;
}>;

export function AuthLayout({
  eyebrow,
  title,
  description,
  chips,
  footer,
  children,
}: AuthLayoutProps) {
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
        <Stack spacing={3}>
          <Stack
            spacing={1.5}
            alignItems="center"
            textAlign="center"
            sx={{ px: { xs: 1.5, sm: 3 } }}
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
            {chips && chips.length > 0 ? (
              <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1}>
                {chips.map((chip) => (
                  <AppChip key={chip} label={chip} />
                ))}
              </Stack>
            ) : null}
          </Stack>

          <AppCard
            sx={(theme) => ({
              p: { xs: 2.5, sm: 3.5 },
              backgroundColor: alpha(theme.palette.background.paper, 0.92),
              backdropFilter: 'blur(14px)',
            })}
          >
            <Stack spacing={2.5}>
              {children}
              {footer}
            </Stack>
          </AppCard>
        </Stack>
      </Container>
    </Box>
  );
}
