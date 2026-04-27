import OpacityRoundedIcon from '@mui/icons-material/OpacityRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import type { User } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

import { mapAuthErrorToMessage, updateOnboardingProfile } from '@health-tracker/api';

type LogPeriodDialogProps = {
  open: boolean;
  user: User;
  onClose: () => void;
  onSuccess: () => void;
};

export function LogPeriodDialog({ open, user, onClose, onSuccess }: LogPeriodDialogProps) {
  const theme = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (open) {
      setErrorMessage('');
    }
  }, [open]);

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setErrorMessage('');
    onClose();
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const { error } = await updateOnboardingProfile(user, {
      lastPeriodStartDate: DateTime.local().toISODate() ?? null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(mapAuthErrorToMessage(error) || 'Không lưu được. Vui lòng thử lại.');
      return;
    }

    onSuccess();
  };

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={isSubmitting ? undefined : handleClose}>
      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={1.75}>
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: alpha(theme.palette.primary.light, 0.7),
              borderRadius: 999,
              display: 'flex',
              height: 48,
              justifyContent: 'center',
              width: 48,
            }}
          >
            <OpacityRoundedIcon color="primary" sx={{ fontSize: 22 }} />
          </Box>

          <DialogTitle sx={{ p: 0 }}>Xác nhận kỳ kinh mới</DialogTitle>

          <Typography color="text.secondary" variant="body2">
            Đánh dấu hôm nay là ngày bắt đầu kỳ kinh mới? Hệ thống sẽ cập nhật dự đoán chu kỳ.
          </Typography>

          {errorMessage ? (
            <Alert
              icon={<WarningAmberRoundedIcon fontSize="inherit" />}
              severity="error"
              sx={{
                alignItems: 'flex-start',
                borderRadius: 1.5,
              }}
              variant="filled"
            >
              {errorMessage}
            </Alert>
          ) : null}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ gap: 1.25, px: 3, pb: 3, pt: 0 }}>
        <Button
          disabled={isSubmitting}
          fullWidth
          onClick={handleClose}
          sx={{ flex: 1 }}
          variant="outlined"
        >
          Huỷ
        </Button>
        <Button
          disabled={isSubmitting}
          fullWidth
          onClick={() => void handleConfirm()}
          sx={{ flex: 1 }}
          variant="contained"
        >
          <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
            {isSubmitting ? <CircularProgress color="inherit" size={16} /> : null}
            Xác nhận
          </Box>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
