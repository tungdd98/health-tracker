# Task 01 - Remove custom typography tokens from theme

**Files:**

- Modify: `libs/theme/src/lib/theme.ts`
- Inspect during implementation: `apps/health-tracker-web/src/app/dashboard/cycle-hero.tsx`
- Inspect during implementation: `libs/ui/src/lib/app-bottom-nav.tsx`

This task removes the old typography token contract at the source. After this task, `theme.appTokens.typography` should no longer exist in the theme typing or runtime object, which intentionally forces every call site to migrate to explicit MUI variants.

---

- [x] **Step 1: Delete the theme-level typography token type and augmentation fields**

Remove the `AppTypographyTokens` type declaration from [`theme.ts`](/Users/mac/Desktop/health-tracker/libs/theme/src/lib/theme.ts) and delete the `typography` field from both `Theme['appTokens']` and `ThemeOptions['appTokens']`. Keep the `radius` and `shadow` contracts unchanged.

- [x] **Step 2: Delete the `appTokens.typography` runtime object**

Remove the `typography` object from the `appTokens` constant and update the `satisfies` clause so it validates only `radius` and `shadow`.

- [x] **Step 3: Preserve the existing MUI variant definitions as the single typography source**

Keep the current `theme.typography` section intact unless a later migration task uncovers a missing semantic variant. Do not add new custom token objects or variant aliases in this task.

- [x] **Step 4: Run a workspace search to confirm the compiler surface is now the migration list**

Run:

```bash
rg -n "appTokens\\.typography|AppTypographyTokens" apps libs
```

Expected: only call-site usages remain; the type definition and theme object declaration are gone.
