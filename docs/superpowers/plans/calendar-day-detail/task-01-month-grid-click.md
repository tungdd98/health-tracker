# Task 01 — Add `onDayClick` to MonthGrid

**Files:**

- Modify: `apps/health-tracker-web/src/app/calendar/month-grid.tsx`

---

- [ ] **Step 1: Add the optional prop to `MonthGridProps`**

In `month-grid.tsx`, add `onDayClick` to the props type and destructure it:

```ts
type MonthGridProps = {
  displayMonth: DateTime;
  input: MonthGridInput | null;
  onDayClick?: (day: DateTime) => void;
};

export function MonthGrid({ displayMonth, input, onDayClick }: MonthGridProps) {
```

- [ ] **Step 2: Wire `onClick` and `cursor` on each day cell**

Each day cell is a `Box`. Add `onClick` and `cursor` to it:

```tsx
<Box
  key={date.toISODate()}
  onClick={onDayClick ? () => onDayClick(date) : undefined}
  sx={{
    alignItems: 'center',
    aspectRatio: '1',
    bgcolor: backgroundColor,
    border: isToday
      ? `1.5px solid ${theme.palette.primary.main}`
      : '1px solid transparent',
    borderRadius: theme.appTokens.radius.sm,
    cursor: onDayClick ? 'pointer' : 'default',
    display: 'flex',
    justifyContent: 'center',
    opacity: isCurrentMonth ? 1 : 0.4,
    position: 'relative',
  }}
>
```

The prop is optional — when not passed, behavior is identical to before.

- [ ] **Step 3: Commit**

```bash
git add apps/health-tracker-web/src/app/calendar/month-grid.tsx
git commit -m "feat(calendar): add optional onDayClick prop to MonthGrid"
```
