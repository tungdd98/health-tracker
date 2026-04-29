export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type ChatSendRequest = {
  session_id?: string | null;
  user_message: string;
};

export type AssistantPreferenceProfile = {
  addressingStyle: string | null;
  chatbotName: string | null;
  responseLength: 'short' | 'medium' | 'detailed' | null;
  tone: 'friendly' | 'neutral' | 'expert' | null;
};

export type AssistantPersonalizationProfile = {
  preferences: AssistantPreferenceProfile;
  goals: string[];
};

export type ChatSseErrorCode =
  | 'invalid_request'
  | 'unauthorized'
  | 'rate_limited'
  | 'upstream'
  | 'upstream_busy'
  | 'server_misconfig';

export type ChatSseEventMap = {
  session: { session_id: string };
  delta: { text: string };
  tool_call: { name: string; input: Record<string, unknown> };
  emergency: { reason: string };
  done: { message_id: string | null; usage: { input: number; output: number } };
  error: { code: ChatSseErrorCode; message: string };
};

export type AnthropicUsage = {
  input_tokens: number;
  output_tokens: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
};

export type AnthropicTextBlock = {
  type: 'text';
  text: string;
};

export type AnthropicToolUseBlock = {
  type: 'tool_use';
  id: string;
  name: string;
  input: Record<string, unknown>;
};

export type AnthropicToolResultBlock = {
  type: 'tool_result';
  tool_use_id: string;
  content: string | Array<{ type: 'text'; text: string }>;
  is_error?: boolean;
};

export type AnthropicContentBlock =
  | AnthropicTextBlock
  | AnthropicToolUseBlock
  | AnthropicToolResultBlock;

export type AnthropicMessage = {
  role: 'user' | 'assistant';
  content: string | AnthropicContentBlock[];
};

export type StoredChatMessage = {
  role: 'user' | 'assistant' | 'tool';
  content: AnthropicContentBlock[];
  tokenInput?: number | null;
  tokenOutput?: number | null;
};

export type ChatSessionRow = {
  id: string;
  title: string | null;
};

export type ChatMessageRow = {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: AnthropicContentBlock[];
  token_input: number | null;
  token_output: number | null;
  created_at: string;
};
