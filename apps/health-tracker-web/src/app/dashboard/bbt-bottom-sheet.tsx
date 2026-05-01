import { Box, Button, InputBase, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { mapAuthErrorToMessage, type DailyLog, type DailyLogPatch } from '@health-tracker/api';
import { AppSubmitButton } from '@health-tracker/ui';

import { DailyLogSheetLayout } from './daily-log-sheet-layout';
import { DeviceThermostatRounded } from '@mui/icons-material';

type BbtBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  currentLog: DailyLog | null | undefined;
  date: string;
  isMutating: boolean;
  mutationError: Error | null;
  onSave: (patch: DailyLogPatch) => Promise<DailyLog>;
  onResetError: () => void;
};

const MIN_BBT = 35;
const MAX_BBT = 42;

export function BbtBottomSheet({
  open,
  onClose,
  currentLog,
  date,
  isMutating,
  mutationError,
  onSave,
  onResetError,
}: BbtBottomSheetProps) {
  const [value, setValue] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setValue(currentLog?.bbtCelsius?.toString() ?? '');
    setLocalError('');
    onResetError();
  }, [currentLog?.bbtCelsius, onResetError, open]);

  const handleSave = async () => {
    const parsedValue = Number.parseFloat(value);

    if (!Number.isFinite(parsedValue) || parsedValue < MIN_BBT || parsedValue > MAX_BBT) {
      setLocalError('Nhiệt độ phải trong khoảng 35–42 °C');
      return;
    }

    setLocalError('');
    await onSave({ date, bbtCelsius: parsedValue });
    onClose();
  };

  const mutationMessage = mapAuthErrorToMessage(mutationError) || mutationError?.message || '';

  return (
    <DailyLogSheetLayout
      description="Đo trước khi ra khỏi giường"
      icon={<DeviceThermostatRounded color="primary" />}
      isBusy={isMutating}
      onClose={onClose}
      open={open}
      title="Nhiệt độ cơ thể buổi sáng"
    >
      <Box
        sx={(theme) => ({
          alignItems: 'center',
          backgroundColor: theme.palette.surface.canvas,
          border: '1px solid',
          borderColor:
            Boolean(localError) || Boolean(mutationMessage) ? 'error.main' : 'border.strong',
          borderRadius: theme.appTokens.radius.md,
          display: 'flex',
          gap: 1,
          minHeight: 56,
          px: 2,
        })}
      >
        <InputBase
          inputProps={{ max: MAX_BBT, min: MIN_BBT, step: 0.05 }}
          onChange={(event) => {
            setValue(event.target.value);
            if (localError) {
              setLocalError('');
            }
          }}
          placeholder="36.5"
          sx={(theme) => ({
            '& input': {
              ...theme.appTokens.typography.metricValue,
              padding: 0,
            },
            flex: 1,
          })}
          type="number"
          value={value}
        />
        <Typography color="text.secondary" sx={(theme) => theme.appTokens.typography.sectionValue}>
          °C
        </Typography>
      </Box>

      {localError ? (
        <Typography color="error.main" variant="caption">
          {localError}
        </Typography>
      ) : null}

      {mutationMessage ? (
        <Typography color="error.main" variant="caption">
          {mutationMessage}
        </Typography>
      ) : null}

      <Stack direction="row" spacing={1.5}>
        <Button disabled={isMutating} fullWidth onClick={onClose} variant="outlined">
          Huỷ
        </Button>
        <AppSubmitButton
          disabled={isMutating}
          fullWidth
          loading={isMutating}
          loadingIndicatorSize={20}
          onClick={() => void handleSave()}
          variant="contained"
        >
          Lưu
        </AppSubmitButton>
      </Stack>
    </DailyLogSheetLayout>
  );
}
