import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { QueryClientProvider } from '@tanstack/react-query';
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
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
