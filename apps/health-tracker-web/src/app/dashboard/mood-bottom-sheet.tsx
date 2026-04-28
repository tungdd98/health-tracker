import { Box, Button, CircularProgress, Drawer, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded';

import {
  mapAuthErrorToMessage,
  type DailyLog,
  type DailyLogPatch,
  type MoodValue,
} from '@health-tracker/api';

type MoodBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  currentLog: DailyLog | null | undefined;
  date: string;
  isMutating: boolean;
  mutationError: Error | null;
  onSave: (patch: DailyLogPatch) => Promise<DailyLog>;
  onResetError: () => void;
};

const MOODS: Array<{ value: MoodValue; emoji: string; label: string }> = [
  { value: 'sad', emoji: '😔', label: 'Buồn' },
  { value: 'neutral', emoji: '😐', label: 'Bình thường' },
  { value: 'happy', emoji: '😊', label: 'Vui' },
  { value: 'very_happy', emoji: '😄', label: 'Rất vui' },
  { value: 'tired', emoji: '😴', label: 'Mệt mỏi' },
];
const COLOR_BORDER_STRONG = '#C0ADB3';
const COLOR_BORDER_SUBTLE = '#E8DDE1';
const COLOR_BG_TINTED = '#FFF0F4';
const COLOR_BG_TINTED_STRONG = '#F4DCE4';
const COLOR_BG_CANVAS = '#FFF8F8';

export function MoodBottomSheet({
  open,
  onClose,
  currentLog,
  date,
  isMutating,
  mutationError,
  onSave,
  onResetError,
}: MoodBottomSheetProps) {
  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSelectedMood(currentLog?.mood ?? null);
    onResetError();
  }, [currentLog?.mood, onResetError, open]);

  const handleSave = async () => {
    if (!selectedMood) {
      return;
    }

    await onSave({ date, mood: selectedMood });
    onClose();
  };

  const selectedMoodLabel = MOODS.find((mood) => mood.value === selectedMood)?.label ?? null;
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
            <SentimentSatisfiedAltRoundedIcon color="primary" />
          </Box>

          <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Tâm trạng hôm nay</Typography>

          <Stack direction="row" spacing={1}>
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood.value;

              return (
                <Box
                  component="button"
                  key={mood.value}
                  onClick={() => setSelectedMood(mood.value)}
                  sx={{
                    alignItems: 'center',
                    appearance: 'none',
                    backgroundColor: isSelected ? COLOR_BG_TINTED_STRONG : COLOR_BG_CANVAS,
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : COLOR_BORDER_SUBTLE,
                    borderRadius: '16px',
                    color: 'text.primary',
                    cursor: 'pointer',
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    gap: 0.5,
                    justifyContent: 'center',
                    minHeight: 64,
                    px: 0.5,
                    py: 1,
                  }}
                  type="button"
                >
                  <Typography sx={{ fontSize: 22 }}>{mood.emoji}</Typography>
                  <Typography
                    color={isSelected ? 'primary.main' : 'text.secondary'}
                    sx={{ fontSize: 9, fontWeight: isSelected ? 700 : 400, lineHeight: 1.25 }}
                  >
                    {mood.label}
                  </Typography>
                </Box>
              );
            })}
          </Stack>

          {selectedMoodLabel ? (
            <Typography align="center" color="primary.main" sx={{ fontSize: 14, fontWeight: 600 }}>
              {selectedMoodLabel}
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
              disabled={!selectedMood || isMutating}
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
