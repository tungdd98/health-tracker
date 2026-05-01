import { Stack, Typography } from '@mui/material';
import { HealthAndSafetyRounded } from '@mui/icons-material';

type MessageBubbleProps = {
  content: string;
  role: 'assistant' | 'user';
  isStreaming?: boolean;
};

export function MessageBubble({ content, role, isStreaming = false }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <Stack
      alignItems="flex-start"
      direction="row"
      justifyContent={isUser ? 'flex-end' : 'flex-start'}
      spacing={1}
      sx={{ width: '100%' }}
    >
      {isUser ? null : (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={(theme) => ({
            backgroundColor: theme.palette.surface.accentStrong,
            borderRadius: theme.appTokens.radius.pill,
            color: theme.palette.primary.main,
            flexShrink: 0,
            height: 32,
            width: 32,
          })}
        >
          <HealthAndSafetyRounded sx={{ fontSize: 16 }} />
        </Stack>
      )}

      <Stack
        sx={(theme) => ({
          backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
          border: isUser ? 'none' : `1px solid ${theme.palette.border.subtle}`,
          borderRadius: theme.appTokens.radius.xl,
          color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
          maxWidth: 240,
          px: 1.75,
          py: 1.25,
        })}
      >
        <Typography fontSize={14} lineHeight={1.5} sx={{ whiteSpace: 'pre-wrap' }}>
          {content}
          {isStreaming ? '▋' : ''}
        </Typography>
      </Stack>
    </Stack>
  );
}
