import { appEnv, getCurrentSession } from '@health-tracker/api';

import {
  chatSendRequestSchema,
  parseChatStreamEvent,
  type ChatStreamEvent,
} from '../schemas/chat-schemas';

const CHAT_FUNCTION_URL = `${appEnv.VITE_SUPABASE_URL}/functions/v1/chat-send`;

const parseSseEvent = (chunk: string) => {
  const lines = chunk.split('\n');
  let event = '';
  let data = '';

  lines.forEach((line) => {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    }

    if (line.startsWith('data:')) {
      data += line.slice(5).trim();
    }
  });

  if (!event || !data) {
    return null;
  }

  return {
    event,
    data: JSON.parse(data) as unknown,
  };
};

export const streamChatMessage = async ({
  sessionId,
  signal,
  userMessage,
  onEvent,
}: {
  sessionId: string | null;
  signal?: AbortSignal;
  userMessage: string;
  onEvent: (event: ChatStreamEvent) => void;
}) => {
  const payload = chatSendRequestSchema.parse({
    session_id: sessionId,
    user_message: userMessage,
  });
  const { session } = await getCurrentSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    throw new Error('Phiên đăng nhập đã hết hạn.');
  }

  const response = await fetch(CHAT_FUNCTION_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok || !response.body) {
    if (response.status === 401) {
      throw new Error('Phiên đăng nhập đã hết hạn.');
    }

    throw new Error('Không thể kết nối chatbot lúc này.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split('\n\n');
    buffer = chunks.pop() ?? '';

    chunks.forEach((chunk) => {
      const parsed = parseSseEvent(chunk.trim());

      if (!parsed) {
        return;
      }

      onEvent(parseChatStreamEvent(parsed.event, parsed.data));
    });
  }
};
