# Task 04 — Wire DashboardPage

**File:** `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx`

**Depends on:** Tasks 02 and 03.

Replace `isDialogOpen: boolean` with `dialogMode: 'log' | 'edit' | null`. Wire both entry points and pass the correct `initialDate` and `mode` to `LogPeriodDialog`. Wire `onEditPeriod` to `CycleHero`.

---

- [ ] **Step 1: Replace `isDialogOpen` with `dialogMode` and update all usages**

Replace this line:

```tsx
const [isDialogOpen, setIsDialogOpen] = useState(false);
```

With:

```tsx
const [dialogMode, setDialogMode] = useState<'log' | 'edit' | null>(null);
```

- [ ] **Step 2: Update `CycleHero` call site to add `onEditPeriod`**

Replace:

```tsx
<CycleHero
  dailyLogSlot={
    user && snapshot ? <DailyLogStrip userId={user.id} date={today.toISODate()!} /> : null
  }
  isLoading={isLoading}
  mode={mode}
  onLogPeriod={() => setIsDialogOpen(true)}
  snapshot={snapshot}
/>
```

With:

```tsx
<CycleHero
  dailyLogSlot={
    user && snapshot ? <DailyLogStrip userId={user.id} date={today.toISODate()!} /> : null
  }
  isLoading={isLoading}
  mode={mode}
  onEditPeriod={() => setDialogMode('edit')}
  onLogPeriod={() => setDialogMode('log')}
  snapshot={snapshot}
/>
```

- [ ] **Step 3: Update `LogPeriodDialog` call site to pass `initialDate` and `mode`**

Replace:

```tsx
{
  user ? (
    <LogPeriodDialog
      onClose={() => setIsDialogOpen(false)}
      onSuccess={() => {
        setIsDialogOpen(false);
        setSnackbarOpen(true);
      }}
      open={isDialogOpen}
      user={user}
    />
  ) : null;
}
```

With:

```tsx
{
  user ? (
    <LogPeriodDialog
      initialDate={
        dialogMode === 'edit'
          ? (onboardingProfile.lastPeriodStartDate ?? today.toISODate()!)
          : today.toISODate()!
      }
      mode={dialogMode === 'edit' ? 'edit' : 'log'}
      onClose={() => setDialogMode(null)}
      onSuccess={() => {
        setDialogMode(null);
        setSnackbarOpen(true);
      }}
      open={dialogMode !== null}
      user={user}
    />
  ) : null;
}
```

- [ ] **Step 4: Verify lint and build pass**

```bash
yarn lint
yarn build
```

Expected: no errors, clean build.

- [ ] **Step 5: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx
git commit -m "feat: wire edit period date dialog to dashboard"
```
