# Task 02 — Upgrade LogPeriodDialog with DatePicker

**File:** `apps/health-tracker-web/src/app/dashboard/log-period-dialog.tsx`

**Depends on:** Task 01 (uses `children` + `confirmDisabled` from `AppConfirmDialog`)

Replace the hardcoded `DateTime.local().toISODate()` submit with a user-controlled `DatePicker`.

- `mode='log'` → title "Xác nhận kỳ kinh mới", date defaults to today.
- `mode='edit'` → title "Chỉnh sửa ngày bắt đầu", date defaults to `initialDate`.
- `minDate`: today minus 90 days. `maxDate`: today. Confirm disabled when date is null or out of range.

The `DatePicker` component pattern follows `libs/forms/src/lib/form-date-field.tsx` — same import path, same `enableAccessibleFieldDOMStructure={false}`, same `format="dd/MM/yyyy"`, same `TextField` slot. This dialog is not inside an RHF context, so state is plain `useState`.

---

- [ ] **Step 1: Replace the file with the upgraded implementation**

```tsx
import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { User } from '@supabase/supabase-js';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';

import { mapAuthErrorToMessage, updateOnboardingProfile } from '@health-tracker/api';
import { OpacityRounded } from '@mui/icons-material';
import { Box } from '@mui/material';
import { AppConfirmDialog } from '../components/app-confirm-dialog';

type LogPeriodDialogProps = {
  open: boolean;
  user: User;
  initialDate: string;
  mode: 'log' | 'edit';
  onClose: () => void;
  onSuccess: () => void;
};

export function LogPeriodDialog({
  open,
  user,
  initialDate,
  mode,
  onClose,
  onSuccess,
}: LogPeriodDialogProps) {
  const today = DateTime.local().startOf('day');
  const minDate = today.minus({ days: 90 });

  const [selectedDate, setSelectedDate] = useState<DateTime | null>(
    DateTime.fromISO(initialDate).isValid ? DateTime.fromISO(initialDate) : today,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (open) {
      setErrorMessage('');
      setSelectedDate(
        DateTime.fromISO(initialDate).isValid ? DateTime.fromISO(initialDate) : today,
      );
    }
  }, [open, initialDate]);

  const isDateValid =
    selectedDate !== null &&
    selectedDate.isValid &&
    selectedDate >= minDate &&
    selectedDate <= today;

  const handleClose = () => {
    if (isSubmitting) return;
    setErrorMessage('');
    onClose();
  };

  const handleConfirm = async () => {
    if (!isDateValid || !selectedDate) return;

    setIsSubmitting(true);
    setErrorMessage('');

    const { error } = await updateOnboardingProfile(user, {
      lastPeriodStartDate: selectedDate.toISODate() ?? null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(mapAuthErrorToMessage(error) || 'Không lưu được. Vui lòng thử lại.');
      return;
    }

    onSuccess();
  };

  const title = mode === 'edit' ? 'Chỉnh sửa ngày bắt đầu' : 'Xác nhận kỳ kinh mới';

  return (
    <AppConfirmDialog
      cancelLabel="Huỷ"
      confirmDisabled={!isDateValid || isSubmitting}
      confirmLabel="Xác nhận"
      errorMessage={errorMessage}
      icon={
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            bgcolor: theme.palette.surface.accent,
            borderRadius: theme.appTokens.radius.pill,
            display: 'flex',
            height: 48,
            justifyContent: 'center',
            width: 48,
          })}
        >
          <OpacityRounded color="primary" sx={{ fontSize: 22 }} />
        </Box>
      }
      isSubmitting={isSubmitting}
      onCancel={handleClose}
      onConfirm={() => void handleConfirm()}
      open={open}
      title={title}
    >
      <DatePicker
        enableAccessibleFieldDOMStructure={false}
        format="dd/MM/yyyy"
        label="Ngày bắt đầu"
        maxDate={today}
        minDate={minDate}
        value={selectedDate}
        onChange={(value) => setSelectedDate(value)}
        slotProps={{
          textField: {
            fullWidth: true,
          },
        }}
        slots={{
          textField: TextField,
        }}
      />
    </AppConfirmDialog>
  );
}
```

- [ ] **Step 2: Verify lint and build pass**

```bash
yarn lint
yarn build
```

Expected: no errors. TypeScript will flag a compile error if `initialDate` or `mode` are missing at the call site in `dashboard-page.tsx` — that is expected and will be fixed in Task 04.

- [ ] **Step 3: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/log-period-dialog.tsx
git commit -m "feat: add date picker to LogPeriodDialog with mode-aware title"
```
