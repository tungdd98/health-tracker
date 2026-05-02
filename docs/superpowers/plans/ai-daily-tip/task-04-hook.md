# Task 04 — Frontend Hook

**Goal:** Create `useDailyTip` — a React Query hook that fetches today's cached tip from DB, calls the Edge Function on cache miss, and silently falls back to the static `tip-library.ts` on any error.

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/use-daily-tip.ts`

**Reference patterns:**

- `generateDailyTip`, `getDailyTip` — exported from `@health-tracker/api` (Task 02)
- `pickTip` — `apps/health-tracker-web/src/app/dashboard/tip-library.ts`
- `CyclePhase` — `apps/health-tracker-web/src/app/dashboard/cycle-utils.ts`
- React Query usage — any existing `useQuery` call in the app, e.g. `apps/health-tracker-web/src/app/dashboard/medication-strip.tsx`

---

- [ ] **Step 1: Create `apps/health-tracker-web/src/app/dashboard/use-daily-tip.ts`**

```typescript
import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { generateDailyTip, getDailyTip } from '@health-tracker/api';

import type { CyclePhase } from './cycle-utils';
import { pickTip } from './tip-library';

export function useDailyTip(
  userId: string,
  phase: CyclePhase,
  date: string,
): { tip: string; isLoading: boolean } {
  const { data: tip, isLoading } = useQuery({
    queryKey: ['daily-tip', userId, date],
    queryFn: async () => {
      const cached = await getDailyTip(userId, date);
      if (cached) return cached;
      return generateDailyTip(phase, date);
    },
    staleTime: Infinity,
    retry: 1,
  });

  return {
    tip: tip ?? pickTip(phase, DateTime.local()),
    isLoading,
  };
}
```

**Key decisions:**

- `staleTime: Infinity` — the query key includes `date` (e.g. `"2026-05-02"`), so a new calendar day automatically produces a new query key, invalidating the previous day's cached result without any manual invalidation.
- `retry: 1` — one retry on transient network failure, then falls through to the static fallback via `tip ?? pickTip(...)`.
- The static fallback (`pickTip`) is returned whenever `tip` is `undefined` — this covers both the loading state (skeleton is shown via `isLoading`) and error states (silent fallback, no visible change to user).

- [ ] **Step 2: Verify lint and build**

```bash
yarn lint
yarn build
```

Expected: no TypeScript or lint errors.

- [ ] **Step 3: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/use-daily-tip.ts
git commit -m "feat(dashboard): add useDailyTip hook with static fallback"
```
