import '../edge-runtime.d.ts';

import { createClient } from 'npm:@supabase/supabase-js@2';

import { streamClaudeMessage } from './claude.ts';
import { buildSystemPrompt } from './prompts.ts';
import { checkChatRateLimit, incrementChatUsage } from './rate-limit.ts';
import {
  createChatSession,
  getChatSession,
  loadAssistantPersonalization,
  loadChatHistory,
  persistChatMessages,
  toAnthropicHistory,
  touchChatSession,
  trimHistory,
} from './session.ts';
import { chatToolDefinitions, executeToolCalls } from './tools.ts';
import type {
  AnthropicMessage,
  ChatSendRequest,
  ChatSseErrorCode,
  ChatSseEventMap,
  StoredChatMessage,
} from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Origin': '*',
};

const sendEvent = <TEvent extends keyof ChatSseEventMap>(
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  event: TEvent,
  payload: ChatSseEventMap[TEvent],
) => {
  controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`));
};

const sendErrorEvent = (
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder,
  code: ChatSseErrorCode,
  message: string,
) => {
  sendEvent(controller, encoder, 'error', {
    code,
    message,
  });
};

const buildTitleFromMessage = (message: string) => {
  const trimmed = message.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.length <= 40 ? trimmed : `${trimmed.slice(0, 37).trimEnd()}...`;
};

const getAuthHeader = (request: Request) => {
  const authHeader = request.headers.get('Authorization') ?? request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader;
};

const parseRequest = async (request: Request): Promise<ChatSendRequest> => {
  const body = (await request.json()) as ChatSendRequest;
  const userMessage = body.user_message?.trim();

  if (!userMessage) {
    throw new Error('`user_message` là bắt buộc.');
  }

  return {
    session_id: body.session_id ?? null,
    user_message: userMessage,
  };
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    });
  }

  const authHeader = getAuthHeader(request);

  if (!authHeader) {
    return Response.json(
      {
        error: 'Missing authorization header.',
      },
      {
        headers: corsHeaders,
        status: 401,
      },
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
  const supabaseAnonKey =
    Deno.env.get('SUPABASE_ANON_KEY') ?? Deno.env.get('SB_PUBLISHABLE_KEY') ?? '';
  const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

  if (!supabaseUrl || !supabaseAnonKey || !anthropicApiKey) {
    return Response.json(
      {
        error: 'Missing server configuration.',
      },
      {
        headers: corsHeaders,
        status: 500,
      },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return Response.json(
      {
        error: 'Unauthorized',
      },
      {
        headers: corsHeaders,
        status: 401,
      },
    );
  }

  let payload: ChatSendRequest;

  try {
    payload = await parseRequest(request);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Invalid request.',
      },
      {
        headers: corsHeaders,
        status: 400,
      },
    );
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();

      try {
        const usageState = await checkChatRateLimit(supabase, user.id);

        if (usageState.exceeded) {
          sendErrorEvent(
            controller,
            encoder,
            'rate_limited',
            'Đã đạt giới hạn tin nhắn trong thời gian ngắn. Vui lòng thử lại sau.',
          );
          controller.close();
          return;
        }

        let isNewSession = false;
        let sessionId = payload.session_id ?? null;

        if (sessionId) {
          const existingSession = await getChatSession(supabase, sessionId);

          if (!existingSession) {
            sendErrorEvent(controller, encoder, 'invalid_request', 'Không tìm thấy phiên chat.');
            controller.close();
            return;
          }
        } else {
          const createdSession = await createChatSession(supabase, user.id);
          sessionId = createdSession.id;
          isNewSession = true;
          sendEvent(controller, encoder, 'session', {
            session_id: sessionId,
          });
        }

        const historyRows = await loadChatHistory(supabase, sessionId);
        const personalization = await loadAssistantPersonalization(supabase, user.id);
        const history = trimHistory(toAnthropicHistory(historyRows));
        const userMessageBlocks = [
          {
            type: 'text',
            text: payload.user_message,
          } as const,
        ];

        const messages: AnthropicMessage[] = history.concat({
          role: 'user',
          content: userMessageBlocks,
        });
        const pendingStoredMessages: StoredChatMessage[] = [
          {
            role: 'user',
            content: userMessageBlocks,
          },
        ];
        const system = buildSystemPrompt({
          displayName:
            typeof user.user_metadata?.displayName === 'string'
              ? user.user_metadata.displayName
              : null,
          emergencyContactName:
            typeof user.user_metadata?.emergencyContactName === 'string'
              ? user.user_metadata.emergencyContactName
              : null,
          personalization,
        });
        let finalUsage = {
          input: 0,
          output: 0,
        };

        for (let round = 0; round < 6; round += 1) {
          const result = await streamClaudeMessage({
            apiKey: anthropicApiKey,
            messages,
            system,
            tools: [...chatToolDefinitions],
            callbacks: {
              onDelta: (text) => {
                if (!text) {
                  return;
                }

                sendEvent(controller, encoder, 'delta', {
                  text,
                });
              },
              onEmergency: () => {
                sendEvent(controller, encoder, 'emergency', {
                  reason: 'possible_emergency',
                });
              },
            },
          });

          pendingStoredMessages.push({
            role: 'assistant',
            content: result.assistantContent,
          });
          messages.push({
            role: 'assistant',
            content: result.assistantContent,
          });

          if (result.stopReason !== 'tool_use' || result.toolCalls.length === 0) {
            finalUsage = {
              input: result.usage.input_tokens,
              output: result.usage.output_tokens,
            };
            pendingStoredMessages[pendingStoredMessages.length - 1].tokenInput = finalUsage.input;
            pendingStoredMessages[pendingStoredMessages.length - 1].tokenOutput = finalUsage.output;
            break;
          }

          result.toolCalls.forEach((toolCall) => {
            sendEvent(controller, encoder, 'tool_call', {
              name: toolCall.name,
              input: toolCall.input,
            });
          });

          const toolResults = await executeToolCalls(supabase, user, result.toolCalls);

          pendingStoredMessages.push(
            ...toolResults.map((toolResult) => ({
              role: 'tool' as const,
              content: [toolResult],
            })),
          );
          messages.push({
            role: 'user',
            content: toolResults,
          });
        }

        const insertedRows = await persistChatMessages(
          supabase,
          sessionId,
          user.id,
          pendingStoredMessages,
        );

        await touchChatSession(
          supabase,
          sessionId,
          isNewSession ? buildTitleFromMessage(payload.user_message) : null,
        );
        await incrementChatUsage(supabase, user.id);

        sendEvent(controller, encoder, 'done', {
          message_id: insertedRows.at(-1)?.id ?? null,
          usage: finalUsage,
        });
        controller.close();
      } catch (error) {
        const status = error instanceof Error && 'status' in error ? Number(error.status) : null;

        if (status === 429) {
          sendErrorEvent(controller, encoder, 'upstream_busy', 'Bot đang quá tải, thử lại sau.');
        } else if (status === 401 || status === 403) {
          sendErrorEvent(
            controller,
            encoder,
            'server_misconfig',
            'Lỗi cấu hình AI server, vui lòng liên hệ quản trị viên.',
          );
        } else {
          sendErrorEvent(
            controller,
            encoder,
            'upstream',
            error instanceof Error ? error.message : 'Không thể xử lý tin nhắn lúc này.',
          );
        }

        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    },
  });
});
