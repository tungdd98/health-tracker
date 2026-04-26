### Task 06: Verify onboarding flows and synchronize plan tracking

**Files:**

- Modify: `docs/superpowers/plans/phase-3-health-tracker-onboarding/index.md`
- Modify: `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-01-onboarding-api-foundation.md`
- Modify: `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-02-stitch-onboarding-design.md`
- Modify: `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-03-onboarding-routing-and-session.md`
- Modify: `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-04-onboarding-ui-and-steps.md`
- Modify: `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-05-onboarding-flow-and-submit.md`
- Modify: `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-06-verification-and-tracking.md`

- [x] **Step 1: Verify the required static quality gates**

Run:

```bash
yarn lint
yarn build
```

Expected: The repo passes the required verification commands for this phase.

- [x] **Step 2: Verify the manual onboarding behaviors**

Run the app locally with valid Supabase env values and verify:

- a newly authenticated user with no onboarding metadata is redirected to `/onboarding`
- `Preparing for pregnancy` can be selected and continued
- `Currently pregnant` is visible but disabled
- the phase-selection step cannot be skipped
- the optional steps can be skipped when empty
- entering valid values and pressing `Continue` persists those values
- `Back` shows previously saved values
- reaching the completion step and confirming sends the user into `/`
- a user who already completed onboarding enters `/` normally on the next sign-in

Expected: Runtime behavior matches the approved onboarding spec and not just the static build.

- [x] **Step 3: Verify the partial-progress edge case**

Manually verify:

- select the required phase
- complete or skip at least one optional step
- close or reload the app before the final completion step
- sign in again

Expected:

- the user is allowed into the app normally on the next sign-in per the approved spec
- previously saved onboarding metadata is still present
- the saved `selectedPhase` is enough to satisfy future app entry
- onboarding is still not marked complete unless the final step had been confirmed

- [x] **Step 4: Synchronize plan tracking**

Mark the phase index and every completed checklist item in:

- `docs/superpowers/plans/phase-3-health-tracker-onboarding/index.md`
- `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-01-onboarding-api-foundation.md`
- `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-02-stitch-onboarding-design.md`
- `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-03-onboarding-routing-and-session.md`
- `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-04-onboarding-ui-and-steps.md`
- `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-05-onboarding-flow-and-submit.md`
- `docs/superpowers/plans/phase-3-health-tracker-onboarding/task-06-verification-and-tracking.md`

Expected: Tracking reflects real execution progress immediately at the end of the phase.

- [x] **Step 5: Commit verification and tracking updates**

Run:

```bash
git add docs/superpowers/plans/phase-3-health-tracker-onboarding
git commit -m "docs: update onboarding phase tracking"
```

Expected: Git records the verified execution state of the onboarding phase.

### Verification Notes

- Static quality gates executed locally:
  - `yarn lint`
  - `yarn build`
- Manual onboarding behavior and partial-progress edge-case verification were confirmed as done by Hoàng Thượng in this execution pass.
