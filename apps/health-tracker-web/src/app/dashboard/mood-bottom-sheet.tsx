import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  mapAuthErrorToMessage,
  type DailyLog,
  type DailyLogPatch,
  type MoodValue,
} from '@health-tracker/api';
import { AppSubmitButton } from '@health-tracker/ui';

import { DailyLogSheetLayout } from './daily-log-sheet-layout';

type MoodBottomSheetProps = {
  open: boolean;
  onClose: () => void;
  currentLog: DailyLog | null | undefined;
  date: string;
  isMutating: boolean;
  mutationError: Error | null;
  onSave: (patch: DailyLogPatch) => Promise<DailyLog>;
  onResetError: () => void;
  moodImages?: Partial<Record<MoodValue, string>>;
  useAvatarMood?: boolean;
};

const MOODS: Array<{ value: MoodValue; emoji: string; label: string }> = [
  { value: 'sad', emoji: '😔', label: 'Buồn' },
  { value: 'neutral', emoji: '😐', label: 'Bình thường' },
  { value: 'happy', emoji: '😊', label: 'Vui' },
  { value: 'very_happy', emoji: '😄', label: 'Rất vui' },
  { value: 'tired', emoji: '😴', label: 'Mệt mỏi' },
];

export function MoodBottomSheet({
  open,
  onClose,
  currentLog,
  date,
  isMutating,
  mutationError,
  onSave,
  onResetError,
  moodImages = {},
  useAvatarMood = true,
}: MoodBottomSheetProps) {
  const showStickers = useAvatarMood && Object.keys(moodImages).length > 0;
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
    <DailyLogSheetLayout
      icon={<SentimentSatisfiedAltRoundedIcon color="primary" />}
      isBusy={isMutating}
      onClose={onClose}
      open={open}
      title="Tâm trạng hôm nay"
    >
      <Stack direction="row" spacing={1}>
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.value;

          return (
            <Box
              component="button"
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              sx={(theme) => ({
                alignItems: 'center',
                appearance: 'none',
                backgroundColor: isSelected
                  ? theme.palette.surface.selectedStrong
                  : theme.palette.surface.canvas,
                border: '1px solid',
                borderColor: isSelected ? 'primary.main' : 'border.subtle',
                borderRadius: theme.appTokens.radius.md,
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
              })}
              type="button"
            >
              {showStickers && moodImages[mood.value] ? (
                <Box
                  alt={mood.label}
                  component="img"
                  src={moodImages[mood.value]}
                  sx={{ height: 32, width: 32, objectFit: 'contain' }}
                />
              ) : (
                <Typography sx={{ fontSize: 22 }}>{mood.emoji}</Typography>
              )}
              <Typography
                color={isSelected ? 'primary.main' : 'text.secondary'}
                sx={(theme) => ({
                  ...theme.appTokens.typography.microLabel,
                  fontWeight: isSelected ? 700 : 500,
                  letterSpacing: '0.03em',
                  lineHeight: 1.25,
                  textTransform: 'none',
                })}
              >
                {mood.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>

      {selectedMoodLabel ? (
        <Typography
          align="center"
          color="primary.main"
          sx={(theme) => theme.appTokens.typography.sectionValue}
        >
          {selectedMoodLabel}
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
          disabled={!selectedMood || isMutating}
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
