### Task 05: Implement cycle hero mode derivation

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/cycle-hero-modes.ts`

- [x] **Step 1: Create `cycle-hero-modes.ts`**

```typescript
import type { CycleSnapshot } from './cycle-utils';

export type CycleHeroMode = 'nudge' | 'predict' | 'overdue' | 'stale';

export function deriveCycleHeroMode(snapshot: CycleSnapshot | null): CycleHeroMode {
  if (snapshot === null) return 'nudge';
  if (snapshot.isStale) return 'stale';
  if (snapshot.isOverdue) return 'overdue';
  return 'predict';
}
```

- [x] **Step 2: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [x] **Step 3: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/cycle-hero-modes.ts
git commit -m "feat: add cycle hero mode derivation"
```

- [x] **Step 4: Mark complete in index.md**

Check off Task 05 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
