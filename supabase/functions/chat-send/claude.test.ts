import { stripMutableToolUseInternals } from './claude.ts';

Deno.test('stripMutableToolUseInternals removes parser-only fields from tool_use blocks', () => {
  const sanitized = stripMutableToolUseInternals({
    type: 'tool_use',
    id: 'tool_123',
    name: 'get_profile',
    input: {},
    __partialJson: '{"foo":"bar"}',
  });

  const serialized = JSON.stringify(sanitized);

  if (
    serialized !==
    JSON.stringify({
      type: 'tool_use',
      id: 'tool_123',
      name: 'get_profile',
      input: {},
    })
  ) {
    throw new Error(`Unexpected sanitized tool_use block: ${serialized}`);
  }

  if (serialized.includes('__partialJson')) {
    throw new Error(`Internal parser field leaked into tool_use block: ${serialized}`);
  }
});
