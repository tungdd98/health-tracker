### Task 06: Build the UI library primitives

**Files:**

- Create: `libs/ui/src/lib/app-shell.tsx`
- Create: `libs/ui/src/lib/app-header.tsx`
- Create: `libs/ui/src/lib/page-section.tsx`
- Create: `libs/ui/src/lib/loading-block.tsx`
- Create: `libs/ui/src/lib/empty-state.tsx`
- Modify: `libs/ui/src/index.ts`

- [x] **Step 1: Implement the shared shell and section components**

Create `libs/ui/src/lib/app-shell.tsx`:

```tsx
import { Box, Container } from '@mui/material';
import type { PropsWithChildren } from 'react';

import { AppHeader } from './app-header';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
```

Create `libs/ui/src/lib/page-section.tsx`:

```tsx
import { Box, Card, Stack, Typography } from '@mui/material';
import type { PropsWithChildren } from 'react';

type PageSectionProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
}>;

export function PageSection({ eyebrow, title, description, children }: PageSectionProps) {
  return (
    <Card sx={{ p: 4 }}>
      <Stack spacing={2}>
        {eyebrow ? (
          <Typography color="primary.main" variant="overline">
            {eyebrow}
          </Typography>
        ) : null}
        <Box>
          <Typography variant="h2">{title}</Typography>
          {description ? <Typography color="text.secondary">{description}</Typography> : null}
        </Box>
        {children}
      </Stack>
    </Card>
  );
}
```

Expected: The shared library has a stable application shell and standard page section wrapper.

- [x] **Step 2: Implement the header, loading, and empty states**

Create `libs/ui/src/lib/app-header.tsx`:

```tsx
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { Box, Stack, Typography } from '@mui/material';

export function AppHeader() {
  return (
    <Box component="header" sx={{ px: 3, py: 2 }}>
      <Stack alignItems="center" direction="row" spacing={1.5}>
        <FavoriteRoundedIcon color="primary" />
        <Typography variant="h6">Health Tracker</Typography>
      </Stack>
    </Box>
  );
}
```

Create `libs/ui/src/lib/loading-block.tsx`:

```tsx
import { Skeleton, Stack } from '@mui/material';

export function LoadingBlock() {
  return (
    <Stack spacing={1.5}>
      <Skeleton height={32} variant="rounded" />
      <Skeleton height={24} variant="rounded" width="80%" />
      <Skeleton height={160} variant="rounded" />
    </Stack>
  );
}
```

Create `libs/ui/src/lib/empty-state.tsx`:

```tsx
import { Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Stack alignItems="flex-start" spacing={2}>
      <Typography variant="h5">{title}</Typography>
      <Typography color="text.secondary">{description}</Typography>
      {action}
    </Stack>
  );
}
```

Expected: The UI library contains the project-specific primitives named in the design spec.

- [x] **Step 3: Export the UI surface**

Set `libs/ui/src/index.ts` to:

```ts
export * from './lib/app-shell';
export * from './lib/app-header';
export * from './lib/page-section';
export * from './lib/loading-block';
export * from './lib/empty-state';
```

Expected: Consumers can import all project-level UI building blocks from the library root.

- [x] **Step 4: Commit the UI primitives**

Run:

```bash
git add libs/ui
git commit -m "feat: add ui foundation"
```

Expected: Git creates a commit for the UI library.
