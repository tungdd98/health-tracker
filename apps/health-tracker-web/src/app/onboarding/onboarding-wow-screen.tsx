import { Box, Stack, Typography } from '@mui/material';

import type { MoodValue } from '@health-tracker/api';
import { AppSubmitButton } from '@health-tracker/ui';

import { StickerPreviewGrid } from '../components/sticker-preview-grid';

type OnboardingWowScreenProps = {
  moodImages: Partial<Record<MoodValue, string>>;
  onContinue: () => void;
};

export function OnboardingWowScreen({ moodImages, onContinue }: OnboardingWowScreenProps) {
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

      <StickerPreviewGrid moodImages={moodImages} />

      <Box sx={{ width: '100%' }}>
        <AppSubmitButton fullWidth onClick={onContinue} variant="contained">
          Tiếp tục
        </AppSubmitButton>
      </Box>
    </Stack>
  );
}
