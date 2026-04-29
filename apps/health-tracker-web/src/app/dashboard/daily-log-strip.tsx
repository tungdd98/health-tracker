import DeviceThermostatRoundedIcon from '@mui/icons-material/DeviceThermostatRounded';
import MonitorWeightRoundedIcon from '@mui/icons-material/MonitorWeightRounded';
import SentimentSatisfiedAltRoundedIcon from '@mui/icons-material/SentimentSatisfiedAltRounded';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { type MoodValue } from '@health-tracker/api';

import { BbtBottomSheet } from './bbt-bottom-sheet';
import { MoodBottomSheet } from './mood-bottom-sheet';
import { useDailyLog } from './use-daily-log';
import { useUserMoodImages } from './use-user-mood-images';
import { WeightBottomSheet } from './weight-bottom-sheet';

const LOG_CARD_HEIGHT = 90;

type DailyLogStripProps = {
  userId: string;
  date: string;
};

type LogCardProps = {
  icon: ReactNode;
  label: string;
  value: string | null;
  onClick: () => void;
};

const MOOD_EMOJI: Record<MoodValue, string> = {
  sad: '😔',
  neutral: '😐',
  happy: '😊',
  very_happy: '😄',
  tired: '😴',
};

const MOOD_LABELS: Record<MoodValue, string> = {
  sad: 'Buồn',
  neutral: 'Bình thường',
  happy: 'Vui',
  very_happy: 'Rất vui',
  tired: 'Mệt mỏi',
};

function LogCard({ icon, label, value, onClick }: LogCardProps) {
  const isFilled = value !== null;

  return (
    <Box
      component="button"
      onClick={onClick}
      sx={(theme) => ({
        alignItems: 'center',
        appearance: 'none',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid',
        borderColor: isFilled ? 'primary.main' : 'border.subtle',
        borderRadius: theme.appTokens.radius.xl,
        color: 'text.primary',
        cursor: 'pointer',
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        gap: 0.75,
        height: LOG_CARD_HEIGHT,
        justifyContent: 'center',
        px: 1.75,
        py: 1.75,
      })}
      type="button"
    >
      <Box
        sx={{
          alignItems: 'center',
          color: isFilled ? 'primary.main' : 'text.secondary',
          display: 'flex',
          fontSize: 22,
          height: 22,
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Typography color="text.secondary" sx={(theme) => theme.appTokens.typography.microLabel}>
        {label}
      </Typography>
      <Typography
        color={isFilled ? 'text.primary' : 'text.secondary'}
        sx={(theme) => ({
          ...theme.appTokens.typography.helper,
          fontWeight: isFilled ? 600 : 500,
          opacity: isFilled ? 1 : 0.72,
          textAlign: 'center',
        })}
      >
        {value ?? 'Chưa log'}
      </Typography>
    </Box>
  );
}

export function DailyLogStrip({ userId, date }: DailyLogStripProps) {
  const { log, isLoading, isPending, error, save, resetError } = useDailyLog(userId, date);
  const { moodImages, useAvatarMood, hasStickers } = useUserMoodImages(userId);
  const [openSheet, setOpenSheet] = useState<'bbt' | 'mood' | 'weight' | null>(null);

  const moodCardIcon = (() => {
    if (hasStickers && useAvatarMood && log?.mood && moodImages[log.mood]) {
      return (
        <Box
          alt={MOOD_LABELS[log.mood]}
          component="img"
          src={moodImages[log.mood]}
          sx={{ height: 22, width: 22, objectFit: 'contain' }}
        />
      );
    }
    return <SentimentSatisfiedAltRoundedIcon fontSize="inherit" />;
  })();

  if (isLoading) {
    return (
      <Stack direction="row" spacing={1}>
        {Array.from({ length: 3 }, (_, index) => (
          <Skeleton
            key={index}
            height={LOG_CARD_HEIGHT}
            sx={(theme) => ({ borderRadius: theme.appTokens.radius.xl, flex: 1 })}
            variant="rounded"
          />
        ))}
      </Stack>
    );
  }

  return (
    <>
      <Stack direction="row" spacing={1}>
        <LogCard
          icon={<DeviceThermostatRoundedIcon fontSize="inherit" />}
          label="BBT"
          onClick={() => {
            resetError();
            setOpenSheet('bbt');
          }}
          value={
            log?.bbtCelsius !== null && log?.bbtCelsius !== undefined
              ? `${log.bbtCelsius.toFixed(2)}°C`
              : null
          }
        />
        <LogCard
          icon={moodCardIcon}
          label="Tâm trạng"
          onClick={() => {
            resetError();
            setOpenSheet('mood');
          }}
          value={
            log?.mood
              ? hasStickers && useAvatarMood
                ? MOOD_LABELS[log.mood]
                : `${MOOD_EMOJI[log.mood]} ${MOOD_LABELS[log.mood]}`
              : null
          }
        />
        <LogCard
          icon={<MonitorWeightRoundedIcon fontSize="inherit" />}
          label="Cân nặng"
          onClick={() => {
            resetError();
            setOpenSheet('weight');
          }}
          value={
            log?.weightKg !== null && log?.weightKg !== undefined
              ? `${log.weightKg.toFixed(1)} kg`
              : null
          }
        />
      </Stack>

      <BbtBottomSheet
        currentLog={log}
        date={date}
        isMutating={isPending}
        mutationError={error}
        onClose={() => setOpenSheet(null)}
        onResetError={resetError}
        onSave={save}
        open={openSheet === 'bbt'}
      />
      <MoodBottomSheet
        currentLog={log}
        date={date}
        isMutating={isPending}
        moodImages={moodImages}
        mutationError={error}
        onClose={() => setOpenSheet(null)}
        onResetError={resetError}
        onSave={save}
        open={openSheet === 'mood'}
        useAvatarMood={useAvatarMood}
      />
      <WeightBottomSheet
        currentLog={log}
        date={date}
        isMutating={isPending}
        mutationError={error}
        onClose={() => setOpenSheet(null)}
        onResetError={resetError}
        onSave={save}
        open={openSheet === 'weight'}
      />
    </>
  );
}
