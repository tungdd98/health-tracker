### Task 04: Wire onboarding persistence, navigation, and completion behavior

**Files:**

- Create: `apps/health-tracker-web/src/app/pages/onboarding-page.tsx`
- Modify: `apps/health-tracker-web/src/app/router.tsx`
- Modify: `apps/health-tracker-web/src/app/auth/use-auth-session.ts`
- Modify: `apps/health-tracker-web/src/app/onboarding/onboarding-steps.ts`
- Read first: `libs/api/src/lib/onboarding.ts`
- Read first: `apps/health-tracker-web/src/app/onboarding/onboarding-schemas.ts`
- Read first: `docs/superpowers/specs/2026-04-26-onboarding-design.md`

- [ ] **Step 1: Create the wizard page shell and current-step rendering**

Create `apps/health-tracker-web/src/app/pages/onboarding-page.tsx` and wire it to:

- read `user`, `onboardingProfile`, and `isOnboardingComplete` from `useAuthSession`
- read `hasSelectedOnboardingPhase` from `useAuthSession`
- derive the current step from local state
- render the correct step component inside `OnboardingLayout`

Initialize the wizard from the first step every time this page is opened in this phase. Do not add resume-to-last-step behavior.

Expected: The onboarding route renders a complete page shell with the correct first step for a first-time user.

- [ ] **Step 2: Implement per-step `Continue` persistence**

In `onboarding-page.tsx`, implement focused submit handlers:

- `Select Phase`
  - validate phase
  - persist `selectedPhase`
  - move to the next step
  - after this save, the user should satisfy the app-entry requirement even though onboarding is still not complete
- `Basic Profile`
  - validate optional fields only when present
  - persist `displayName` and `birthDate` on success
- `Cycle Information`
  - persist `cycleLengthDays` and `lastPeriodStartDate` on success
- `Body Metrics`
  - persist `heightCm` and `weightKg` on success

Each handler should call the shared onboarding update helper and keep the user on the same step if the save fails.

Expected: The wizard writes step data incrementally instead of waiting for one final submit.

- [ ] **Step 3: Implement `Back` and `Skip` behavior**

Required rules:

- `Back` moves to the previous step and shows already saved values
- `Skip` is not available on the phase-selection step
- `Skip` advances without writing step fields
- For optional steps, only show or enable `Skip` while the current step is still empty so partially entered values do not create ambiguous discard behavior

Expected: The flow matches the spec's soft onboarding rules without hidden partial-save surprises.

- [ ] **Step 4: Implement final completion behavior**

On the `Completion` step:

- call `completeOnboarding(user)`
- set `onboardingCompleted` and `onboardingCompletedAt`
- redirect to `/` only after the write succeeds

Do not mark onboarding complete from any earlier step.

Expected: Completion state is only set from the last screen, exactly as defined in the spec.

- [ ] **Step 5: Add submit-state and error handling**

The onboarding page should include:

- per-step loading state while writes are in flight
- concise submit error messaging when metadata writes fail
- no redirect on failed writes

Expected: The wizard remains stable under save failures and does not falsely complete onboarding.

- [ ] **Step 6: Lint and build the onboarding flow**

Run:

```bash
yarn lint
yarn build
```

Expected: The full repo still passes the required verification commands after the onboarding flow is wired.

- [ ] **Step 7: Commit the onboarding flow behavior**

Run:

```bash
git add apps/health-tracker-web docs/superpowers/plans/phase-3-health-tracker-onboarding
git commit -m "feat: implement onboarding flow"
```

Expected: Git records a focused commit for onboarding page behavior and persistence wiring.
