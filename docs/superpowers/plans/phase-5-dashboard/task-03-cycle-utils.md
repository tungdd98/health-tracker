### Task 03: Implement cycle math helpers

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/cycle-utils.ts`

- [ ] **Step 1: Create `cycle-utils.ts`**

```typescript
import { DateTime } from 'luxon';

export const PERIOD_LENGTH_DAYS = 5;
export const LUTEAL_LENGTH_DAYS = 14;
export const FERTILE_WINDOW_BEFORE_OVULATION = 5;
export const FERTILE_WINDOW_AFTER_OVULATION = 1;

export type CyclePhase = 'menstrual' | 'follicular' | 'fertile' | 'luteal';

export type CycleSnapshot = {
  dayOfCycle: number;
  phase: CyclePhase;
  isOvulationDay: boolean;
  isFertileWindow: boolean;
  daysSinceLastPeriod: number;
  daysUntilNextPeriod: number;
  daysUntilFertileEnd: number | null;
  daysUntilFertileStart: number | null;
  isOverdue: boolean;
  isStale: boolean;
};

export const PHASE_COLOR_TOKENS: Record<CyclePhase, string> = {
  menstrual: '#F08080',
  follicular: '#F8C8C8',
  fertile: '#FF8A65',
  luteal: '#C9B8E0',
};

export const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Ky kinh',
  follicular: 'Tien rung trung',
  fertile: 'Cua so thu thai',
  luteal: 'Hoang the',
};

export const PHASE_BADGE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'PHA KY KINH',
  follicular: 'PHA TIEN RUNG TRUNG',
  fertile: 'CUA SO THU THAI',
  luteal: 'PHA HOANG THE',
};

// Luxon weekday: 1=Mon..7=Sun -> maps to T2..CN
export const VN_WEEKDAY_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;

export const getWeekdayShort = (date: DateTime): string => VN_WEEKDAY_SHORT[date.weekday - 1];

type ComputeInput = {
  cycleLengthDays: number;
  lastPeriodStartDate: DateTime;
  targetDate: DateTime;
};

export function computeCycleSnapshot(input: ComputeInput): CycleSnapshot | null {
  const { cycleLengthDays, lastPeriodStartDate, targetDate } = input;

  const daysSinceLastPeriod = Math.floor(
    targetDate.startOf('day').diff(lastPeriodStartDate.startOf('day'), 'days').days,
  );

  if (daysSinceLastPeriod < 0) return null;

  const dayOfCycle = (daysSinceLastPeriod % cycleLengthDays) + 1;

  const ovulationDay = cycleLengthDays - LUTEAL_LENGTH_DAYS;
  const fertileStart = ovulationDay - FERTILE_WINDOW_BEFORE_OVULATION;
  const fertileEnd = ovulationDay + FERTILE_WINDOW_AFTER_OVULATION;

  let phase: CyclePhase;
  if (dayOfCycle <= PERIOD_LENGTH_DAYS) {
    phase = 'menstrual';
  } else if (dayOfCycle >= fertileStart && dayOfCycle <= fertileEnd) {
    phase = 'fertile';
  } else if (dayOfCycle < fertileStart) {
    phase = 'follicular';
  } else {
    phase = 'luteal';
  }

  const isFertileWindow = dayOfCycle >= fertileStart && dayOfCycle <= fertileEnd;
  const isOvulationDay = dayOfCycle === ovulationDay;
  const daysUntilNextPeriod = cycleLengthDays - dayOfCycle + 1;
  const daysUntilFertileEnd = isFertileWindow ? fertileEnd - dayOfCycle : null;
  const daysUntilFertileStart =
    !isFertileWindow && dayOfCycle < fertileStart ? fertileStart - dayOfCycle : null;
  const isOverdue = daysSinceLastPeriod >= cycleLengthDays - 2;
  const isStale = daysSinceLastPeriod > 2 * cycleLengthDays;

  return {
    dayOfCycle,
    phase,
    isOvulationDay,
    isFertileWindow,
    daysSinceLastPeriod,
    daysUntilNextPeriod,
    daysUntilFertileEnd,
    daysUntilFertileStart,
    isOverdue,
    isStale,
  };
}
```

> Note: `PHASE_LABELS` and `PHASE_BADGE_LABELS` use ASCII-safe romanized strings in the source file to avoid cSpell false positives in the IDE. The actual Vietnamese strings with diacritics go into JSX text nodes (not as object keys or string literals in .ts files) so they render correctly in the UI.

- [ ] **Step 2: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/cycle-utils.ts
git commit -m "feat: add cycle math helpers (computeCycleSnapshot, PHASE_COLOR_TOKENS)"
```

- [ ] **Step 4: Mark complete in index.md**

Check off Task 03 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
