import { Box, Stack, Typography } from '@mui/material';

import { MOOD_LABELS, type MoodValue } from '@health-tracker/api';

type StickerPreviewGridProps = {
  moodImages: Partial<Record<MoodValue, string>>;
};

const MOOD_ORDER: MoodValue[] = ['sad', 'neutral', 'happy', 'very_happy', 'tired'];

export function StickerPreviewGrid({ moodImages }: StickerPreviewGridProps) {
  const row1 = MOOD_ORDER.slice(0, 3);
  const row2 = MOOD_ORDER.slice(3);

  return (
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
  );
}

function StickerCard({ imageUrl, label }: { imageUrl: string | undefined; label: string }) {
  return (
    <Stack spacing={0.5} sx={{ alignItems: 'center', width: 80 }}>
      <Box
        sx={(theme) => ({
          alignItems: 'center',
          bgcolor: theme.palette.surface.accent,
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
      <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="caption">
        {label}
      </Typography>
    </Stack>
  );
}
