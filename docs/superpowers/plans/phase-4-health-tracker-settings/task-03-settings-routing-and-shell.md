### Task 03: Add the authenticated settings route and app navigation entry

**Files:**

- Modify: `apps/health-tracker-web/src/app/router.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/landing-page.tsx`
- Create: `apps/health-tracker-web/src/app/pages/settings-page.tsx`
- Modify: `libs/ui/src/lib/app-shell.tsx`
- Modify: `libs/ui/src/lib/app-bottom-nav.tsx`
- Read first: `docs/superpowers/specs/2026-04-26-settings-design.md`
- Read first: `apps/health-tracker-web/src/app/router.tsx`
- Read first: `libs/ui/src/lib/app-shell.tsx`

- [ ] **Step 1: Review the current private-route and bottom-nav behavior**

Read these files before editing:

- `apps/health-tracker-web/src/app/router.tsx`
- `apps/health-tracker-web/src/app/pages/landing-page.tsx`
- `libs/ui/src/lib/app-shell.tsx`
- `libs/ui/src/lib/app-bottom-nav.tsx`

Expected: The worker understands how the app currently guards private routes and why the bottom nav still needs route-aware behavior.

- [ ] **Step 2: Add a private `/settings` route**

Update `apps/health-tracker-web/src/app/router.tsx` so authenticated users who already satisfy the onboarding gate can open `/settings` through the same private-route behavior used for `/`.

Required behavior:

- unauthenticated users are still redirected to `/login`
- users who have not selected the required onboarding phase are still redirected to `/onboarding`
- authenticated users with the required onboarding state may open `/settings`

Expected: `Settings` becomes a real private destination rather than a placeholder nav item.

- [ ] **Step 3: Add the initial settings page scaffold**

Create `apps/health-tracker-web/src/app/pages/settings-page.tsx` with a signed-in page shell that includes:

- header title `Cài đặt`
- signed-in visual styling through the existing app shell
- placeholder section containers for `Thông tin cá nhân`, `Chu kỳ & cơ thể`, and `Tài khoản`
- `navValue="settings"`

Do not build the full section forms in this task. Keep this task focused on route availability and shell structure.

Expected: The app has a reachable settings destination with the right page-level framing.

- [ ] **Step 4: Make the app shell nav route-aware enough for home and settings**

Update `libs/ui/src/lib/app-shell.tsx` and `libs/ui/src/lib/app-bottom-nav.tsx` only as needed so app pages can respond to bottom-nav selection changes and navigate between at least `home` and `settings` without hard-wiring settings logic into the UI library.

Expected: The nav can move the signed-in user into `Settings` from normal app chrome.

- [ ] **Step 5: Adjust the landing page to point into settings cleanly**

Update `apps/health-tracker-web/src/app/pages/landing-page.tsx` so the home surface exposes a clear path into `Settings` and stops being the long-term owner of account actions that now belong under the settings spec.

Expected: The home placeholder remains simple while the user can discover the new settings route naturally.

- [ ] **Step 6: Lint the route and shell changes**

Run:

```bash
yarn eslint apps/health-tracker-web/src libs/ui/src --max-warnings=0
```

Expected: The new route and nav changes lint cleanly.

- [ ] **Step 7: Commit the settings route and shell work**

Run:

```bash
git add apps/health-tracker-web libs/ui docs/superpowers/plans/phase-4-health-tracker-settings
git commit -m "feat: add settings route and shell"
```

Expected: Git records a focused commit for route access and signed-in navigation into settings.
