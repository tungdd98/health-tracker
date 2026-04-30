### Task 03: Verify the simplified onboarding flow, confirm settings still owns stickers, and synchronize tracking

**Files:**

- Modify: `docs/superpowers/plans/phase-13-onboarding-sticker-removal/index.md`
- Modify: `docs/superpowers/plans/phase-13-onboarding-sticker-removal/task-01-remove-onboarding-avatar-flow.md`
- Modify: `docs/superpowers/plans/phase-13-onboarding-sticker-removal/task-02-retire-artifacts-and-align-docs.md`

- [x] **Step 1: Run the required repo verification gate**

Run:

```bash
yarn format
yarn lint
yarn build
```

Expected: All required verification commands pass with the onboarding cleanup in place.

- [x] **Step 2: Smoke test the onboarding flow on `yarn dev`**

Verify:

- [x] The basic-profile step shows only `Tên hiển thị` and `Ngày sinh`
- [x] The basic-profile step has no avatar picker, camera icon, or upload spinner
- [x] Continuing from basic profile goes straight to the cycle step
- [x] Skipping the optional steps still behaves exactly as before
- [x] Completing onboarding reaches the app normally with no sticker messaging

Expected: Onboarding is visually and behaviorally silent about stickers.

- [x] **Step 3: Smoke test the settings-owned sticker flow**

Verify:

- [x] Settings still allows avatar upload
- [x] Uploading or changing an avatar still allows sticker generation or regeneration
- [x] The sticker preview dialog still opens with generated images
- [x] The personal-sticker toggle still switches the app between sticker and emoji rendering

Expected: Sticker functionality still exists, but only through settings.

- [x] **Step 4: Update plan tracking files**

Mark completed checkboxes in:

- `docs/superpowers/plans/phase-13-onboarding-sticker-removal/index.md`
- `docs/superpowers/plans/phase-13-onboarding-sticker-removal/task-01-remove-onboarding-avatar-flow.md`
- `docs/superpowers/plans/phase-13-onboarding-sticker-removal/task-02-retire-artifacts-and-align-docs.md`

Expected: The plan accurately reflects actual completion state instead of being updated at the end from memory.

- [ ] **Step 5: Commit the verification and tracking sync**

Run:

```bash
git add docs/superpowers/plans/phase-13-onboarding-sticker-removal
git commit -m "chore: finalize onboarding sticker removal"
```

Expected: Git records the verification pass and tracking updates for the phase.
