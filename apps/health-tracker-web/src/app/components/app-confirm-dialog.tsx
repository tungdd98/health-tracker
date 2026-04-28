import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';

type AppConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  errorMessage?: string;
  isSubmitting?: boolean;
  cancelLabel?: string;
  confirmLabel: string;
  confirmLoadingLabel?: string;
  confirmColor?: 'primary' | 'error';
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
};

export function AppConfirmDialog({
  open,
  title,
  description,
  icon,
  errorMessage,
  isSubmitting = false,
  cancelLabel = 'Huỷ',
  confirmLabel,
  confirmLoadingLabel,
  confirmColor = 'primary',
  onCancel,
  onConfirm,
}: AppConfirmDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={isSubmitting ? undefined : onCancel}
      PaperProps={{
        sx: {
          borderRadius: '32px',
        },
      }}
    >
      <DialogContent sx={{ pb: 2, pt: 3.5, px: 3 }}>
        <Stack spacing={1.5}>
          {icon ? <Box sx={{ mb: 0.25 }}>{icon}</Box> : null}
          <DialogTitle sx={{ p: 0 }}>{title}</DialogTitle>
          {description ? (
            <Typography color="text.secondary" sx={{ lineHeight: 1.5 }}>
              {description}
            </Typography>
          ) : null}
          {errorMessage ? (
            <Alert color="error" sx={{ mt: 0.5 }} variant="filled">
              {errorMessage}
            </Alert>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ gap: 1.5, px: 3, pb: 3, pt: 1 }}>
        <Button disabled={isSubmitting} fullWidth onClick={onCancel} variant="outlined">
          {cancelLabel}
        </Button>
        <Button
          color={confirmColor}
          disabled={isSubmitting}
          fullWidth
          onClick={() => void onConfirm()}
          variant="contained"
        >
          <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
            {isSubmitting ? <CircularProgress color="inherit" size={16} /> : null}
            {isSubmitting && confirmLoadingLabel ? confirmLoadingLabel : confirmLabel}
          </Box>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
