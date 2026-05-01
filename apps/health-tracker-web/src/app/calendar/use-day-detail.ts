import { useQuery } from '@tanstack/react-query';

import { getDailyLog, type DailyLog } from '@health-tracker/api';

export const useDayDetail = (userId: string | undefined, date: string | null) => {
  const { data, isLoading } = useQuery({
    queryKey: ['daily-log', userId, date],
    queryFn: () => getDailyLog(userId!, date!),
    enabled: Boolean(userId) && Boolean(date),
    staleTime: 60 * 60 * 1000,
  });

  return {
    log: (data ?? null) as DailyLog | null,
    isLoading,
  };
};
