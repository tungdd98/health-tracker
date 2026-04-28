import { AppConfirmDialog } from './app-confirm-dialog';

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
    <AppConfirmDialog
      cancelLabel="Huỷ"
      confirmLabel="Đăng xuất"
      description="Hoàng Thượng có chắc muốn đăng xuất khỏi phiên hiện tại không?"
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onCancel={onCancel}
      onConfirm={onConfirm}
      open={open}
      title="Xác nhận đăng xuất"
    />
  );
}
