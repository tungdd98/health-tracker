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
          <Typography>
            React, Nx, MUI, React Query, Supabase, and shared foundations are in place.
          </Typography>
          <Typography color="text.secondary">
            The next phase can start adding auth and health-tracking features on top of this base.
          </Typography>
        </Stack>
      </PageSection>
    </AppShell>
  );
}
