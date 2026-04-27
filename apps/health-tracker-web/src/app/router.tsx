import { createBrowserRouter, Navigate } from 'react-router-dom';

import { useAuthSession } from './auth/use-auth-session';
import { CalendarPage } from './calendar/calendar-page';
import { AuthRouteState } from './components/auth-route-state';
import { DashboardPage } from './dashboard/dashboard-page';
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
