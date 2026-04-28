import type { ReactNode } from 'react';
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material';

export type AppBottomNavItem = {
  icon: ReactNode;
  label: string;
  value: string;
};

type AppBottomNavProps = {
  items: AppBottomNavItem[];
  value: string;
  onChange?: (value: string) => void;
};

export function AppBottomNav({ items, value, onChange }: AppBottomNavProps) {
  return (
    <>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.surface.overlay,
          bottom: 0,
          height: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          left: 0,
          position: 'fixed',
          right: 0,
          zIndex: 9,
        })}
      />
      <Paper
        elevation={0}
        sx={(theme) => ({
          backgroundColor: theme.palette.surface.overlay,
          borderRadius: theme.appTokens.radius.xl,
          bottom: 16,
          boxShadow: theme.appTokens.shadow.floating,
          left: '50%',
          position: 'fixed',
          transform: 'translateX(-50%)',
          width: 'min(calc(100vw - 32px), 600px)',
          zIndex: 10,
        })}
      >
        <BottomNavigation
          showLabels
          sx={{
            bgcolor: 'transparent',
            gap: 0.5,
            minHeight: 62,
            p: 0.5,
          }}
          value={value}
          onChange={(_event, nextValue: string) => onChange?.(nextValue)}
        >
          {items.map((item) => (
            <BottomNavigationAction
              key={item.value}
              icon={item.icon}
              label={item.label}
              sx={(theme) => ({
                borderRadius: theme.appTokens.radius.xl,
                color: 'text.secondary',
                minHeight: '100%',
                minWidth: 0,
                py: 0.75,
                '& .MuiBottomNavigationAction-label': {
                  ...theme.appTokens.typography.microLabel,
                  fontSize: theme.appTokens.typography.microLabel.fontSize,
                  mt: 0.5,
                  transform: 'none',
                },
                '& .MuiBottomNavigationAction-label.Mui-selected': {
                  fontSize: theme.appTokens.typography.microLabel.fontSize,
                  transform: 'none',
                },
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.main',
                },
                '&.Mui-selected .MuiSvgIcon-root': {
                  color: 'primary.contrastText',
                },
                '&.Mui-selected .MuiBottomNavigationAction-label': {
                  color: 'primary.contrastText',
                },
              })}
              value={item.value}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </>
  );
}
