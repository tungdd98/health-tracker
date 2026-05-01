import { Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';

import type { MoodValue } from '@health-tracker/api';

import { StickerPreviewGrid } from './sticker-preview-grid';
import { CloseRounded } from '@mui/icons-material';

type StickerPreviewDialogProps = {
  open: boolean;
  moodImages: Partial<Record<MoodValue, string>>;
  onClose: () => void;
};

export function StickerPreviewDialog({ open, moodImages, onClose }: StickerPreviewDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle sx={{ pr: 6 }}>
        Sticker đã tạo
        <IconButton
          aria-label="Đóng"
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', right: 12, top: 12 }}
        >
          <CloseRounded />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={1.5}>
          <Typography color="text.secondary" variant="body2">
            Đây là các sticker mới được tạo từ avatar của bạn.
          </Typography>
          <StickerPreviewGrid moodImages={moodImages} />
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
