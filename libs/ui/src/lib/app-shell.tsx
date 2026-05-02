import { Box, Container } from '@mui/material';
import type { PropsWithChildren } from 'react';

import { AppHeader } from './app-header';
import { AppBottomNav, type AppBottomNavItem, type AppNavValue } from './app-bottom-nav';
import {
  CalendarMonthRounded,
  ChatBubbleRounded,
  HomeRounded,
  TuneRounded,
} from '@mui/icons-material';

export const defaultNavItems: AppBottomNavItem[] = [
  { icon: <HomeRounded />, label: 'Home', value: 'home' },
  { icon: <CalendarMonthRounded />, label: 'Chu kỳ', value: 'calendar' },
  { icon: <ChatBubbleRounded />, label: 'AI chat', value: 'chat' },
  { icon: <TuneRounded />, label: 'Cài đặt', value: 'settings' },
];

type AppShellProps = PropsWithChildren<{
  headerAction?: React.ReactNode;
  headerEyebrow?: string;
  headerSubtitle?: string;
  headerTitle?: string;
  navItems?: AppBottomNavItem[];
  onNavChange?: (value: AppNavValue) => void;
  navValue?: AppNavValue;
}>;

export function AppShell({
  children,
  headerAction,
  headerEyebrow,
  headerSubtitle,
  headerTitle,
  navItems = defaultNavItems,
  onNavChange,
  navValue = 'home',
}: AppShellProps) {
  return (
    <Box sx={{ minHeight: '100dvh', px: 2, py: 2 }}>
      <Container
        maxWidth="sm"
        sx={{
          px: '0 !important',
        }}
      >
        <AppHeader
          action={headerAction}
          eyebrow={headerEyebrow}
          subtitle={headerSubtitle}
          title={headerTitle}
        />
        <Box sx={{ pb: 14 }}>{children}</Box>
        <AppBottomNav items={navItems} onChange={onNavChange} value={navValue} />
      </Container>
    </Box>
  );
}
