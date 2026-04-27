### Task 02: Update AppShell bottom nav to 3 tabs

> **Design gate:** Before implementing any header visual changes, complete Pencil task #10 (dedicated shell layout frame) first. For the bottom nav tab change only, reference frame `dashboard-predict` (aoNGi) in `docs/superpowers/designs/2026-04-26-dashboard.pen`.
>
> This task covers the bottom nav only. Header appearance changes are deferred to after task #10 produces the dedicated shell frame.

**Files:**

- Modify: `libs/ui/src/lib/app-shell.tsx`

- [x] **Step 1: Open Pencil and read `dashboard-predict` frame**

Open `docs/superpowers/designs/2026-04-26-dashboard.pen` in Pencil. Read frame `dashboard-predict` (aoNGi). Confirm: 3-tab bottom nav — Home (`HomeRounded`), Calendar (`CalendarMonthRounded`), Settings (`TuneRounded`).

- [x] **Step 2: Update `app-shell.tsx`**

Replace the full content of `libs/ui/src/lib/app-shell.tsx`:

```typescript
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Box, Container } from '@mui/material';
import type { PropsWithChildren } from 'react';

import { AppHeader } from './app-header';
import { AppBottomNav, type AppBottomNavItem } from './app-bottom-nav';

const defaultNavItems: AppBottomNavItem[] = [
  { icon: <HomeRoundedIcon />, label: 'Home', value: 'home' },
  { icon: <CalendarMonthRoundedIcon />, label: 'Calendar', value: 'calendar' },
  { icon: <TuneRoundedIcon />, label: 'Settings', value: 'settings' },
];

type AppShellProps = PropsWithChildren<{
  headerAction?: React.ReactNode;
  headerEyebrow?: string;
  headerSubtitleFontWeight?: number;
  headerSubtitle?: string;
  headerTitle?: string;
  navItems?: AppBottomNavItem[];
  onNavChange?: (value: string) => void;
  navValue?: string;
}>;

export function AppShell({
  children,
  headerAction,
  headerEyebrow,
  headerSubtitleFontWeight,
  headerSubtitle,
  headerTitle,
  navItems = defaultNavItems,
  onNavChange,
  navValue = 'home',
}: AppShellProps) {
  return (
    <Box sx={{ minHeight: '100vh', pb: 2, pt: 2, px: 2 }}>
      <Container maxWidth="sm" sx={{ px: '0 !important' }}>
        <AppHeader
          action={headerAction}
          eyebrow={headerEyebrow}
          subtitleFontWeight={headerSubtitleFontWeight}
          subtitle={headerSubtitle}
          title={headerTitle}
        />
        <Box sx={{ pb: 3 }}>{children}</Box>
        <AppBottomNav items={navItems} onChange={onNavChange} value={navValue} />
      </Container>
    </Box>
  );
}
```

- [x] **Step 3: Verify**

```bash
yarn lint && yarn build
```

Expected: no errors.

- [x] **Step 4: Commit**

```bash
git add libs/ui/src/lib/app-shell.tsx
git commit -m "feat: update AppShell bottom nav to 3 tabs (Home, Calendar, Settings)"
```

- [x] **Step 5: Mark complete in index.md**

Check off Task 02 in `docs/superpowers/plans/phase-5-dashboard/index.md`.
