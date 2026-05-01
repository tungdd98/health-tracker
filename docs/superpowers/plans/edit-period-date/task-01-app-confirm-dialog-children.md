# Task 01 — Extend AppConfirmDialog with children slot

**File:** `apps/health-tracker-web/src/app/components/app-confirm-dialog.tsx`

`AppConfirmDialog` currently renders only a `description` string in its content stack. Task 02 needs to embed a `DatePicker` there. Add an optional `children` prop that renders below the description (and above the error alert).

---

- [ ] **Step 1: Add `children` to the props type and render it**

Replace the file content with:

```tsx
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';

import { AppSubmitButton } from '@health-tracker/ui';

type AppConfirmDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  icon?: ReactNode;
  children?: ReactNode;
  errorMessage?: string;
  isSubmitting?: boolean;
  cancelLabel?: string;
  confirmLabel: string;
  confirmColor?: 'primary' | 'error';
  confirmDisabled?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
};

export function AppConfirmDialog({
  open,
  title,
  description,
  icon,
  children,
  errorMessage,
  isSubmitting = false,
  cancelLabel = 'Huỷ',
  confirmLabel,
  confirmColor = 'primary',
  confirmDisabled = false,
  onCancel,
  onConfirm,
}: AppConfirmDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={isSubmitting ? undefined : onCancel}>
      <DialogContent sx={{ pb: 2, pt: 3.5, px: 3 }}>
        <Stack spacing={1.5}>
          {icon ? <Box sx={{ mb: 0.25 }}>{icon}</Box> : null}
          <DialogTitle sx={{ p: 0 }}>{title}</DialogTitle>
          {description ? (
            <Typography color="text.secondary" variant="body2">
              {description}
            </Typography>
          ) : null}
          {children}
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
        <AppSubmitButton
          color={confirmColor}
          disabled={confirmDisabled}
          fullWidth
          loading={isSubmitting}
          loadingIndicatorSize={16}
          onClick={() => void onConfirm()}
          variant="contained"
        >
          {confirmLabel}
        </AppSubmitButton>
      </DialogActions>
    </Dialog>
  );
}
```

Two additions vs the original:

- `children?: ReactNode` in props + rendered between description and error alert.
- `confirmDisabled?: boolean` forwarded to `AppSubmitButton` — needed by Task 02.

- [ ] **Step 2: Verify lint and build pass**

```bash
yarn lint
yarn build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/health-tracker-web/src/app/components/app-confirm-dialog.tsx
git commit -m "feat: add children slot and confirmDisabled prop to AppConfirmDialog"
```
