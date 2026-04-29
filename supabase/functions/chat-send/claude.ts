import type {
  AnthropicContentBlock,
  AnthropicMessage,
  AnthropicTextBlock,
  AnthropicToolResultBlock,
  AnthropicToolUseBlock,
  AnthropicUsage,
} from './types.ts';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const EMERGENCY_TOKEN = '[[EMERGENCY]]';

type StreamCallbacks = {
  onDelta: (text: string) => void;
  onEmergency: () => void;
};

type StreamResult = {
  assistantContent: AnthropicContentBlock[];
  stopReason: string | null;
  usage: AnthropicUsage;
  toolCalls: AnthropicToolUseBlock[];
};

type MutableToolUseBlock = AnthropicToolUseBlock & {
  __partialJson?: string;
};

type StreamContentBlock = AnthropicTextBlock | MutableToolUseBlock;

const sanitizeAssistantContent = (content: AnthropicContentBlock[]) =>
  content.map((block) => {
    if (block.type !== 'text') {
      return block;
    }

    return {
      ...block,
      text: block.text.replaceAll(EMERGENCY_TOKEN, '').trim(),
    } satisfies AnthropicTextBlock;
  });

export const stripMutableToolUseInternals = (
  block: AnthropicTextBlock | AnthropicToolResultBlock | MutableToolUseBlock,
): AnthropicContentBlock => {
  if (block.type !== 'tool_use') {
    return block;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __partialJson: _partialJson, ...toolBlock } = block;
  return toolBlock;
};

const emitSafeText = (
  fullText: string,
  emittedLength: number,
  emergencyTriggered: boolean,
  callbacks: StreamCallbacks,
) => {
  if (emergencyTriggered) {
    const trailingText = fullText.slice(emittedLength);

    if (trailingText) {
      callbacks.onDelta(trailingText);
      return fullText.length;
    }

    return emittedLength;
  }

  const tokenIndex = fullText.indexOf(EMERGENCY_TOKEN);

  if (tokenIndex >= 0) {
    const safeText = fullText.slice(emittedLength, tokenIndex);

    if (safeText) {
      callbacks.onDelta(safeText);
    }

    callbacks.onEmergency();

    const afterTokenIndex = tokenIndex + EMERGENCY_TOKEN.length;
    const trailingText = fullText.slice(afterTokenIndex);

    if (trailingText) {
      callbacks.onDelta(trailingText);
    }

    return fullText.length;
  }

  const safeEnd = Math.max(emittedLength, fullText.length - (EMERGENCY_TOKEN.length - 1));
  const safeText = fullText.slice(emittedLength, safeEnd);

  if (safeText) {
    callbacks.onDelta(safeText);
  }

  return safeEnd;
};

const parseSseChunk = (chunk: string) => {
  const lines = chunk.split('\n');
  let eventName = '';
  let data = '';

  lines.forEach((line) => {
    if (line.startsWith('event:')) {
      eventName = line.slice(6).trim();
    }

    if (line.startsWith('data:')) {
      data += line.slice(5).trim();
    }
  });

  if (!eventName || !data) {
    return null;
  }

  return {
    eventName,
    payload: JSON.parse(data) as Record<string, unknown>,
  };
};

export const streamClaudeMessage = async ({
  apiKey,
  messages,
  system,
  tools,
  callbacks,
}: {
  apiKey: string;
  messages: AnthropicMessage[];
  system: Array<Record<string, unknown>>;
  tools: Array<Record<string, unknown>>;
  callbacks: StreamCallbacks;
}): Promise<StreamResult> => {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages,
      system,
      tools,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text();
    const error = new Error(errorText || 'Anthropic request failed.');
    (error as Error & { status?: number }).status = response.status;
    throw error;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const contentByIndex = new Map<number, StreamContentBlock>();
  let buffer = '';
  let fullText = '';
  let emittedLength = 0;
  let emergencyTriggered = false;
  let stopReason: string | null = null;
  let usage: AnthropicUsage = {
    input_tokens: 0,
    output_tokens: 0,
  };

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    parts.forEach((part) => {
      const parsedEvent = parseSseChunk(part.trim());

      if (!parsedEvent) {
        return;
      }

      const { eventName, payload } = parsedEvent;

      if (eventName === 'content_block_start') {
        const index = Number(payload.index);
        const contentBlock = payload.content_block as Record<string, unknown>;

        if (contentBlock.type === 'text') {
          contentByIndex.set(index, {
            type: 'text',
            text: '',
          } satisfies AnthropicTextBlock);
        }

        if (contentBlock.type === 'tool_use') {
          contentByIndex.set(index, {
            type: 'tool_use',
            id: String(contentBlock.id),
            name: String(contentBlock.name),
            input: {},
            __partialJson: '',
          });
        }

        return;
      }

      if (eventName === 'content_block_delta') {
        const index = Number(payload.index);
        const delta = payload.delta as Record<string, unknown>;
        const currentBlock = contentByIndex.get(index);

        if (!currentBlock) {
          return;
        }

        if (currentBlock.type === 'text' && delta.type === 'text_delta') {
          currentBlock.text += String(delta.text ?? '');
          fullText += String(delta.text ?? '');
          const nextEmittedLength = emitSafeText(fullText, emittedLength, emergencyTriggered, {
            onDelta: callbacks.onDelta,
            onEmergency: () => {
              if (!emergencyTriggered) {
                emergencyTriggered = true;
                callbacks.onEmergency();
              }
            },
          });
          emittedLength = nextEmittedLength;
          return;
        }

        if (currentBlock.type === 'tool_use' && delta.type === 'input_json_delta') {
          currentBlock.__partialJson = `${currentBlock.__partialJson ?? ''}${String(delta.partial_json ?? '')}`;
        }

        return;
      }

      if (eventName === 'content_block_stop') {
        const index = Number(payload.index);
        const currentBlock = contentByIndex.get(index);

        if (currentBlock?.type === 'tool_use' && currentBlock.__partialJson) {
          try {
            currentBlock.input = JSON.parse(currentBlock.__partialJson) as Record<string, unknown>;
          } catch {
            currentBlock.input = {};
          }
        }

        return;
      }

      if (eventName === 'message_delta') {
        const delta = payload.delta as Record<string, unknown>;
        stopReason = typeof delta.stop_reason === 'string' ? delta.stop_reason : null;
        usage = payload.usage as AnthropicUsage;
      }
    });
  }

  if (emittedLength < fullText.length) {
    callbacks.onDelta(fullText.slice(emittedLength).replaceAll(EMERGENCY_TOKEN, ''));
  }

  const assistantContent = [...contentByIndex.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([, block]) => stripMutableToolUseInternals(block));

  const sanitizedContent = sanitizeAssistantContent(assistantContent);

  return {
    assistantContent: sanitizedContent,
    stopReason,
    usage,
    toolCalls: sanitizedContent.filter(
      (block): block is AnthropicToolUseBlock => block.type === 'tool_use',
    ),
  };
};
