import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Box, Container } from '@mui/material';
import type { PropsWithChildren } from 'react';

import { AppHeader } from './app-header';
import { AppBottomNav, type AppBottomNavItem } from './app-bottom-nav';

const defaultNavItems: AppBottomNavItem[] = [
  { icon: <HomeRoundedIcon />, label: 'Home', value: 'home' },
  { icon: <FavoriteBorderRoundedIcon />, label: 'Log', value: 'log' },
  { icon: <InsightsRoundedIcon />, label: 'Trends', value: 'trends' },
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
