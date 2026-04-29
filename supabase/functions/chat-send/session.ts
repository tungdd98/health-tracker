import type { SupabaseClient } from 'npm:@supabase/supabase-js@2';

import type {
  AnthropicContentBlock,
  AnthropicMessage,
  ChatMessageRow,
  ChatSessionRow,
  StoredChatMessage,
} from './types.ts';

const CHAT_SESSION_COLUMNS = 'id, title';
const CHAT_MESSAGE_COLUMNS = 'id, role, content, token_input, token_output, created_at';

const toolRowsToAnthropicUserMessage = (rows: ChatMessageRow[]): AnthropicMessage => ({
  role: 'user',
  content: rows.flatMap((row) => row.content),
});

export const createChatSession = async (
  supabase: SupabaseClient,
  userId: string,
): Promise<ChatSessionRow> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({
      user_id: userId,
    })
    .select(CHAT_SESSION_COLUMNS)
    .single<ChatSessionRow>();

  if (error) {
    throw error;
  }

  return data;
};

export const getChatSession = async (
  supabase: SupabaseClient,
  sessionId: string,
): Promise<ChatSessionRow | null> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select(CHAT_SESSION_COLUMNS)
    .eq('id', sessionId)
    .maybeSingle<ChatSessionRow>();

  if (error) {
    throw error;
  }

  return data;
};

export const loadChatHistory = async (
  supabase: SupabaseClient,
  sessionId: string,
): Promise<ChatMessageRow[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(CHAT_MESSAGE_COLUMNS)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .returns<ChatMessageRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const toAnthropicHistory = (rows: ChatMessageRow[]): AnthropicMessage[] => {
  const history: AnthropicMessage[] = [];
  let pendingToolRows: ChatMessageRow[] = [];

  const flushPendingToolRows = () => {
    if (pendingToolRows.length === 0) {
      return;
    }

    history.push(toolRowsToAnthropicUserMessage(pendingToolRows));
    pendingToolRows = [];
  };

  rows.forEach((row) => {
    if (row.role === 'tool') {
      pendingToolRows.push(row);
      return;
    }

    flushPendingToolRows();

    history.push({
      role: row.role,
      content: row.content,
    });
  });

  flushPendingToolRows();

  return history;
};

export const trimHistory = (messages: AnthropicMessage[]) =>
  messages.length > 40 ? messages.slice(-30) : messages;

export const persistChatMessages = async (
  supabase: SupabaseClient,
  sessionId: string,
  userId: string,
  messages: StoredChatMessage[],
) => {
  if (messages.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('chat_messages')
    .insert(
      messages.map((message) => ({
        session_id: sessionId,
        user_id: userId,
        role: message.role,
        content: message.content as AnthropicContentBlock[],
        token_input: message.tokenInput ?? null,
        token_output: message.tokenOutput ?? null,
      })),
    )
    .select('id')
    .returns<Array<{ id: string }>>();

  if (error) {
    throw error;
  }

  return data ?? [];
};

export const touchChatSession = async (
  supabase: SupabaseClient,
  sessionId: string,
  title: string | null,
) => {
  const payload: Record<string, string | null> = {
    last_message_at: new Date().toISOString(),
  };

  if (title) {
    payload.title = title;
  }

  const { error } = await supabase.from('chat_sessions').update(payload).eq('id', sessionId);

  if (error) {
    throw error;
  }
};
