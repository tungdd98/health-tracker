import { Box } from '@mui/material';
import type { User } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

import { mapAuthErrorToMessage, updateOnboardingProfile } from '@health-tracker/api';
import { AppConfirmDialog } from '../components/app-confirm-dialog';
import { OpacityRounded } from '@mui/icons-material';

type LogPeriodDialogProps = {
  open: boolean;
  user: User;
  onClose: () => void;
  onSuccess: () => void;
};

export function LogPeriodDialog({ open, user, onClose, onSuccess }: LogPeriodDialogProps) {
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
    <AppConfirmDialog
      cancelLabel="Huỷ"
      confirmLabel="Xác nhận"
      description="Đánh dấu hôm nay là ngày bắt đầu kỳ kinh mới? Hệ thống sẽ cập nhật dự đoán chu kỳ."
      errorMessage={errorMessage}
      icon={
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            bgcolor: theme.palette.surface.accent,
            borderRadius: theme.appTokens.radius.pill,
            display: 'flex',
            height: 48,
            justifyContent: 'center',
            width: 48,
          })}
        >
          <OpacityRounded color="primary" sx={{ fontSize: 22 }} />
        </Box>
      }
      isSubmitting={isSubmitting}
      onCancel={handleClose}
      onConfirm={() => void handleConfirm()}
      open={open}
      title="Xác nhận kỳ kinh mới"
    />
  );
}
