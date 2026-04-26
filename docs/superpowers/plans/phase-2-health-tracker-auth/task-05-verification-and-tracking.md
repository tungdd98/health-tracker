### Task 05: Verify auth flows and sync plan tracking

**Files:**

- Modify: `docs/superpowers/plans/phase-2-health-tracker-auth/index.md`
- Modify: `docs/superpowers/plans/phase-2-health-tracker-auth/task-01-auth-api-foundation.md`
- Modify: `docs/superpowers/plans/phase-2-health-tracker-auth/task-02-stitch-auth-design.md`
- Modify: `docs/superpowers/plans/phase-2-health-tracker-auth/task-03-auth-ui-and-forms.md`
- Modify: `docs/superpowers/plans/phase-2-health-tracker-auth/task-04-auth-routing-and-home.md`
- Modify: `docs/superpowers/plans/phase-2-health-tracker-auth/task-05-verification-and-tracking.md`

- [ ] **Step 1: Verify the static quality gates**

Run:

```bash
yarn lint
yarn build
```

Expected: The repo passes the required project-level verification commands for this phase.

- [ ] **Step 2: Verify the manual auth behaviors**

Run the app locally with valid Supabase env values and verify:

- a new user can sign up with email and password
- sign-up success enters the app instead of stopping on a local success screen
- an existing user can log in
- an unauthenticated visit to `/` redirects to `/login`
- an authenticated visit to `/login` or `/signup` redirects to `/`
- the signed-in home shows authenticated identity and supports sign out
- sign out returns the user to `/login`

Expected: The implemented behavior matches the approved auth spec and not just the static build.

- [ ] **Step 3: Confirm the Supabase project setting assumption**

Document the actual project behavior observed during sign up, especially whether the current Supabase project configuration allows immediate post-sign-up access without a separate email-confirmation gate.

Expected: The implementation notes and runtime behavior are aligned, and this known constraint is no longer implicit.

- [ ] **Step 4: Synchronize plan tracking**

Mark the phase index and every completed checklist item in:

- `docs/superpowers/plans/phase-2-health-tracker-auth/index.md`
- `docs/superpowers/plans/phase-2-health-tracker-auth/task-01-auth-api-foundation.md`
- `docs/superpowers/plans/phase-2-health-tracker-auth/task-02-stitch-auth-design.md`
- `docs/superpowers/plans/phase-2-health-tracker-auth/task-03-auth-ui-and-forms.md`
- `docs/superpowers/plans/phase-2-health-tracker-auth/task-04-auth-routing-and-home.md`
- `docs/superpowers/plans/phase-2-health-tracker-auth/task-05-verification-and-tracking.md`

Expected: Plan tracking reflects reality immediately at the end of the phase.

- [ ] **Step 5: Commit verification and tracking updates**

Run:

```bash
git add docs/superpowers/plans/phase-2-health-tracker-auth
git commit -m "docs: update auth phase tracking"
```

Expected: Git records the verified phase state and tracking updates in a final documentation commit.
