import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getDailyLog,
  upsertDailyLog,
  type DailyLog,
  type DailyLogPatch,
} from '@health-tracker/api';

export const useDailyLog = (userId: string | undefined, date: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['daily-log', userId, date] as const;

  const { data: log, isLoading } = useQuery({
    queryKey,
    queryFn: () => getDailyLog(userId!, date),
    enabled: Boolean(userId),
    staleTime: 60 * 60 * 1000,
  });

  const { mutateAsync, isPending, error, reset } = useMutation({
    mutationFn: (patch: DailyLogPatch) => upsertDailyLog(userId!, patch),
    onSuccess: (savedLog) => {
      queryClient.setQueryData(queryKey, savedLog);
    },
  });

  return {
    log: (log ?? null) as DailyLog | null,
    isLoading,
    isPending,
    error: error as Error | null,
    save: mutateAsync,
    resetError: reset,
  };
};
