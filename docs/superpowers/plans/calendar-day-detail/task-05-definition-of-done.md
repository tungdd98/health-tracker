# Task 05 — Definition of Done

**Files:** none (verification only)

---

- [ ] **Step 1: Format**

```bash
yarn format
```

Expected: files reformatted with no errors.

- [ ] **Step 2: Lint**

```bash
yarn lint
```

Expected: no ESLint errors or warnings.

- [ ] **Step 3: Build**

```bash
yarn build
```

Expected: build succeeds with no TypeScript or bundler errors.

- [ ] **Step 4: Manual smoke test**

Start the dev server:

```bash
yarn dev
```

Open `http://localhost:4200` → navigate to the Calendar tab.

Check these scenarios:

| Scenario                                                             | Expected                                                           |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Tap a day in the current month with cycle data                       | Bottom sheet opens, shows phase info + log rows                    |
| Tap a future day                                                     | Bottom sheet shows phase info, no "Nhật ký ngày" section           |
| Tap a day before `lastPeriodStartDate`                               | Bottom sheet shows "Không có dữ liệu chu kỳ"                       |
| Tap backdrop or swipe down                                           | Sheet closes                                                       |
| No cycle data configured (nudge state)                               | Days still tappable; sheet shows "Không có dữ liệu chu kỳ" for all |
| Tap today's date on dashboard then open calendar sheet for same date | Log data appears immediately (React Query cache hit)               |

- [ ] **Step 5: Commit (if not already committed per task)**

```bash
git add -p
git commit -m "chore: formatting and lint fixes"
```
