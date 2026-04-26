import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type SignOutConfirmDialogProps = {
  open: boolean;
  isSubmitting: boolean;
  errorMessage?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
};

export function SignOutConfirmDialog({
  open,
  isSubmitting,
  errorMessage,
  onCancel,
  onConfirm,
}: SignOutConfirmDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={isSubmitting ? undefined : onCancel}>
      <DialogTitle>Xác nhận đăng xuất</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Hoàng Thượng có chắc muốn đăng xuất khỏi phiên hiện tại không?
        </DialogContentText>
        {errorMessage ? (
          <Alert color="error" sx={{ mt: 2 }} variant="filled">
            {errorMessage}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button disabled={isSubmitting} onClick={onCancel} variant="text">
          Hủy
        </Button>
        <Button
          color="error"
          disabled={isSubmitting}
          onClick={() => void onConfirm()}
          variant="contained"
        >
          <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
            {isSubmitting ? <CircularProgress color="inherit" size={16} /> : null}
            {isSubmitting ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </Box>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
