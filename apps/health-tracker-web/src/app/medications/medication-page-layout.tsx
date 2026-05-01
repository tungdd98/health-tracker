import { Box, Button, Container, IconButton, Stack, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { AddRounded, ArrowBackRounded } from '@mui/icons-material';

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
      <Container maxWidth="sm" sx={{ px: '0 !important' }}>
        <Box sx={{ minHeight: 'calc(100dvh - 32px)' }}>
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
              <IconButton
                color="primary"
                onClick={onBack}
                size="small"
                sx={{ bgcolor: 'surface.raised' }}
              >
                <ArrowBackRounded fontSize="small" />
              </IconButton>
              <Typography variant="h4">{title}</Typography>
            </Stack>

            {actionLabel && onAction ? (
              <Button
                onClick={onAction}
                size="small"
                startIcon={<AddRounded />}
                variant="contained"
              >
                {actionLabel}
              </Button>
            ) : null}
          </Box>

          <Box sx={{ pb: 3, pt: 1 }}>{children}</Box>
        </Box>
      </Container>
    </Box>
  );
}
