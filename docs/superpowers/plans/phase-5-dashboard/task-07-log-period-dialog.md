### Task 07: Implement LogPeriodDialog

> **Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen`
> Frames to read: `log-period-dialog-idle` (1GzPh), `log-period-dialog-error` (7w0ma)
>
> Open the `.pen` file in Pencil and read both frames before writing a single line of JSX.

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/log-period-dialog.tsx`

- [ ] **Step 1: Open Pencil and read both dialog frames**

Open `docs/superpowers/designs/2026-04-26-dashboard.pen` in Pencil. Read frames `log-period-dialog-idle` (1GzPh) and `log-period-dialog-error` (7w0ma). Note button placement, spinner position, inline error message location under body text.

- [ ] **Step 2: Create `log-period-dialog.tsx`**

```tsx
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { DateTime } from 'luxon';

import { updateOnboardingProfile } from '@health-tracker/api';

type LogPeriodDialogProps = {
  open: boolean;
  user: User;
  onClose: () => void;
  onSuccess: () => void;
};

export function LogPeriodDialog({ open, user, onClose, onSuccess }: LogPeriodDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleClose = () => {
    if (isSubmitting) return;
    setErrorMessage('');
    onClose();
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    const { error } = await updateOnboardingProfile(user, {
      lastPeriodStartDate: DateTime.local().toISODate() ?? null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage('Khong luu duoc. Vui long thu lai.');
      return;
    }

    onClose();
    onSuccess();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle>Xac nhan ky kinh moi</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Danh dau hom nay la ngay bat dau ky kinh moi? He thong se cap nhat du doan chu ky.
        </DialogContentText>
        {errorMessage ? (
          <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1.5 }}>
            {errorMessage}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button disabled={isSubmitting} onClick={handleClose}>
          Huy
        </Button>
        <Button disabled={isSubmitting} onClick={handleConfirm} variant="contained">
          <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
            {isSubmitting ? <CircularProgress color="inherit" size={16} /> : null}
            Xac nhan
          </Box>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

> Replace all romanized ASCII strings with proper Vietnamese strings with diacritics at implementation time.

- [ ] **Step 3: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/log-period-dialog.tsx
git commit -m "feat: add LogPeriodDialog with inline error state"
```

- [ ] **Step 5: Mark complete in index.md**

Check off Task 07 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
