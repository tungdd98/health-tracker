import { z } from 'zod';

export const assistantPreferenceSchema = z.object({
  addressing_style: z.string().trim().max(60).nullable(),
  response_length: z.enum(['short', 'medium', 'detailed']).nullable(),
  tone: z.enum(['friendly', 'neutral', 'expert']).nullable(),
});

export const assistantGoalSchema = z.string().trim().min(1).max(120);

export const assistantGoalsSchema = z
  .array(assistantGoalSchema)
  .max(3)
  .transform((goals) => goals.map((goal) => goal.trim()));

export const chatSendRequestSchema = z.object({
  session_id: z.string().uuid().nullable().optional(),
  user_message: z.string().trim().min(1),
});

const sessionEventSchema = z.object({
  session_id: z.string().uuid(),
});

const deltaEventSchema = z.object({
  text: z.string(),
});

const toolCallEventSchema = z.object({
  name: z.string(),
  input: z.record(z.string(), z.unknown()),
});

const emergencyEventSchema = z.object({
  reason: z.string(),
});

const doneEventSchema = z.object({
  message_id: z.string().uuid().nullable(),
  usage: z.object({
    input: z.number().int().nonnegative(),
    output: z.number().int().nonnegative(),
  }),
});

const errorEventSchema = z.object({
  code: z.enum([
    'invalid_request',
    'unauthorized',
    'rate_limited',
    'upstream',
    'upstream_busy',
    'server_misconfig',
  ]),
  message: z.string(),
});

export type ChatStreamEvent =
  | { type: 'session'; payload: z.infer<typeof sessionEventSchema> }
  | { type: 'delta'; payload: z.infer<typeof deltaEventSchema> }
  | { type: 'tool_call'; payload: z.infer<typeof toolCallEventSchema> }
  | { type: 'emergency'; payload: z.infer<typeof emergencyEventSchema> }
  | { type: 'done'; payload: z.infer<typeof doneEventSchema> }
  | { type: 'error'; payload: z.infer<typeof errorEventSchema> };

export const parseChatStreamEvent = (event: string, data: unknown): ChatStreamEvent => {
  switch (event) {
    case 'session':
      return { type: 'session', payload: sessionEventSchema.parse(data) };
    case 'delta':
      return { type: 'delta', payload: deltaEventSchema.parse(data) };
    case 'tool_call':
      return { type: 'tool_call', payload: toolCallEventSchema.parse(data) };
    case 'emergency':
      return { type: 'emergency', payload: emergencyEventSchema.parse(data) };
    case 'done':
      return { type: 'done', payload: doneEventSchema.parse(data) };
    case 'error':
      return { type: 'error', payload: errorEventSchema.parse(data) };
    default:
      throw new Error(`Unsupported chat event: ${event}`);
  }
};
