### Task 06: Implement CycleHero component

> **Design:** `docs/superpowers/designs/2026-04-26-dashboard.pen`
> Frames to read: `dashboard-predict` (aoNGi), `dashboard-overdue` (T25NG), `dashboard-stale` (wbhSh), `dashboard-nudge` (cz7cg), `dashboard-loading` (kfqEh)
>
> Open the `.pen` file in Pencil and read all 5 frames before writing a single line of JSX.

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/cycle-hero.tsx`

- [ ] **Step 1: Open Pencil and read the 5 hero frames**

Open `docs/superpowers/designs/2026-04-26-dashboard.pen` in Pencil. Read frames `dashboard-predict`, `dashboard-overdue`, `dashboard-stale`, `dashboard-nudge`, `dashboard-loading`. Note layout, SVG ring structure, center text hierarchy, stale banner placement, nudge card body, and skeleton shape.

- [ ] **Step 2: Create `cycle-hero.tsx`**

```tsx
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { AppCard } from '@health-tracker/ui';

import type { CycleHeroMode } from './cycle-hero-modes';
import { PHASE_COLOR_TOKENS, type CycleSnapshot } from './cycle-utils';

// --- SVG arc helpers ---

const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string => {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
};

// --- Countdown line ---

const getCountdownLine = (snapshot: CycleSnapshot): string => {
  if (snapshot.isFertileWindow && snapshot.daysUntilFertileEnd !== null) {
    return `Cua so thu thai ket thuc · con ${snapshot.daysUntilFertileEnd} ngay`;
  }
  if (snapshot.daysUntilFertileStart !== null) {
    return `Cua so thu thai bat dau · con ${snapshot.daysUntilFertileStart} ngay`;
  }
  return `Ky kinh tiep theo · con ${snapshot.daysUntilNextPeriod} ngay`;
};
```

> Note: The countdown strings above use romanized ASCII. Replace them with proper Vietnamese strings with diacritics at implementation time — cSpell warnings in `.tsx` files are cosmetic and do not affect lint or build.

```tsx
// --- Ring SVG ---

type CycleRingProps = { snapshot: CycleSnapshot };

function CycleRing({ snapshot }: CycleRingProps) {
  const CX = 100;
  const CY = 100;
  const R = 80;
  const SW = 14;
  const { dayOfCycle, phase } = snapshot;
  // cycleLengthDays reconstructed from snapshot fields
  const cycleLength = dayOfCycle + snapshot.daysUntilNextPeriod - 1;

  const menstrualEndDeg = (5 / cycleLength) * 360;
  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;
  const fertileStartDeg = ((fertileStart - 1) / cycleLength) * 360;
  const fertileEndDeg = (fertileEnd / cycleLength) * 360;
  const markerDeg = ((dayOfCycle - 1) / cycleLength) * 360;
  const marker = polarToCartesian(CX, CY, R, markerDeg);

  const phaseBadge = {
    menstrual: 'PHA KY KINH',
    follicular: 'PHA TIEN RUNG TRUNG',
    fertile: 'CUA SO THU THAI',
    luteal: 'PHA HOANG THE',
  }[phase];

  return (
    <svg viewBox="0 0 200 200" width={200} height={200}>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="#EEEEEE" strokeWidth={SW} />
      <path
        d={describeArc(CX, CY, R, 0, menstrualEndDeg)}
        fill="none"
        stroke={PHASE_COLOR_TOKENS.menstrual}
        strokeWidth={SW}
        strokeLinecap="round"
      />
      <path
        d={describeArc(CX, CY, R, fertileStartDeg, fertileEndDeg)}
        fill="none"
        stroke={PHASE_COLOR_TOKENS.fertile}
        strokeWidth={SW}
        strokeLinecap="round"
      />
      <circle
        cx={marker.x}
        cy={marker.y}
        r={8}
        fill={PHASE_COLOR_TOKENS[phase]}
        stroke="white"
        strokeWidth={2}
      />
      <text
        x={CX}
        y={84}
        textAnchor="middle"
        fontSize={9}
        fill="#888888"
        fontWeight={700}
        letterSpacing={1}
      >
        {phaseBadge}
      </text>
      <text x={CX} y={108} textAnchor="middle" fontSize={22} fill="#222222" fontWeight={700}>
        {`Ngay ${dayOfCycle}`}
      </text>
      <text x={CX} y={126} textAnchor="middle" fontSize={11} fill="#888888">
        {`/ ${cycleLength}`}
      </text>
    </svg>
  );
}

// --- Main component ---

type CycleHeroProps = {
  mode: CycleHeroMode;
  snapshot: CycleSnapshot | null;
  isLoading: boolean;
  onLogPeriod: () => void;
};

export function CycleHero({ mode, snapshot, isLoading, onLogPeriod }: CycleHeroProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <AppCard sx={{ p: 3 }}>
        <Stack alignItems="center" spacing={2}>
          <Skeleton variant="circular" width={200} height={200} />
          <Skeleton variant="text" width={180} height={20} />
          <Skeleton variant="text" width={140} height={16} />
        </Stack>
      </AppCard>
    );
  }

  if (mode === 'nudge' || snapshot === null) {
    return (
      <AppCard sx={{ p: 3 }}>
        <Stack alignItems="center" spacing={2} textAlign="center">
          <Typography variant="h6" fontWeight={700}>
            Bo sung thong tin chu ky de xem du doan hom nay
          </Typography>
          <Button
            onClick={() => navigate('/settings')}
            startIcon={<SettingsRoundedIcon />}
            variant="contained"
          >
            Mo cai dat
          </Button>
        </Stack>
      </AppCard>
    );
  }

  const countdownLine = getCountdownLine(snapshot);
  const showLogCta = mode === 'overdue' || mode === 'stale';

  return (
    <AppCard sx={{ p: 3, overflow: 'hidden' }}>
      {mode === 'stale' && (
        <Alert severity="warning" sx={{ mb: 2, fontSize: 12 }}>
          Du lieu chu ky co ve cu — hay cap nhat de du doan chinh xac hon.
        </Alert>
      )}
      <Stack alignItems="center" spacing={1.5}>
        <CycleRing snapshot={snapshot} />
        <Typography variant="body2" color="text.secondary" textAlign="center">
          {countdownLine}
        </Typography>
        {showLogCta && (
          <Button onClick={onLogPeriod} variant="outlined" size="small" sx={{ mt: 0.5 }}>
            Danh dau ky kinh moi hom nay
          </Button>
        )}
      </Stack>
    </AppCard>
  );
}
```

> Replace all romanized ASCII strings (countdown line, nudge text, stale banner, button labels) with proper Vietnamese strings with diacritics. cSpell warnings are cosmetic — lint and build are unaffected.

- [ ] **Step 3: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/cycle-hero.tsx
git commit -m "feat: add CycleHero component with SVG ring and 4 modes"
```

- [ ] **Step 5: Mark complete in index.md**

Check off Task 06 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
