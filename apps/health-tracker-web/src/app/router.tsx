import { createBrowserRouter, Navigate } from 'react-router-dom';

import { LandingPage } from './pages/landing-page';
import { LoginPage } from './pages/login-page';
import { NotFoundPage } from './pages/not-found-page';
import { SignUpPage } from './pages/signup-page';
import { useAuthSession } from './auth/use-auth-session';
import { AuthRouteState } from './components/auth-route-state';

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthResolved, session } = useAuthSession();

  if (!isAuthResolved) {
    return <AuthRouteState />;
  }

  if (session) {
    return <Navigate replace to="/" />;
  }

  return <>{children}</>;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthResolved, session } = useAuthSession();

  if (!isAuthResolved) {
    return <AuthRouteState />;
  }

  if (!session) {
    return <Navigate replace to="/login" />;
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
