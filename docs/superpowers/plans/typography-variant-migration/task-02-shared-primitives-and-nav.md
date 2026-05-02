# Task 02 - Migrate shared UI primitives and navigation labels

**Files:**

- Modify: `libs/ui/src/lib/app-bottom-nav.tsx`
- Modify: `libs/ui/src/lib/app-header.tsx`
- Modify: `libs/ui/src/lib/app-shell.tsx`
- Modify: `libs/forms/src/lib/form-field.tsx`
- Modify: `apps/health-tracker-web/src/app/components/settings-section-card.tsx`

This task converts the shared surfaces that many screens inherit from. Doing these files early reduces repeated cleanup in feature-level tasks and gives the rest of the migration a stable pattern to follow.

---

- [x] **Step 1: Replace bottom-nav token styling with semantic text variants**

Update [`app-bottom-nav.tsx`](/Users/mac/Desktop/health-tracker/libs/ui/src/lib/app-bottom-nav.tsx) so the label text uses a MUI variant directly instead of spreading `microLabel` styles. Keep active/inactive color and spacing logic, but remove all hardcoded typography properties inherited from the old token.

- [x] **Step 2: Move `AppHeader` subtitle emphasis onto explicit variants**

Update [`app-header.tsx`](/Users/mac/Desktop/health-tracker/libs/ui/src/lib/app-header.tsx) so the title and subtitle choose their emphasis through `variant` instead of reading `sectionValue.fontWeight` or spreading that token into `sx`. Remove any leftover font-weight-driven compatibility prop from [`app-shell.tsx`](/Users/mac/Desktop/health-tracker/libs/ui/src/lib/app-shell.tsx) if no caller still needs it.

- [x] **Step 3: Remove token-derived label styling from shared form wrappers**

Update [`form-field.tsx`](/Users/mac/Desktop/health-tracker/libs/forms/src/lib/form-field.tsx) so any helper or label copy is rendered with `Typography` variants rather than token-derived typography objects. Keep layout and color styling only where needed.

- [x] **Step 4: Align shared settings section card text with MUI variants**

Update [`settings-section-card.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/components/settings-section-card.tsx) to use the correct variant directly and remove the remaining `sectionValue` token reference.

- [x] **Step 5: Re-scan for shared-surface leftovers**

Run:

```bash
rg -n "appTokens\\.typography" libs apps/health-tracker-web/src/app/components
```

Expected: no matches in `libs/ui`, `libs/forms`, or shared app components already covered by this task.
