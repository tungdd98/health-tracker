### Task 02: Gate authenticated routes with onboarding-aware session logic

**Files:**

- Modify: `apps/health-tracker-web/src/app/auth/use-auth-session.ts`
- Modify: `apps/health-tracker-web/src/app/router.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/landing-page.tsx`
- Read first: `libs/api/src/lib/onboarding.ts`
- Read first: `docs/superpowers/specs/2026-04-26-onboarding-design.md`

- [ ] **Step 1: Extend the auth-session hook with normalized onboarding state**

Update `apps/health-tracker-web/src/app/auth/use-auth-session.ts` to:

- parse the current user through `getOnboardingProfileFromUser`
- return `onboardingProfile`
- return a boolean such as `isOnboardingComplete`
- return a boolean such as `hasSelectedOnboardingPhase`

Do not mix network writes into this hook. Keep it as a read-only session snapshot.

Expected: Route guards and onboarding screens can make consistent decisions from one hook.

- [ ] **Step 2: Add onboarding-aware route guards**

Update `apps/health-tracker-web/src/app/router.tsx` so the router distinguishes three states:

- unauthenticated user
- authenticated user who has not yet selected the required onboarding phase
- authenticated user who has already selected the required onboarding phase

Required behavior:

- unauthenticated users still go to `/login`
- authenticated users with no selected phase are redirected to `/onboarding`
- authenticated users with a selected phase may enter `/` even if they have not reached the final completion step yet
- authenticated users with `onboardingCompleted = true` are redirected away from `/onboarding` to `/`

Expected: The router, not individual screens, owns the app-entry gating behavior.

- [ ] **Step 3: Add the onboarding page route**

Declare a dedicated route such as `/onboarding` that remains inside the authenticated boundary and renders the new `OnboardingPage`.

Expected: First-time users have a stable route for required onboarding instead of an overlay or modal.

- [ ] **Step 4: Keep the post-onboarding home lightweight**

Adjust `apps/health-tracker-web/src/app/pages/landing-page.tsx` only as needed so it still works as the temporary signed-in destination once onboarding is complete. Do not expand it into a real dashboard in this phase.

Expected: The landing page remains a simple signed-in home while onboarding owns the first-time setup experience.

- [ ] **Step 5: Lint the routing changes**

Run:

```bash
yarn eslint apps/health-tracker-web/src --max-warnings=0
```

Expected: The session and routing changes lint cleanly.

- [ ] **Step 6: Commit the onboarding-aware routing**

Run:

```bash
git add apps/health-tracker-web docs/superpowers/plans/phase-3-health-tracker-onboarding
git commit -m "feat: gate routes with onboarding state"
```

Expected: Git records a focused commit for session parsing and onboarding redirects.
