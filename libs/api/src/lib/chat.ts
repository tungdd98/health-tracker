import { supabase } from './supabase';

export type ChatMessageRole = 'user' | 'assistant' | 'tool';

export type ChatTextContentBlock = {
  type: 'text';
  text: string;
};

export type ChatToolUseContentBlock = {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
};

export type ChatToolResultContentBlock = {
  type: 'tool_result';
  tool_use_id: string;
  content: string | Array<{ type: 'text'; text: string }>;
  is_error?: boolean;
};

export type ChatContentBlock =
  | ChatTextContentBlock
  | ChatToolUseContentBlock
  | ChatToolResultContentBlock
  | Record<string, unknown>;

export type ChatSession = {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
  lastMessageAt: string;
  isArchived: boolean;
};

export type ChatMessage = {
  id: string;
  sessionId: string;
  userId: string;
  role: ChatMessageRole;
  content: ChatContentBlock[];
  tokenInput: number | null;
  tokenOutput: number | null;
  createdAt: string;
};

type ChatSessionRow = {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  last_message_at: string;
  is_archived: boolean;
};

type ChatMessageRow = {
  id: string;
  session_id: string;
  user_id: string;
  role: ChatMessageRole;
  content: ChatContentBlock[] | null;
  token_input: number | null;
  token_output: number | null;
  created_at: string;
};

const CHAT_SESSION_COLUMNS = 'id, user_id, title, created_at, last_message_at, is_archived';
const CHAT_MESSAGE_COLUMNS =
  'id, session_id, user_id, role, content, token_input, token_output, created_at';

const toChatSession = (row: ChatSessionRow): ChatSession => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  createdAt: row.created_at,
  lastMessageAt: row.last_message_at,
  isArchived: row.is_archived,
});

const toChatMessage = (row: ChatMessageRow): ChatMessage => ({
  id: row.id,
  sessionId: row.session_id,
  userId: row.user_id,
  role: row.role,
  content: row.content ?? [],
  tokenInput: row.token_input,
  tokenOutput: row.token_output,
  createdAt: row.created_at,
});

export const listChatSessions = async (userId: string): Promise<ChatSession[]> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select(CHAT_SESSION_COLUMNS)
    .eq('user_id', userId)
    .eq('is_archived', false)
    .order('last_message_at', { ascending: false })
    .returns<ChatSessionRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map(toChatSession);
};

export const getChatSession = async (sessionId: string): Promise<ChatSession | null> => {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select(CHAT_SESSION_COLUMNS)
    .eq('id', sessionId)
    .maybeSingle<ChatSessionRow>();

  if (error) {
    throw error;
  }

  return data ? toChatSession(data) : null;
};

export const listChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select(CHAT_MESSAGE_COLUMNS)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .returns<ChatMessageRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map(toChatMessage);
};

export const archiveChatSession = async (sessionId: string): Promise<void> => {
  const { error } = await supabase
    .from('chat_sessions')
    .update({
      is_archived: true,
    })
    .eq('id', sessionId);

  if (error) {
    throw error;
  }
};

export const extractChatText = (content: ChatContentBlock[]): string =>
  content
    .flatMap((block) => {
      if (
        typeof block === 'object' &&
        block !== null &&
        'type' in block &&
        block.type === 'text' &&
        'text' in block &&
        typeof block.text === 'string'
      ) {
        return [block.text];
      }

      if (
        typeof block === 'object' &&
        block !== null &&
        'type' in block &&
        block.type === 'tool_result' &&
        'content' in block &&
        typeof block.content === 'string'
      ) {
        return [block.content];
      }

      return [];
    })
    .join('\n')
    .trim();
