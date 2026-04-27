import type { ReactNode } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';

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
    <Paper
      elevation={0}
      sx={{
        bottom: 16,
        left: '50%',
        position: 'fixed',
        transform: 'translateX(-50%)',
        width: 'min(calc(100vw - 32px), 600px)',
        zIndex: 10,
      }}
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
            sx={{
              borderRadius: 3,
              color: 'text.secondary',
              minHeight: '100%',
              minWidth: 0,
              py: 0.75,
              '& .MuiBottomNavigationAction-label': {
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: 0.5,
                lineHeight: 1,
                mt: 0.5,
                textTransform: 'uppercase',
                transform: 'none',
              },
              '& .MuiBottomNavigationAction-label.Mui-selected': {
                fontSize: 10,
                transform: 'none',
              },
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
              },
              '&.Mui-selected .MuiBottomNavigationAction-label': {
                color: 'primary.contrastText',
              },
            }}
            value={item.value}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
