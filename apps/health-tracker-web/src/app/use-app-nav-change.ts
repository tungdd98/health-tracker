import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import type { AppNavValue } from '@health-tracker/ui';

const NAV_PATHS: Record<AppNavValue, string> = {
  home: '/',
  calendar: '/calendar',
  chat: '/chat',
  settings: '/settings',
};

export const useAppNavChange = () => {
  const navigate = useNavigate();

  return useCallback(
    (value: AppNavValue) => {
      navigate(NAV_PATHS[value]);
    },
    [navigate],
  );
};
