### Task 04: Wire route guards, session bootstrap, and the signed-in home flow

**Files:**

- Create: `apps/health-tracker-web/src/app/components/auth-route-state.tsx`
- Create: `apps/health-tracker-web/src/app/auth/use-auth-session.ts`
- Modify: `apps/health-tracker-web/src/app/router.tsx`
- Modify: `apps/health-tracker-web/src/app/providers.tsx` only if a provider-level bootstrap shell is cleaner than route-local bootstrap
- Modify: `apps/health-tracker-web/src/app/pages/landing-page.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/not-found-page.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/login-page.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/signup-page.tsx`

- [x] **Step 1: Review the current router and landing page behavior**

Read these files before wiring guards:

- `apps/health-tracker-web/src/app/router.tsx`
- `apps/health-tracker-web/src/app/providers.tsx`
- `apps/health-tracker-web/src/app/pages/landing-page.tsx`
- `docs/superpowers/specs/2026-04-26-auth-design.md`

Expected: The worker understands the current app bootstrap and which routes must change in this phase.

- [x] **Step 2: Add a small app-owned auth session hook**

Create `apps/health-tracker-web/src/app/auth/use-auth-session.ts` that:

- reads the initial session from `getCurrentSession`
- subscribes to `subscribeToAuthChanges`
- exposes `session`, `user`, and a bootstrap status such as `isAuthResolved`

Keep this hook app-owned so route composition stays explicit and readable in the app layer.

Expected: The router and authenticated home can react to session changes without duplicating Supabase session logic.

- [x] **Step 3: Add a shared bootstrap/loading route state**

Create `apps/health-tracker-web/src/app/components/auth-route-state.tsx` to show a lightweight loading surface while auth resolution is in progress.

Keep it simple and visually consistent with the existing design system.

Expected: The app has a dedicated state for the auth bootstrap window and avoids redirect flicker.

- [x] **Step 4: Rework the router into public-only and private behavior**

Update `apps/health-tracker-web/src/app/router.tsx` so that:

- `/login` renders the login page for signed-out users and redirects signed-in users to `/`
- `/signup` renders the sign-up page for signed-out users and redirects signed-in users to `/`
- `/` renders the landing page only for authenticated users and redirects signed-out users to `/login`
- unresolved auth state renders `AuthRouteState`
- `*` still renders the not-found page with navigation that makes sense in the new auth flow

Expected: Route behavior matches the approved spec for all authenticated and unauthenticated cases.

- [x] **Step 5: Make the landing page a signed-in home**

Update `apps/health-tracker-web/src/app/pages/landing-page.tsx` so the page still reuses the current design-system surfaces but now clearly indicates authenticated state. Add:

- a short signed-in greeting
- the current user email or equivalent session identifier
- a `Sign Out` action wired through `signOutUser`

Keep the page useful as a temporary dashboard while removing the feeling that it is only a design-system preview.

Expected: A successful login or sign-up lands on a private screen that proves the auth loop works end-to-end.

- [x] **Step 6: Tighten the remaining page flows**

Update `login-page.tsx`, `signup-page.tsx`, and `not-found-page.tsx` as needed so:

- submit success moves the user cleanly into `/`
- auth pages do not flash stale errors after route changes
- not-found navigation leads users back to the right destination in the presence of auth routing

Expected: Edge navigation paths still feel coherent after auth routing is introduced.

- [x] **Step 7: Lint the routed app flow**

Run:

```bash
yarn eslint apps/health-tracker-web/src apps/health-tracker-web/vite.config.ts --max-warnings=0
```

Expected: The app layer changes lint cleanly with the new routing and session logic.

- [x] **Step 8: Commit the route and home integration**

Run:

```bash
git add apps/health-tracker-web docs/superpowers/plans/phase-2-health-tracker-auth
git commit -m "feat: wire auth routes"
```

Expected: Git creates a focused commit for auth-aware routing and the temporary private home.

### Execution Notes

- Added `useAuthSession` as an app-owned session store so auth bootstrap and auth state changes can be consumed from routes and pages without duplicating Supabase wiring.
- Added `AuthRouteState` as the dedicated bootstrap surface while session resolution is pending.
- Reworked the router into `PublicOnlyRoute` and `PrivateRoute` behavior for `/login`, `/signup`, and `/`.
- Upgraded the landing page into a temporary signed-in home with authenticated email context and a real `Sign Out` action.
- Tightened `Login` and `Sign Up` so submit errors clear after further editing and successful submit navigates with `replace`.
- Verification run:
  - `yarn eslint apps/health-tracker-web/src apps/health-tracker-web/vite.config.ts --max-warnings=0`
  - `yarn build`
