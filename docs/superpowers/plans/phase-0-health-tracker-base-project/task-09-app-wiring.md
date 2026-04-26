### Task 09: Wire the app providers, routes, and screens

**Files:**
- Create: `apps/health-tracker-web/src/app/providers.tsx`
- Create: `apps/health-tracker-web/src/app/router.tsx`
- Create: `apps/health-tracker-web/src/app/pages/landing-page.tsx`
- Create: `apps/health-tracker-web/src/app/pages/not-found-page.tsx`
- Modify: `apps/health-tracker-web/src/app/app.tsx`
- Modify: `apps/health-tracker-web/src/main.tsx`

- [ ] **Step 1: Implement the provider composition**

Create `apps/health-tracker-web/src/app/providers.tsx`:

```tsx
import { QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';

import { createAppQueryClient, supabase } from '@health-tracker/api';
import { appTheme } from '@health-tracker/theme';

void supabase;

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => createAppQueryClient());

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  );
}
```

Expected: The app has one explicit provider composition entrypoint that wires theme, query client, and Supabase bootstrap.

- [ ] **Step 2: Implement the routes and screens**

Create `apps/health-tracker-web/src/app/pages/landing-page.tsx`:

```tsx
import { Stack, Typography } from '@mui/material';

import { AppShell, PageSection } from '@health-tracker/ui';

export function LandingPage() {
  return (
    <AppShell>
      <PageSection
        eyebrow="Base project"
        title="Health Tracker foundation is ready"
        description="This phase focuses on project setup, shared libraries, and provider wiring."
      >
        <Stack spacing={1}>
          <Typography>React, Nx, MUI, React Query, Supabase, and shared foundations are in place.</Typography>
          <Typography color="text.secondary">
            The next phase can start adding auth and health-tracking features on top of this base.
          </Typography>
        </Stack>
      </PageSection>
    </AppShell>
  );
}
```

Create `apps/health-tracker-web/src/app/pages/not-found-page.tsx`:

```tsx
import { Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { AppShell, EmptyState } from '@health-tracker/ui';

export function NotFoundPage() {
  return (
    <AppShell>
      <EmptyState
        title="Page not found"
        description="The page you requested does not exist in this phase of the project."
        action={
          <Button component={RouterLink} to="/" variant="contained">
            Back to home
          </Button>
        }
      />
    </AppShell>
  );
}
```

Create `apps/health-tracker-web/src/app/router.tsx`:

```tsx
import { createBrowserRouter } from 'react-router-dom';

import { LandingPage } from './pages/landing-page';
import { NotFoundPage } from './pages/not-found-page';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
```

Expected: The app exposes `/` and `*` with the route structure required by the spec.

- [ ] **Step 3: Wire the app root to providers and router**

Set `apps/health-tracker-web/src/app/app.tsx` to:

```tsx
import { RouterProvider } from 'react-router-dom';

import { AppProviders } from './providers';
import { appRouter } from './router';

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={appRouter} />
    </AppProviders>
  );
}

export default App;
```

Set `apps/health-tracker-web/src/main.tsx` to:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app/app';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Expected: The generated app is replaced with the shared-provider bootstrap and route-based screen composition.

- [ ] **Step 4: Commit the app wiring**

Run:

```bash
git add apps/health-tracker-web
git commit -m "feat: wire app providers and routes"
```

Expected: Git creates a commit for the app bootstrap, pages, and router setup.
