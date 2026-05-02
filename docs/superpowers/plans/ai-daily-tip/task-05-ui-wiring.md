# Task 05 — UI Wiring

**Goal:** Update `TipOfDay` to use `useDailyTip` internally and display the chatbot name in the title. Update `DashboardPage` to load `chatbotName` and pass new props.

**Files:**

- Modify: `apps/health-tracker-web/src/app/dashboard/tip-of-day.tsx`
- Modify: `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx`

**Reference:**

- Current `tip-of-day.tsx`: `apps/health-tracker-web/src/app/dashboard/tip-of-day.tsx`
- Current `dashboard-page.tsx`: `apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx`
- `getChatPersonalization` — exported from `@health-tracker/api` (defined in `libs/api/src/lib/chat.ts`, returns `ChatPersonalization` with `.preferences.chatbotName`)
- `useDailyTip` — created in Task 04

---

## Part A — Update `TipOfDay`

- [ ] **Step 1: Replace props and internals of `TipOfDay`**

Current props: `{ phase: CyclePhase; isLoading: boolean }`.

New props: `{ userId: string; phase: CyclePhase; date: string; chatbotName: string | null }`.

Changes inside the component:

- Remove the external `isLoading` prop. Instead call `useDailyTip(userId, phase, date)` at the top of the component to get `{ tip, isLoading }`.
- Remove the `const tip = pickTip(phase, DateTime.local())` line (fallback now lives in `useDailyTip`).
- In the non-loading render branch, replace `{tip}` with `{tip}` from the hook result (same variable name, no change needed if you destructure identically).
- Replace the hardcoded label `"Mẹo hôm nay"` with a computed title:
  ```typescript
  const title = chatbotName ? `Lời khuyên của ${chatbotName}` : 'Lời khuyên của AI';
  ```
  Use `{title}` in the `Typography` that previously rendered `"Mẹo hôm nay"`.
- Remove the `import { pickTip } from './tip-library'` and `import { DateTime } from 'luxon'` lines (no longer needed directly in this file).
- Add `import { useDailyTip } from './use-daily-tip'`.

Layout, colors, skeleton, and `AppCard` structure remain exactly as-is.

---

## Part B — Update `DashboardPage`

- [ ] **Step 2: Add `chatbotName` query inside `DashboardPage`**

Add the following imports if not already present:

```typescript
import { useQuery } from '@tanstack/react-query';
import { getChatPersonalization } from '@health-tracker/api';
```

After the existing `const today = DateTime.local();` line, add:

```typescript
const { data: chatPersonalization } = useQuery({
  queryKey: ['chat-personalization', user?.id],
  queryFn: () => getChatPersonalization(user!.id),
  enabled: !!user,
  staleTime: 5 * 60 * 1000,
});
const chatbotName = chatPersonalization?.preferences.chatbotName ?? null;
```

- [ ] **Step 3: Update the `TipOfDay` call site**

Find (around line 114):

```typescript
{showTipAndStrip && snapshot ? <TipOfDay isLoading={false} phase={snapshot.phase} /> : null}
```

Replace with:

```typescript
{showTipAndStrip && snapshot && user ? (
  <TipOfDay
    chatbotName={chatbotName}
    date={today.toISODate()!}
    phase={snapshot.phase}
    userId={user.id}
  />
) : null}
```

---

## Part C — Verify and commit

- [ ] **Step 4: Run format, lint, and build**

```bash
yarn format
yarn lint
yarn build
```

Expected: all pass with no errors.

- [ ] **Step 5: Start dev server and verify the UI**

```bash
yarn dev
```

Open `http://localhost:4200`. Log in, go to dashboard, and check:

1. Tip card shows a skeleton briefly while the AI tip loads.
2. Title is "Lời khuyên của [chatbot name]" or "Lời khuyên của AI" if chatbotName is null.
3. Refreshing the page shows the same tip instantly (no loading skeleton — it's cached in React Query).
4. Card position, colors, and skeleton shape are unchanged from before.

- [ ] **Step 6: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/tip-of-day.tsx \
        apps/health-tracker-web/src/app/dashboard/dashboard-page.tsx
git commit -m "feat(dashboard): wire AI daily tip into TipOfDay with chatbot name title"
```
