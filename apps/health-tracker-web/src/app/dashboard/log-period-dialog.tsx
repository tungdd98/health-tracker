import { Box, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { OpacityRounded } from '@mui/icons-material';
import type { User } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

import { mapAuthErrorToMessage, updateOnboardingProfile } from '@health-tracker/api';
import { AppConfirmDialog } from '../components/app-confirm-dialog';

type LogPeriodDialogProps = {
  open: boolean;
  user: User;
  initialDate: string;
  mode: 'log' | 'edit';
  onClose: () => void;
  onSuccess: () => void;
};

export function LogPeriodDialog({
  open,
  user,
  initialDate,
  mode,
  onClose,
  onSuccess,
}: LogPeriodDialogProps) {
  const today = DateTime.local().startOf('day');
  const minDate = today.minus({ days: 90 });

  const [selectedDate, setSelectedDate] = useState<DateTime | null>(
    DateTime.fromISO(initialDate).isValid ? DateTime.fromISO(initialDate) : today,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (open) {
      setErrorMessage('');
      setSelectedDate(
        DateTime.fromISO(initialDate).isValid ? DateTime.fromISO(initialDate) : today,
      );
    }
  }, [open, initialDate]);

  const isDateValid =
    selectedDate !== null &&
    selectedDate.isValid &&
    selectedDate >= minDate &&
    selectedDate <= today;

  const handleClose = () => {
    if (isSubmitting) return;
    setErrorMessage('');
    onClose();
  };

  const handleConfirm = async () => {
    if (!isDateValid || !selectedDate) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const { error } = await updateOnboardingProfile(user, {
      lastPeriodStartDate: selectedDate.toISODate() ?? null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(mapAuthErrorToMessage(error) || 'Không lưu được. Vui lòng thử lại.');
      return;
    }

    onSuccess();
  };

  const title = mode === 'edit' ? 'Chỉnh sửa ngày bắt đầu' : 'Xác nhận kỳ kinh mới';

  return (
    <AppConfirmDialog
      cancelLabel="Huỷ"
      confirmDisabled={!isDateValid || isSubmitting}
      confirmLabel="Xác nhận"
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
      title={title}
    >
      <DatePicker
        enableAccessibleFieldDOMStructure={false}
        format="dd/MM/yyyy"
        label="Ngày bắt đầu"
        maxDate={today}
        minDate={minDate}
        value={selectedDate}
        onChange={(value) => setSelectedDate(value)}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
        slots={{
          textField: TextField,
        }}
      />
    </AppConfirmDialog>
  );
}
