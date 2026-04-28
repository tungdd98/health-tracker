# Task 09 — Wire DailyLogStrip into dashboard-page

**Design:** Frames `dashboard-predict` (aoNGi), `dashboard-overdue` (T25NG), `dashboard-stale` (wbhSh) — DailyLogStrip appears below CycleHero, before TipOfDay.

**Files:**

- Modify: `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx`

---

- [ ] **Step 1:** Add import for `DailyLogStrip`

```typescript
import { DailyLogStrip } from './daily-log-strip';
```

Add `Skeleton` to the existing MUI import if not already present:

```typescript
import { Alert, Button, Skeleton, Snackbar, Stack, Typography } from '@mui/material';
```

- [ ] **Step 2:** Inside `<Stack spacing={2}>`, after `<CycleHero ... />` and before the TipOfDay block, insert:

```tsx
{
  !isAuthResolved ? (
    <Stack direction="row" spacing={1}>
      <Skeleton variant="rounded" height={80} sx={{ flex: 1, borderRadius: 2.5 }} />
      <Skeleton variant="rounded" height={80} sx={{ flex: 1, borderRadius: 2.5 }} />
      <Skeleton variant="rounded" height={80} sx={{ flex: 1, borderRadius: 2.5 }} />
    </Stack>
  ) : user ? (
    <DailyLogStrip userId={user.id} date={today.toISODate()!} />
  ) : null;
}
```

- [ ] **Step 3:** Definition of Done

```bash
yarn format
yarn lint
yarn build
```

All three must pass with zero errors.

- [ ] **Step 4:** Commit

```bash
git add apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx
git commit -m "feat: wire DailyLogStrip into dashboard"
```
