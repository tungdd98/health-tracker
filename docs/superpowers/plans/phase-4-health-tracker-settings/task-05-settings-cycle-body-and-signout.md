### Task 05: Build the cycle-and-body section and confirmed sign-out flow

**Files:**

- Create: `apps/health-tracker-web/src/app/components/sign-out-confirm-dialog.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/settings-page.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/landing-page.tsx`
- Read first: `apps/health-tracker-web/src/app/settings/settings-schemas.ts`
- Read first: `apps/health-tracker-web/src/app/profile/profile-mappers.ts`
- Read first: `docs/superpowers/specs/2026-04-26-settings-design.md`

- [x] **Step 1: Review the settings section foundation and auth sign-out flow**

Read:

- `apps/health-tracker-web/src/app/pages/settings-page.tsx`
- `apps/health-tracker-web/src/app/settings/settings-schemas.ts`
- `apps/health-tracker-web/src/app/profile/profile-mappers.ts`
- `apps/health-tracker-web/src/app/pages/landing-page.tsx`
- `docs/superpowers/specs/2026-04-26-settings-design.md`

Expected: The worker understands the section-level save pattern already established and the current sign-out behavior that needs to move under settings.

- [x] **Step 2: Implement the `Chu kỳ & cơ thể` section**

Update `apps/health-tracker-web/src/app/pages/settings-page.tsx` so the page:

- renders `Độ dài chu kỳ`, `Ngày bắt đầu kỳ gần nhất`, `Chiều cao`, and `Cân nặng`
- treats blank optional numeric fields as blank rather than `0`
- owns a second independent save/loading/success/error state for this section
- validates only the cycle/body fields for this save path
- writes only the cycle/body metadata patch through the shared helper
- keeps entered values intact when the save fails

Expected: The second editable section behaves independently and matches the approved spec.

- [x] **Step 3: Add the confirmed sign-out dialog and account section**

Create `apps/health-tracker-web/src/app/components/sign-out-confirm-dialog.tsx` and wire it into `apps/health-tracker-web/src/app/pages/settings-page.tsx` so:

- the `Tài khoản` section owns the `Đăng xuất` action
- tapping the action opens a confirmation dialog
- confirm state prevents duplicate submissions while sign-out is running
- successful sign-out returns the user to `/login`
- failed sign-out keeps the user in context and shows a clear error message

Expected: The destructive account action matches the approved settings behavior instead of happening immediately from the page header.

- [x] **Step 4: Simplify the landing page after settings owns sign-out**

Update `apps/health-tracker-web/src/app/pages/landing-page.tsx` only as needed so it no longer conflicts with the settings-owned sign-out flow and still acts as a lightweight signed-in placeholder home.

Expected: Account actions have one clear owner while the home page stays intentionally small.

- [x] **Step 5: Lint the completed settings experience**

Run:

```bash
yarn eslint apps/health-tracker-web/src --max-warnings=0
```

Expected: The full settings page and sign-out dialog lint cleanly.

- [ ] **Step 6: Commit the settings interaction flow**

Run:

```bash
git add apps/health-tracker-web docs/superpowers/plans/phase-4-health-tracker-settings
git commit -m "feat: finish settings interactions"
```

Expected: Git records a focused commit for the second section and confirmed sign-out flow.
