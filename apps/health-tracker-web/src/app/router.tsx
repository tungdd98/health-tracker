import { createBrowserRouter, Navigate } from 'react-router-dom';

import { useAuthSession } from './auth/use-auth-session';
import { AuthRouteState } from './components/auth-route-state';
import { LandingPage } from './pages/landing-page';
import { LoginPage } from './pages/login-page';
import { NotFoundPage } from './pages/not-found-page';
import { OnboardingPage } from './pages/onboarding-page';
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
        <LandingPage />
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
