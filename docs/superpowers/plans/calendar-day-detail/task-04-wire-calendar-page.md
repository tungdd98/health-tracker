# Task 04 — Wire everything in CalendarPage

**Files:**

- Modify: `apps/health-tracker-web/src/app/calendar/calendar-page.tsx`

---

- [ ] **Step 1: Add `user` to the `useAuthSession` destructure and add `selectedDay` state**

```ts
const { isAuthResolved, onboardingProfile, user } = useAuthSession();
const [selectedDay, setSelectedDay] = useState<DateTime | null>(null);
```

- [ ] **Step 2: Pass `onDayClick` to `MonthGrid`**

```tsx
<MonthGrid displayMonth={displayMonth} input={input} onDayClick={setSelectedDay} />
```

- [ ] **Step 3: Render `DayDetailSheet` inside the `AppShell`**

Add it after the closing `</Stack>` of the main content (still inside `AppShell`):

```tsx
import { DayDetailSheet } from './day-detail-sheet';

// Inside return, after the main Stack:
<DayDetailSheet
  input={input}
  selectedDay={selectedDay}
  userId={user?.id}
  onClose={() => setSelectedDay(null)}
/>;
```

- [ ] **Step 4: Commit**

```bash
git add apps/health-tracker-web/src/app/calendar/calendar-page.tsx
git commit -m "feat(calendar): wire day detail sheet into CalendarPage"
```
