# Task 02 — Create `useDayDetail` hook

**Files:**

- Create: `apps/health-tracker-web/src/app/calendar/use-day-detail.ts`

Reference: `apps/health-tracker-web/src/app/dashboard/use-daily-log.ts` (same query pattern, read-only subset).

---

- [ ] **Step 1: Create the file**

```ts
import { useQuery } from '@tanstack/react-query';

import { getDailyLog, type DailyLog } from '@health-tracker/api';

export const useDayDetail = (userId: string | undefined, date: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: ['daily-log', userId, date],
    queryFn: () => getDailyLog(userId!, date!),
    enabled: Boolean(userId) && Boolean(date),
    staleTime: 60 * 60 * 1000,
  });

  return {
    log: (data ?? null) as DailyLog | null,
    isLoading,
  };
};
```

The query key `['daily-log', userId, date]` is intentionally the same as in `use-daily-log.ts`. This means the calendar sheet reuses cached data from the dashboard for the same date — no extra network request.

- [ ] **Step 2: Commit**

```bash
git add apps/health-tracker-web/src/app/calendar/use-day-detail.ts
git commit -m "feat(calendar): add useDayDetail read-only query hook"
```
