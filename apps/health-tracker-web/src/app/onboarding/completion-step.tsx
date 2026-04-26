import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { Button, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

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
        <CheckCircleRoundedIcon color="primary" sx={{ fontSize: 40 }} />
        <Typography variant="h4">Sẵn sàng bắt đầu</Typography>
        <Typography color="text.secondary">Mọi thông tin cơ bản đã được thiết lập.</Typography>
      </Stack>

      <Button
        disabled={primaryActionDisabled}
        onClick={onPrimaryAction}
        size="large"
        variant="contained"
      >
        {primaryActionLoading ? 'Đang hoàn tất...' : primaryActionLabel}
      </Button>

      {footer ? (
        <Typography color="text.secondary" variant="caption">
          {footer}
        </Typography>
      ) : null}
    </Stack>
  );
}
