import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  getChatPersonalization,
  type ChatPersonalization,
  upsertChatPersonalization,
} from '@health-tracker/api';

export const chatPersonalizationQueryKey = (userId: string | undefined) =>
  ['chat-personalization', userId] as const;

export const useChatPersonalization = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: chatPersonalizationQueryKey(userId),
    queryFn: () => getChatPersonalization(userId!),
    enabled: Boolean(userId),
    staleTime: 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: (payload: ChatPersonalization) => upsertChatPersonalization(userId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatPersonalizationQueryKey(userId) });
    },
  });

  return {
    ...query,
    savePersonalization: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
};
