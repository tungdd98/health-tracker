# Task 04 — React Query hook

**Files:**

- Create: `apps/health-tracker-web/src/app/dashboard/use-daily-log.ts`

---

- [ ] **Step 1:** Create `use-daily-log.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getDailyLog,
  upsertDailyLog,
  type DailyLog,
  type DailyLogPatch,
} from '@health-tracker/api';

export const useDailyLog = (userId: string | undefined, date: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['daily-log', userId, date] as const;

  const { data: log, isLoading } = useQuery({
    queryKey,
    queryFn: () => getDailyLog(userId!, date),
    enabled: Boolean(userId),
    staleTime: 60 * 60 * 1000,
  });

  const { mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: (patch: DailyLogPatch) => upsertDailyLog(userId!, patch),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    log: (log ?? null) as DailyLog | null,
    isLoading,
    isPending,
    error: error as Error | null,
    save: mutateAsync,
    resetError: reset,
  };
};
```

- [ ] **Step 2:** Build verify

```bash
yarn build
```

Expected: No errors.

- [ ] **Step 3:** Commit

```bash
git add apps/health-tracker-web/src/app/dashboard/use-daily-log.ts
git commit -m "feat: add useDailyLog hook"
```
