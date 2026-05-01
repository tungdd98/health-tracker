import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

import { AppSubmitButton } from '@health-tracker/ui';
import { FavoriteRounded } from '@mui/icons-material';

type CompletionStepProps = {
  primaryActionLabel: string;
  onPrimaryAction?: () => void;
  primaryActionDisabled?: boolean;
  primaryActionLoading?: boolean;
  footer?: ReactNode;
};

export function CompletionStep({
  footer,
  onPrimaryAction,
  primaryActionDisabled,
  primaryActionLabel,
  primaryActionLoading,
}: CompletionStepProps) {
  return (
    <Stack spacing={2}>
      <Stack alignItems="center" spacing={1} textAlign="center">
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            bgcolor: theme.palette.surface.accent,
            borderRadius: '50%',
            boxShadow: theme.appTokens.shadow.icon,
            color: theme.palette.primary.main,
            display: 'grid',
            height: 96,
            placeItems: 'center',
            width: 96,
          })}
        >
          <FavoriteRounded sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h4">Bạn đã sẵn sàng!</Typography>
        <Typography color="text.secondary" variant="body2">
          Mọi thông tin cần thiết đã ở đúng chỗ để bạn bắt đầu vào app.
        </Typography>
      </Stack>

      <AppSubmitButton
        disabled={primaryActionDisabled}
        loading={primaryActionLoading}
        onClick={onPrimaryAction}
        size="large"
        variant="contained"
      >
        {primaryActionLabel}
      </AppSubmitButton>

      {footer ? (
        <Typography color="text.secondary" variant="caption">
          {footer}
        </Typography>
      ) : null}
    </Stack>
  );
}
