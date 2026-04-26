### Task 06: Verify the settings flows and synchronize plan tracking

**Files:**

- Modify: `docs/superpowers/plans/phase-4-health-tracker-settings/index.md`
- Modify: `docs/superpowers/plans/phase-4-health-tracker-settings/task-01-profile-foundation.md`
- Modify: `docs/superpowers/plans/phase-4-health-tracker-settings/task-02-stitch-settings-design.md`
- Modify: `docs/superpowers/plans/phase-4-health-tracker-settings/task-03-settings-routing-and-shell.md`
- Modify: `docs/superpowers/plans/phase-4-health-tracker-settings/task-04-settings-personal-info.md`
- Modify: `docs/superpowers/plans/phase-4-health-tracker-settings/task-05-settings-cycle-body-and-signout.md`
- Modify: `docs/superpowers/plans/phase-4-health-tracker-settings/task-06-verification-and-tracking.md`
- Read first: `docs/superpowers/specs/2026-04-26-settings-design.md`

- [x] **Step 1: Re-check the spec against the finished implementation**

Review:

- `docs/superpowers/specs/2026-04-26-settings-design.md`
- the final settings implementation files touched in Tasks 01 through 05

Confirm specifically:

- `Settings` is a private signed-in route
- `selectedPhase` is visible but still read-only
- personal-info and cycle/body saves are independent
- blank numeric inputs stay blank
- sign-out requires confirmation and returns to `login`

Expected: Verification is driven by the approved spec rather than memory.

- [x] **Step 2: Run repo-level verification**

Run:

```bash
yarn lint
yarn build
```

Expected: The repository passes the required project verification commands for this phase.

- [ ] **Step 3: Run focused manual settings checks**

Manually verify these behaviors in the browser or app runtime:

- signed-in users can open `Settings` from normal app navigation
- unauthenticated users cannot load `/settings`
- personal-information save does not modify cycle/body data
- cycle/body save does not modify personal-information data
- leaving optional number fields blank does not persist `0`
- sign-out dialog requires confirmation and returns to `login`

Expected: The shipped behavior matches the product rules that matter most for this phase.

- [x] **Step 4: Synchronize plan tracking immediately**

Mark the phase index and every completed checklist item in:

- `docs/superpowers/plans/phase-4-health-tracker-settings/index.md`
- `docs/superpowers/plans/phase-4-health-tracker-settings/task-01-profile-foundation.md`
- `docs/superpowers/plans/phase-4-health-tracker-settings/task-02-stitch-settings-design.md`
- `docs/superpowers/plans/phase-4-health-tracker-settings/task-03-settings-routing-and-shell.md`
- `docs/superpowers/plans/phase-4-health-tracker-settings/task-04-settings-personal-info.md`
- `docs/superpowers/plans/phase-4-health-tracker-settings/task-05-settings-cycle-body-and-signout.md`
- `docs/superpowers/plans/phase-4-health-tracker-settings/task-06-verification-and-tracking.md`

Expected: Plan tracking reflects reality immediately at the end of the phase.

- [ ] **Step 5: Commit the verified phase state**

Run:

```bash
git add docs/superpowers/plans/phase-4-health-tracker-settings
git commit -m "docs: update settings phase tracking"
```

Expected: Git records the final verified tracking state for the settings phase.

### Execution Notes

- Manual runtime checks in **Step 3** are still pending because this execution used CLI-only verification (`yarn lint`, `yarn build`) without an interactive browser pass.
