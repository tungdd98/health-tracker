import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { chatMessagesQueryKey } from './use-chat-messages';
import { chatSessionsQueryKey } from './use-chat-sessions';
import { streamChatMessage } from '../api/chat-client';
import type { ChatStreamEvent } from '../schemas/chat-schemas';

export type ChatRuntimeStatus = 'idle' | 'pending' | 'streaming' | 'error';
export type ChatErrorCode = Extract<ChatStreamEvent, { type: 'error' }>['payload']['code'];

export const useChatStream = ({
  activeSessionId,
  isMessagesFetching,
  persistedMessageCount,
  userId,
  onSessionCreated,
}: {
  activeSessionId: string | null;
  isMessagesFetching: boolean;
  persistedMessageCount: number;
  userId: string | undefined;
  onSessionCreated: (sessionId: string) => void;
}) => {
  const queryClient = useQueryClient();
  const controllerRef = useRef<AbortController | null>(null);
  const currentSessionIdRef = useRef<string | null>(activeSessionId);
  const [status, setStatus] = useState<ChatRuntimeStatus>('idle');
  const [pendingUserMessage, setPendingUserMessage] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [toolCalls, setToolCalls] = useState<
    Array<{ name: string; input: Record<string, unknown> }>
  >([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const [errorCode, setErrorCode] = useState<ChatErrorCode | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUsage, setLastUsage] = useState<{ input: number; output: number } | null>(null);
  const [isWaitingForPersistence, setIsWaitingForPersistence] = useState(false);
  const expectedMessageCountRef = useRef(0);
  const hasPersistedResponse = persistedMessageCount >= expectedMessageCountRef.current;
  const shouldShowAssistantDraft =
    Boolean(streamingText) &&
    (status === 'streaming' ||
      Boolean(errorMessage) ||
      (isWaitingForPersistence && !hasPersistedResponse));

  useEffect(() => {
    currentSessionIdRef.current = activeSessionId;
  }, [activeSessionId]);

  const resetRuntimeState = () => {
    setStatus('idle');
    setPendingUserMessage('');
    setStreamingText('');
    setToolCalls([]);
    setIsEmergency(false);
    setErrorCode(null);
    setErrorMessage('');
    setIsWaitingForPersistence(false);
    expectedMessageCountRef.current = 0;
  };

  useEffect(() => {
    if (!isWaitingForPersistence || isMessagesFetching) {
      return;
    }

    if (persistedMessageCount < expectedMessageCountRef.current) {
      return;
    }

    setPendingUserMessage('');
    setStreamingText('');
    setToolCalls([]);
    setIsWaitingForPersistence(false);
    expectedMessageCountRef.current = 0;
  }, [isMessagesFetching, isWaitingForPersistence, persistedMessageCount]);

  const handleEvent = (event: ChatStreamEvent) => {
    switch (event.type) {
      case 'session':
        currentSessionIdRef.current = event.payload.session_id;
        onSessionCreated(event.payload.session_id);
        queryClient.invalidateQueries({ queryKey: chatSessionsQueryKey(userId) });
        break;
      case 'delta':
        setStatus('streaming');
        setStreamingText((current) => `${current}${event.payload.text}`);
        break;
      case 'tool_call':
        setStatus('streaming');
        setToolCalls((current) => current.concat(event.payload));
        break;
      case 'emergency':
        setIsEmergency(true);
        break;
      case 'done':
        setStatus('idle');
        setIsWaitingForPersistence(true);
        expectedMessageCountRef.current = persistedMessageCount + 2;
        setLastUsage(event.payload.usage);
        queryClient.invalidateQueries({ queryKey: chatSessionsQueryKey(userId) });
        queryClient.invalidateQueries({
          queryKey: chatMessagesQueryKey(currentSessionIdRef.current),
        });
        break;
      case 'error':
        setStatus('error');
        setIsWaitingForPersistence(false);
        setErrorCode(event.payload.code);
        setErrorMessage(event.payload.message);
        break;
    }
  };

  const sendMessage = async (message: string) => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus('pending');
    setPendingUserMessage(trimmedMessage);
    setStreamingText('');
    setToolCalls([]);
    setIsEmergency(false);
    setIsWaitingForPersistence(false);
    setErrorCode(null);
    setErrorMessage('');
    expectedMessageCountRef.current = persistedMessageCount + 2;

    try {
      await streamChatMessage({
        sessionId: activeSessionId,
        signal: controller.signal,
        userMessage: trimmedMessage,
        onEvent: handleEvent,
      });
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      setStatus('error');
      setErrorCode('upstream');
      setErrorMessage(error instanceof Error ? error.message : 'Không thể gửi tin nhắn.');
    } finally {
      queryClient.invalidateQueries({
        queryKey: chatMessagesQueryKey(currentSessionIdRef.current),
      });
    }
  };

  return {
    status,
    pendingUserMessage,
    streamingText,
    toolCalls,
    isEmergency,
    errorCode,
    errorMessage,
    lastUsage,
    shouldShowAssistantDraft,
    isBusy: status === 'pending' || status === 'streaming',
    sendMessage,
    resetRuntimeState,
  };
};
