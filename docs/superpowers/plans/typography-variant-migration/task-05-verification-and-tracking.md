# Task 05 - Verify, audit leftovers, and update tracking

**Files:**

- Modify: `docs/superpowers/plans/typography-variant-migration/index.md`
- Modify: `docs/superpowers/plans/typography-variant-migration/task-05-verification-and-tracking.md`

This task is the definition-of-done gate for the migration. Do not mark the plan complete until the automated checks pass and the repository search confirms the old typography contract is gone.

---

- [x] **Step 1: Format the workspace**

Run:

```bash
yarn format
```

Expected: Prettier completes without errors.

- [x] **Step 2: Lint the workspace**

Run:

```bash
yarn lint
```

Expected: ESLint completes without errors.

- [x] **Step 3: Build the app**

Run:

```bash
yarn build
```

Expected: production build succeeds.

- [x] **Step 4: Audit for retired typography contract leftovers**

Run:

```bash
rg -n "appTokens\\.typography|AppTypographyTokens" apps libs
```

Expected: no matches.

- [x] **Step 5: Update plan tracking in place**

After verification passes, mark the completed checkboxes in [`index.md`](/Users/mac/Desktop/health-tracker/docs/superpowers/plans/typography-variant-migration/index.md) and this task file so the plan reflects actual execution state instead of a deferred cleanup.
