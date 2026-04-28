import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
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
              <FavoriteRoundedIcon />
            </Box>
            <Typography color="text.secondary" variant="overline">
              {eyebrow}
            </Typography>
            <Typography sx={{ maxWidth: 360 }} variant="h2">
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 460 }} variant="body2">
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
            <Stack spacing={2.5}>
              <Stack spacing={1}>
                <Stack spacing={0.25}>
                  <Typography color="text.secondary" variant="overline">
                    Bước {currentStepNumber} / {totalSteps}
                  </Typography>
                  <Typography sx={(theme) => theme.appTokens.typography.sectionValue}>
                    {stepLabel}
                  </Typography>
                </Stack>
                <LinearProgress sx={{ height: 8 }} value={progressValue} variant="determinate" />
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
