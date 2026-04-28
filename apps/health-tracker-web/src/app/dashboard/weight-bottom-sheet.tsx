import MonitorWeightRoundedIcon from '@mui/icons-material/MonitorWeightRounded';
import { Box, Button, CircularProgress, Drawer, InputBase, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { mapAuthErrorToMessage, type DailyLog, type DailyLogPatch } from '@health-tracker/api';

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
const COLOR_BORDER_STRONG = '#C0ADB3';
const COLOR_BG_TINTED = '#FFF0F4';
const COLOR_BG_CANVAS = '#FFF8F8';

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
    <Drawer
      anchor="bottom"
      open={open}
      onClose={isMutating ? undefined : onClose}
      PaperProps={{
        sx: {
          borderRadius: '24px 24px 0 0',
          p: 3,
          pb: 5,
        },
      }}
    >
      <Stack spacing={2.5}>
        <Box
          sx={{
            alignSelf: 'center',
            bgcolor: COLOR_BORDER_STRONG,
            borderRadius: '2px',
            height: 4,
            width: 36,
          }}
        />

        <Stack spacing={2}>
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: COLOR_BG_TINTED,
              borderRadius: 999,
              display: 'flex',
              height: 48,
              justifyContent: 'center',
              width: 48,
            }}
          >
            <MonitorWeightRoundedIcon color="primary" />
          </Box>

          <Stack spacing={0.5}>
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Cân nặng hôm nay</Typography>
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              Cân trước bữa sáng
            </Typography>
          </Stack>

          <Box
            sx={{
              alignItems: 'center',
              backgroundColor: COLOR_BG_CANVAS,
              border: '1px solid',
              borderColor:
                Boolean(localError) || Boolean(mutationMessage)
                  ? 'error.main'
                  : COLOR_BORDER_STRONG,
              borderRadius: '16px',
              display: 'flex',
              gap: 1,
              minHeight: 56,
              px: 2,
            }}
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
              sx={{
                '& input': {
                  fontSize: 22,
                  fontWeight: 700,
                  padding: 0,
                },
                flex: 1,
              }}
              type="number"
              value={value}
            />
            <Typography color="text.secondary" fontSize={16} fontWeight={500}>
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
            <Button
              disabled={isMutating}
              fullWidth
              onClick={onClose}
              sx={{ borderColor: COLOR_BORDER_STRONG, color: 'text.secondary' }}
              variant="outlined"
            >
              Huỷ
            </Button>
            <Button
              disabled={isMutating}
              fullWidth
              onClick={() => void handleSave()}
              sx={{
                background: 'linear-gradient(135deg, #6C5A61 0%, #6C5A61B8 100%)',
                '&.Mui-disabled': {
                  background: 'linear-gradient(135deg, #6C5A61 0%, #6C5A61B8 100%)',
                  color: 'rgba(255, 247, 248, 0.72)',
                  opacity: 0.56,
                },
              }}
              variant="contained"
            >
              <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
                {isMutating ? <CircularProgress color="inherit" size={20} /> : null}
                Lưu
              </Box>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  );
}
