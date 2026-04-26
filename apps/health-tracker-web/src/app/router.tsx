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
