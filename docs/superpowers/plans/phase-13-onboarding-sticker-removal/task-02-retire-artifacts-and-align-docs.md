### Task 02: Retire onboarding-only sticker artifacts and align plan docs with the settings-only ownership model

**Files:**

- Delete if unused: `apps/health-tracker-web/src/app/onboarding/onboarding-wow-screen.tsx`
- Modify if needed: `apps/health-tracker-web/src/app/pages/settings-page.tsx`
- Modify: `docs/superpowers/plans/phase-12-avatar-mood-sticker/index.md`
- Modify: `docs/superpowers/plans/phase-12-avatar-mood-sticker/task-04-onboarding-avatar-wow.md`
- Read first: `docs/superpowers/specs/2026-04-30-onboarding-sticker-removal-design.md`

- [x] **Step 1: Check whether the onboarding wow screen is still referenced anywhere**

Run:

```bash
rg -n "OnboardingWowScreen|onboarding-wow-screen|showWowScreen|MoodGeneratingOverlay" \
  apps/health-tracker-web/src
```

Expected: The worker can prove whether any onboarding-owned sticker artifact remains after Task 01.

- [x] **Step 2: Delete the onboarding wow-screen file if it has no remaining references**

If `apps/health-tracker-web/src/app/onboarding/onboarding-wow-screen.tsx` is unused, delete it and keep the removal focused:

```bash
git rm apps/health-tracker-web/src/app/onboarding/onboarding-wow-screen.tsx
```

If a reference still exists, remove that reference first, rerun the `rg` command, and only then delete the file.

Expected: No dead onboarding wow-screen component remains in the codebase.

- [x] **Step 3: Confirm `settings-page.tsx` still stands alone as the sticker owner**

Review `apps/health-tracker-web/src/app/pages/settings-page.tsx` and keep or adjust only copy/state that depends on onboarding having introduced stickers earlier. The settings page should still own:

- avatar upload
- regenerate dialog
- sticker preview dialog
- `MoodGeneratingOverlay`
- personal-sticker toggle

Expected: Settings remains a self-contained sticker surface with no reliance on onboarding-created state beyond the persisted avatar/sticker data itself.

- [x] **Step 4: Mark the old phase-12 onboarding task as superseded**

Update `docs/superpowers/plans/phase-12-avatar-mood-sticker/task-04-onboarding-avatar-wow.md` with a short top note such as:

```md
> Superseded on 2026-04-30 by `docs/superpowers/specs/2026-04-30-onboarding-sticker-removal-design.md` and `docs/superpowers/plans/phase-13-onboarding-sticker-removal/`. The settings-side sticker work remains active; the onboarding avatar picker and wow screen were intentionally removed.
```

Expected: Future readers do not treat the old onboarding avatar/wow task as current product behavior.

- [x] **Step 5: Add the same superseded note to the phase-12 index**

Update `docs/superpowers/plans/phase-12-avatar-mood-sticker/index.md` near the header or notes section with a brief status note that onboarding ownership changed in phase 13 while settings/dashboard sticker behavior remains in scope.

Expected: The historical sticker plan points readers to the newer rollback phase instead of presenting outdated onboarding behavior as current.

- [x] **Step 6: Run focused lint and doc sanity checks**

Run:

```bash
rg -n "OnboardingWowScreen|showWowScreen|avatarPreviewUrl|onAvatarChange" \
  apps/health-tracker-web/src/app/onboarding \
  apps/health-tracker-web/src/app/pages/onboarding-page.tsx
```

Expected: No onboarding-owned avatar or wow-screen hooks remain after cleanup.

- [x] **Step 7: Commit the cleanup and doc-alignment pass**

Run:

```bash
git add apps/health-tracker-web/src/app/pages/settings-page.tsx \
  docs/superpowers/plans/phase-12-avatar-mood-sticker \
  apps/health-tracker-web/src/app/onboarding
git commit -m "docs: align sticker plans with onboarding rollback"
```

Expected: Git records the artifact cleanup and the historical-plan alignment in one reviewable commit.
