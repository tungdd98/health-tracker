# Task 04 - Migrate auth, onboarding, medication, and remaining app surfaces

**Files:**

- Modify: `apps/health-tracker-web/src/app/pages/login-page.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/signup-page.tsx`
- Modify: `apps/health-tracker-web/src/app/components/onboarding-layout.tsx`
- Modify: `apps/health-tracker-web/src/app/components/sticker-preview-grid.tsx`
- Modify: `apps/health-tracker-web/src/app/medications/medication-form-page.tsx`
- Modify: `apps/health-tracker-web/src/app/medications/medication-list-page.tsx`

This task closes out the remaining product surfaces outside dashboard/calendar/chat and ensures auth, onboarding, and medication flows no longer depend on the retired token contract.

---

- [x] **Step 1: Migrate auth page secondary copy to explicit variants**

Update [`login-page.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/pages/login-page.tsx) and [`signup-page.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/pages/signup-page.tsx) so the secondary text blocks currently using `sectionValue` choose the right MUI variant directly.

- [x] **Step 2: Migrate onboarding labels and sticker preview captions**

Update [`onboarding-layout.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/components/onboarding-layout.tsx) and [`sticker-preview-grid.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/components/sticker-preview-grid.tsx) so progress/support labels use semantic variants with no typography overrides in `sx`.

- [x] **Step 3: Migrate medication form labels, values, and list metadata**

Update [`medication-form-page.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/medications/medication-form-page.tsx) and [`medication-list-page.tsx`](/Users/mac/Desktop/health-tracker/apps/health-tracker-web/src/app/medications/medication-list-page.tsx) so labels, selected values, and row metadata render through `subtitle1`, `subtitle2`, `caption`, or `overline` directly.

- [x] **Step 4: Run a global leftover search**

Run:

```bash
rg -n "appTokens\\.typography|AppTypographyTokens" apps libs
```

Expected: no matches anywhere in the workspace source tree.
