### Task 03: Build the onboarding wizard structure, schemas, and step components

**Files:**

- Create: `apps/health-tracker-web/src/app/components/onboarding-layout.tsx`
- Create: `apps/health-tracker-web/src/app/onboarding/onboarding-types.ts`
- Create: `apps/health-tracker-web/src/app/onboarding/onboarding-steps.ts`
- Create: `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts`
- Create: `apps/health-tracker-web/src/app/onboarding/phase-step.tsx`
- Create: `apps/health-tracker-web/src/app/onboarding/basic-profile-step.tsx`
- Create: `apps/health-tracker-web/src/app/onboarding/cycle-step.tsx`
- Create: `apps/health-tracker-web/src/app/onboarding/body-metrics-step.tsx`
- Create: `apps/health-tracker-web/src/app/onboarding/completion-step.tsx`
- Read first: `apps/health-tracker-web/src/app/components/auth-layout.tsx`
- Read first: `libs/forms/src/index.ts`
- Read first: `docs/superpowers/specs/2026-04-26-onboarding-design.md`

- [ ] **Step 1: Review the existing auth layout and shared form primitives**

Read these files before editing:

- `apps/health-tracker-web/src/app/components/auth-layout.tsx`
- `libs/forms/src/index.ts`
- `docs/superpowers/specs/2026-04-26-onboarding-design.md`

Expected: The worker understands the existing visual language and the shared field components already available in the repo.

- [ ] **Step 2: Define the wizard step model**

Create:

- `apps/health-tracker-web/src/app/onboarding/onboarding-types.ts`
- `apps/health-tracker-web/src/app/onboarding/onboarding-steps.ts`

Include:

- stable step ids for `phase`, `basic-profile`, `cycle`, `body-metrics`, and `completion`
- ordered step metadata for progress display
- small helpers for previous/next step lookup if they simplify the page implementation

Expected: The wizard order and navigation model are declared once instead of being scattered through the page.

- [ ] **Step 3: Add per-step validation schemas**

Create `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts` with separate Zod schemas for:

- phase selection
- basic profile
- cycle information
- body metrics

Requirements:

- `phase` is required and only allows the supported value
- optional text/date/number fields remain optional
- blank numeric inputs stay `undefined` instead of becoming `0`

Expected: Each step can validate only its own fields while keeping optional steps truly optional.

- [ ] **Step 4: Build the shared onboarding layout shell**

Create `apps/health-tracker-web/src/app/components/onboarding-layout.tsx` with:

- step title
- short description
- progress indicator
- content area for the current step
- stable action row area for `Back`, `Skip`, and `Continue`

Keep the visual tone aligned with the auth screens rather than inventing a new product chrome.

Expected: Every onboarding step renders inside one consistent mobile-first layout.

- [ ] **Step 5: Build the step components**

Create focused app-owned step components:

- `phase-step.tsx`
- `basic-profile-step.tsx`
- `cycle-step.tsx`
- `body-metrics-step.tsx`
- `completion-step.tsx`

Requirements by step:

- `phase-step.tsx`
  - render two option cards
  - enable only `Preparing for pregnancy`
  - show `Currently pregnant` as disabled with a `Coming soon` label
- `basic-profile-step.tsx`
  - render `display_name` and `birth_date`
- `cycle-step.tsx`
  - render `cycle_length_days` and `last_period_start_date`
  - include short explanatory copy
- `body-metrics-step.tsx`
  - render `height_cm` and `weight_kg`
- `completion-step.tsx`
  - show the final message and primary completion CTA

Expected: The page-level wizard can compose simple focused step components instead of one oversized form file.

- [ ] **Step 6: Lint the onboarding UI scaffolding**

Run:

```bash
yarn eslint apps/health-tracker-web/src --max-warnings=0
```

Expected: The new onboarding UI modules lint cleanly before flow logic is added.

- [ ] **Step 7: Commit the onboarding UI scaffolding**

Run:

```bash
git add apps/health-tracker-web docs/superpowers/plans/phase-3-health-tracker-onboarding
git commit -m "feat: add onboarding wizard ui"
```

Expected: Git records a focused commit for onboarding layout, schemas, and step components.
