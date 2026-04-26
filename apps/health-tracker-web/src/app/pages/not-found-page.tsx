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
