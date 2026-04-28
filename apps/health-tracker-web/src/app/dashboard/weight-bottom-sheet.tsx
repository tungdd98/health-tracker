import MonitorWeightRoundedIcon from '@mui/icons-material/MonitorWeightRounded';
import { Box, Button, CircularProgress, InputBase, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { mapAuthErrorToMessage, type DailyLog, type DailyLogPatch } from '@health-tracker/api';

import { DailyLogSheetLayout } from './daily-log-sheet-layout';

type WeightBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  currentLog: DailyLog | null | undefined;
  date: string;
  isMutating: boolean;
  mutationError: Error | null;
  onSave: (patch: DailyLogPatch) => Promise<DailyLog>;
  onResetError: () => void;
};

const MIN_WEIGHT = 20;
const MAX_WEIGHT = 300;

export function WeightBottomSheet({
  open,
  onClose,
  currentLog,
  date,
  isMutating,
  mutationError,
  onSave,
  onResetError,
}: WeightBottomSheetProps) {
  const [value, setValue] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

    setValue(currentLog?.weightKg?.toString() ?? '');
    setLocalError('');
    onResetError();
  }, [currentLog?.weightKg, onResetError, open]);

  const handleSave = async () => {
    const parsedValue = Number.parseFloat(value);

    if (!Number.isFinite(parsedValue) || parsedValue < MIN_WEIGHT || parsedValue > MAX_WEIGHT) {
      setLocalError('Cân nặng phải trong khoảng 20–300 kg');
      return;
    }

    setLocalError('');
    await onSave({ date, weightKg: parsedValue });
    onClose();
  };

  const mutationMessage = mapAuthErrorToMessage(mutationError) || mutationError?.message || '';

  return (
    <DailyLogSheetLayout
      description="Cân trước bữa sáng"
      icon={<MonitorWeightRoundedIcon color="primary" />}
      isBusy={isMutating}
      onClose={onClose}
      open={open}
      title="Cân nặng hôm nay"
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
          inputProps={{ max: MAX_WEIGHT, min: MIN_WEIGHT, step: 0.1 }}
          onChange={(event) => {
            setValue(event.target.value);
            if (localError) {
              setLocalError('');
            }
          }}
          placeholder="52.5"
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
          kg
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
        <Button
          disabled={isMutating}
          fullWidth
          onClick={() => void handleSave()}
          variant="contained"
        >
          <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
            {isMutating ? <CircularProgress color="inherit" size={20} /> : null}
            Lưu
          </Box>
        </Button>
      </Stack>
    </DailyLogSheetLayout>
  );
}
