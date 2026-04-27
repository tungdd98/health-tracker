import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { alpha } from '@mui/material/styles';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
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
        <Box
          sx={(theme) => ({
            width: 96,
            height: 96,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            color: theme.palette.primary.main,
            backgroundColor: alpha(theme.palette.primary.light, 0.72),
            boxShadow: `0 18px 36px ${alpha(theme.palette.primary.main, 0.14)}`,
          })}
        >
          <FavoriteRoundedIcon sx={{ fontSize: 36 }} />
        </Box>
        <Typography variant="h4">Bạn đã sẵn sàng!</Typography>
        <Typography color="text.secondary">
          Mọi thông tin cần thiết đã ở đúng chỗ để bạn bắt đầu vào app.
        </Typography>
      </Stack>

      <Button
        disabled={primaryActionDisabled}
        onClick={onPrimaryAction}
        size="large"
        sx={{ minHeight: 48 }}
        variant="contained"
      >
        <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
          {primaryActionLoading ? <CircularProgress color="inherit" size={18} /> : null}
          {primaryActionLoading ? 'Đang hoàn tất...' : primaryActionLabel}
        </Box>
      </Button>

      {footer ? (
        <Typography color="text.secondary" variant="caption">
          {footer}
        </Typography>
      ) : null}
    </Stack>
  );
}
