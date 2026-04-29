import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Box, Container } from '@mui/material';
import type { PropsWithChildren } from 'react';

import { AppHeader } from './app-header';
import { AppBottomNav, type AppBottomNavItem, type AppNavValue } from './app-bottom-nav';

export const defaultNavItems: AppBottomNavItem[] = [
  { icon: <HomeRoundedIcon />, label: 'Trang chủ', value: 'home' },
  { icon: <CalendarMonthRoundedIcon />, label: 'Chu kỳ', value: 'calendar' },
  { icon: <ChatBubbleRoundedIcon />, label: 'AI', value: 'chat' },
  { icon: <TuneRoundedIcon />, label: 'Cài đặt', value: 'settings' },
];

type AppShellProps = PropsWithChildren<{
  headerAction?: React.ReactNode;
  headerEyebrow?: string;
  headerSubtitleFontWeight?: number;
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
  headerSubtitleFontWeight,
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
          subtitleFontWeight={headerSubtitleFontWeight}
          subtitle={headerSubtitle}
          title={headerTitle}
        />
        <Box sx={{ pb: 14 }}>{children}</Box>
        <AppBottomNav items={navItems} onChange={onNavChange} value={navValue} />
      </Container>
    </Box>
  );
}
