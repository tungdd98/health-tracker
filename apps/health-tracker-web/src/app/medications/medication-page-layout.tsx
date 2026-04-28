import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, ButtonBase, Container, Stack, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';

type MedicationPageLayoutProps = PropsWithChildren<{
  actionLabel?: string;
  onAction?: () => void;
  onBack: () => void;
  title: string;
}>;

export function MedicationPageLayout({
  actionLabel,
  children,
  onAction,
  onBack,
  title,
}: MedicationPageLayoutProps) {
  return (
    <Box sx={{ minHeight: '100dvh', px: 2, py: 2 }}>
      <Container
        maxWidth="sm"
        sx={{
          px: '0 !important',
        }}
      >
        <Box
          sx={{
            minHeight: 'calc(100dvh - 32px)',
          }}
        >
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
              minHeight: 56,
              px: 0.5,
            }}
          >
            <Stack alignItems="center" direction="row" spacing={1}>
              <ButtonBase
                onClick={onBack}
                sx={{
                  alignItems: 'center',
                  borderRadius: 999,
                  color: 'text.primary',
                  display: 'inline-flex',
                  justifyContent: 'center',
                  minHeight: 24,
                  minWidth: 24,
                }}
              >
                <ArrowBackRoundedIcon fontSize="small" />
              </ButtonBase>
              <Typography sx={{ fontSize: 18, fontWeight: 700 }}>{title}</Typography>
            </Stack>

            {actionLabel && onAction ? (
              <ButtonBase
                onClick={onAction}
                sx={{
                  alignItems: 'center',
                  backgroundColor: 'primary.main',
                  borderRadius: 999,
                  color: 'primary.contrastText',
                  display: 'inline-flex',
                  gap: 0.5,
                  px: 1.75,
                  py: 1,
                }}
              >
                <AddRoundedIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{actionLabel}</Typography>
              </ButtonBase>
            ) : null}
          </Box>

          <Box sx={{ pb: 3, pt: 1 }}>{children}</Box>
        </Box>
      </Container>
    </Box>
  );
}
