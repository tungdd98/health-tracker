### Task 09: Implement TipOfDay card

> **Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen` — frame `dashboard-predict` (aoNGi)
>
> Open the `.pen` file in Pencil and read frame `dashboard-predict` before writing any JSX. Focus on the tip card: overline label, body text styling, card padding.

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/tip-of-day.tsx`

- [ ] **Step 1: Open Pencil and read `dashboard-predict` frame**

Locate the tip card section. Confirm: overline reads "Meo hom nay" (proper Vietnamese: "Mẹo hôm nay"), body is one short phrase.

- [ ] **Step 2: Create `tip-of-day.tsx`**

```tsx
import { Skeleton, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';

import { AppCard } from '@health-tracker/ui';

import { pickTip } from './tip-library';
import type { CyclePhase } from './cycle-utils';

type TipOfDayProps = {
  phase: CyclePhase;
  isLoading: boolean;
};

export function TipOfDay({ phase, isLoading }: TipOfDayProps) {
  if (isLoading) {
    return (
      <AppCard sx={{ p: 2.5 }}>
        <Skeleton variant="text" width={80} height={16} />
        <Skeleton variant="text" width="100%" height={20} sx={{ mt: 0.5 }} />
        <Skeleton variant="text" width="70%" height={20} />
      </AppCard>
    );
  }

  const tip = pickTip(phase, DateTime.local());

  return (
    <AppCard sx={{ p: 2.5 }}>
      <Stack spacing={0.5}>
        <Typography variant="overline" color="primary.main">
          Meo hom nay
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tip}
        </Typography>
      </Stack>
    </AppCard>
  );
}
```

> Replace "Meo hom nay" with "Mẹo hôm nay" (Vietnamese with diacritics) at implementation time.

- [ ] **Step 3: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/tip-of-day.tsx
git commit -m "feat: add TipOfDay card component"
```

- [ ] **Step 5: Mark complete in index.md**

Check off Task 09 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
