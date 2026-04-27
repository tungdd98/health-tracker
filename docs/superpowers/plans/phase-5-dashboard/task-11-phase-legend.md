### Task 11: Implement PhaseLegend

> **Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen` — frame `calendar-with-data` (KjasN)
>
> Open the `.pen` file in Pencil and read frame `calendar-with-data` before writing any JSX. Focus on the legend: four chips in a row, each with a colored dot and a label.

**Files:**

- Create: `apps/health-tracker-web/src/app/calendar/phase-legend.tsx`

- [ ] **Step 1: Open Pencil and read `calendar-with-data` frame**

Confirm: 4 chips, dot size, label text, spacing. Labels: Ky kinh / Tien rung trung / Cua so thu thai / Hoang the (proper Vietnamese with diacritics).

- [ ] **Step 2: Create `phase-legend.tsx`**

```tsx
import { Box, Stack, Typography } from '@mui/material';

import { PHASE_COLOR_TOKENS, type CyclePhase } from '../dashboard/cycle-utils';

const PHASES: CyclePhase[] = ['menstrual', 'follicular', 'fertile', 'luteal'];

const PHASE_LEGEND_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Ky kinh',
  follicular: 'Tien rung trung',
  fertile: 'Cua so thu thai',
  luteal: 'Hoang the',
};

export function PhaseLegend() {
  return (
    <Stack direction="row" flexWrap="wrap" gap={1.5}>
      {PHASES.map((phase) => (
        <Stack key={phase} alignItems="center" direction="row" gap={0.75}>
          <Box
            sx={{
              bgcolor: PHASE_COLOR_TOKENS[phase],
              borderRadius: '50%',
              flexShrink: 0,
              height: 10,
              width: 10,
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {PHASE_LEGEND_LABELS[phase]}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
```

> Replace romanized label strings with proper Vietnamese: "Kỳ kinh", "Tiền rụng trứng", "Cửa sổ thụ thai", "Hoàng thể".

- [ ] **Step 3: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/health-tracker-web/src/app/calendar/phase-legend.tsx
git commit -m "feat: add PhaseLegend component"
```

- [ ] **Step 5: Mark complete in index.md**

Check off Task 11 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
