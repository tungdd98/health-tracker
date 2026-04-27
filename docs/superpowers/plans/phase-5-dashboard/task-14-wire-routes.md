### Task 14: Wire routes, remove LandingPage, update nav handlers

**Files:**

- Modify: `apps/health-tracker-web/src/app/router.tsx`
- Modify: `apps/health-tracker-web/src/app/pages/settings-page.tsx`
- Delete: `apps/health-tracker-web/src/app/pages/landing-page.tsx`

- [x] **Step 1: Update `router.tsx`**

Replace the full content of `apps/health-tracker-web/src/app/router.tsx`:

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { useAuthSession } from './auth/use-auth-session';
import { AuthRouteState } from './components/auth-route-state';
import { DashboardPage } from './dashboard/dashboard-page';
import { CalendarPage } from './calendar/calendar-page';
import { LoginPage } from './pages/login-page';
import { NotFoundPage } from './pages/not-found-page';
import { OnboardingPage } from './pages/onboarding-page';
import { SettingsPage } from './pages/settings-page';
import { SignUpPage } from './pages/signup-page';

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { hasSelectedOnboardingPhase, isAuthResolved, session } = useAuthSession();

  if (!isAuthResolved) {
    return <AuthRouteState />;
  }

  if (session) {
    return <Navigate replace to={hasSelectedOnboardingPhase ? '/' : '/onboarding'} />;
  }

  return <>{children}</>;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { hasSelectedOnboardingPhase, isAuthResolved, session } = useAuthSession();

  if (!isAuthResolved) {
    return <AuthRouteState />;
  }

  if (!session) {
    return <Navigate replace to="/login" />;
  }

  if (!hasSelectedOnboardingPhase) {
    return <Navigate replace to="/onboarding" />;
  }

  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: React.ReactNode }) {
  const { isAuthResolved, isOnboardingComplete, session } = useAuthSession();

  if (!isAuthResolved) {
    return <AuthRouteState />;
  }

  if (!session) {
    return <Navigate replace to="/login" />;
  }

  if (isOnboardingComplete) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
}

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: (
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/calendar',
    element: (
      <PrivateRoute>
        <CalendarPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <OnboardingRoute>
        <OnboardingPage />
      </OnboardingRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <PrivateRoute>
        <SettingsPage />
      </PrivateRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/signup',
    element: (
      <PublicOnlyRoute>
        <SignUpPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

- [x] **Step 2: Add `calendar` branch to `handleNavChange` in `settings-page.tsx`**

Find the `handleNavChange` function in `apps/health-tracker-web/src/app/pages/settings-page.tsx` and replace it:

```typescript
const handleNavChange = (value: string) => {
  if (value === 'home') {
    navigate('/');
    return;
  }

  if (value === 'calendar') {
    navigate('/calendar');
    return;
  }

  if (value === 'settings') {
    navigate('/settings');
  }
};
```

- [x] **Step 3: Delete `landing-page.tsx`**

```bash
rm apps/health-tracker-web/src/app/pages/landing-page.tsx
```

- [x] **Step 4: Verify — no remaining references to LandingPage**

```bash
grep -r "LandingPage\|landing-page" apps/health-tracker-web/src
```

Expected: no output (zero references remaining).

- [x] **Step 5: Run full Definition of Done**

```bash
yarn format && yarn lint && yarn build
```

Expected: no errors.

- [x] **Step 6: Commit**

```bash
git add apps/health-tracker-web/src/app/router.tsx \
        apps/health-tracker-web/src/app/pages/settings-page.tsx
git rm apps/health-tracker-web/src/app/pages/landing-page.tsx
git commit -m "feat: wire dashboard and calendar routes, remove LandingPage"
```

- [x] **Step 7: Mark complete in index.md**

Check off Task 14 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
