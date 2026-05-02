import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';

import { generateDailyTip, getDailyTip } from '@health-tracker/api';

import type { CyclePhase } from './cycle-utils';
import { pickTip } from './tip-library';

export function useDailyTip(
  userId: string,
  phase: CyclePhase,
  date: string,
): { tip: string; isLoading: boolean } {
  const { data: tip, isLoading } = useQuery({
    queryKey: ['daily-tip', userId, date],
    queryFn: async () => {
      const cached = await getDailyTip(userId, date);
      if (cached) return cached;
      return generateDailyTip(phase, date);
    },
    staleTime: Infinity,
    retry: 1,
  });

  return {
    tip: tip ?? pickTip(phase, DateTime.local()),
    isLoading,
  };
}
