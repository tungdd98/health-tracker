import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { alpha } from '@mui/material/styles';
import { Box, Container, LinearProgress, Stack, Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

import { AppCard } from '@health-tracker/ui';

type OnboardingLayoutProps = PropsWithChildren<{
  eyebrow: string;
  title: string;
  description: string;
  stepLabel: string;
  currentStepNumber: number;
  totalSteps: number;
  backAction?: ReactNode;
  skipAction?: ReactNode;
  continueAction?: ReactNode;
  footerNote?: ReactNode;
}>;

export function OnboardingLayout({
  eyebrow,
  title,
  description,
  stepLabel,
  currentStepNumber,
  totalSteps,
  backAction,
  skipAction,
  continueAction,
  footerNote,
  children,
}: OnboardingLayoutProps) {
  const progressValue = Math.min(100, (currentStepNumber / totalSteps) * 100);

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100dvh',
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
            <Typography color="text.secondary" variant="overline">
              {eyebrow}
            </Typography>
            <Typography sx={{ maxWidth: 360 }} variant="h2">
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 460 }}>
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
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Stack spacing={0.25}>
                  <Typography color="text.secondary" variant="overline">
                    Bước {currentStepNumber} / {totalSteps}
                  </Typography>
                  <Typography variant="body2">{stepLabel}</Typography>
                </Stack>
                <LinearProgress
                  sx={{
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: 'rgba(0, 0, 0, 0.06)',
                  }}
                  value={progressValue}
                  variant="determinate"
                />
              </Stack>

              {children}

              {backAction || skipAction || continueAction ? (
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <Box sx={{ flex: 1 }}>{backAction}</Box>
                  <Box sx={{ flex: 1 }}>{skipAction}</Box>
                  <Box sx={{ flex: 1 }}>{continueAction}</Box>
                </Stack>
              ) : null}

              {footerNote ? (
                <Typography color="text.secondary" variant="caption">
                  {footerNote}
                </Typography>
              ) : null}
            </Stack>
          </AppCard>
        </Stack>
      </Container>
    </Box>
  );
}
