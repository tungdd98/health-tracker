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
        left: 16,
        position: 'sticky',
        right: 16,
        zIndex: 10,
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, nextValue: string) => onChange?.(nextValue)}
      >
        {items.map((item) => (
          <BottomNavigationAction
            key={item.value}
            icon={item.icon}
            label={item.label}
            value={item.value}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
