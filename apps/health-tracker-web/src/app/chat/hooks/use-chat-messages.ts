import { useQuery } from '@tanstack/react-query';

import { listChatMessages } from '@health-tracker/api';

export const chatMessagesQueryKey = (sessionId: string | null) =>
  ['chat-messages', sessionId] as const;

export const useChatMessages = (sessionId: string | null) =>
  useQuery({
    queryKey: chatMessagesQueryKey(sessionId),
    queryFn: () => listChatMessages(sessionId!),
    enabled: Boolean(sessionId),
    staleTime: 30 * 1000,
  });
