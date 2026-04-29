import { Box, Stack, Typography } from '@mui/material';

import type { MoodValue } from '@health-tracker/api';
import { AppSubmitButton } from '@health-tracker/ui';

type OnboardingWowScreenProps = {
  moodImages: Partial<Record<MoodValue, string>>;
  onContinue: () => void;
};

const MOOD_LABELS: Record<MoodValue, string> = {
  sad: 'Buồn',
  neutral: 'Bình thường',
  happy: 'Vui',
  very_happy: 'Rất vui',
  tired: 'Mệt mỏi',
};

const MOOD_ORDER: MoodValue[] = ['sad', 'neutral', 'happy', 'very_happy', 'tired'];

export function OnboardingWowScreen({ moodImages, onContinue }: OnboardingWowScreenProps) {
  const row1 = MOOD_ORDER.slice(0, 3);
  const row2 = MOOD_ORDER.slice(3);

  return (
    <Stack
      spacing={3}
      sx={{ alignItems: 'center', minHeight: '100dvh', justifyContent: 'center', px: 3, py: 4 }}
    >
      <Stack spacing={0.5} sx={{ textAlign: 'center' }}>
        <Typography sx={(theme) => theme.appTokens.typography.pageTitle}>
          Sticker của bạn đây!
        </Typography>
        <Typography color="text.secondary" variant="body2">
          Những biểu cảm được tạo từ avatar của bạn
        </Typography>
      </Stack>

      <Stack spacing={2} sx={{ width: '100%' }}>
        <Stack direction="row" justifyContent="center" spacing={2}>
          {row1.map((mood) => (
            <StickerCard imageUrl={moodImages[mood]} key={mood} label={MOOD_LABELS[mood]} />
          ))}
        </Stack>
        <Stack direction="row" justifyContent="center" spacing={2}>
          {row2.map((mood) => (
            <StickerCard imageUrl={moodImages[mood]} key={mood} label={MOOD_LABELS[mood]} />
          ))}
        </Stack>
      </Stack>

      <Box sx={{ width: '100%' }}>
        <AppSubmitButton fullWidth onClick={onContinue} variant="contained">
          Tiếp tục
        </AppSubmitButton>
      </Box>
    </Stack>
  );
}

function StickerCard({ imageUrl, label }: { imageUrl: string | undefined; label: string }) {
  return (
    <Stack spacing={0.5} sx={{ alignItems: 'center', width: 80 }}>
      <Box
        sx={(theme) => ({
          alignItems: 'center',
          bgcolor: theme.palette.surface.subtle,
          borderRadius: theme.appTokens.radius.lg,
          display: 'flex',
          height: 80,
          justifyContent: 'center',
          overflow: 'hidden',
          width: 80,
        })}
      >
        {imageUrl ? (
          <Box
            alt={label}
            component="img"
            src={imageUrl}
            sx={{ height: '100%', objectFit: 'contain', width: '100%' }}
          />
        ) : null}
      </Box>
      <Typography
        color="text.secondary"
        sx={(theme) => ({ ...theme.appTokens.typography.microLabel, textAlign: 'center' })}
      >
        {label}
      </Typography>
    </Stack>
  );
}
