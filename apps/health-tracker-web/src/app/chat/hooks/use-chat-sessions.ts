import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { archiveChatSession, listChatSessions } from '@health-tracker/api';

export const chatSessionsQueryKey = (userId: string | undefined) =>
  ['chat-sessions', userId] as const;

export const useChatSessions = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: chatSessionsQueryKey(userId),
    queryFn: () => listChatSessions(userId!),
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });

  const archiveMutation = useMutation({
    mutationFn: (sessionId: string) => archiveChatSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatSessionsQueryKey(userId) });
    },
  });

  return {
    ...query,
    archiveSession: archiveMutation.mutateAsync,
    isArchiving: archiveMutation.isPending,
  };
};
