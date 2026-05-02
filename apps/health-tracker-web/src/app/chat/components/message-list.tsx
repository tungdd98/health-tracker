import { Box, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';

import { extractChatText, type ChatMessage } from '@health-tracker/api';

import { EmergencyAlertCard } from './emergency-alert-card';
import { MessageBubble } from './message-bubble';
import { ToolCallChip } from './tool-call-chip';
import type { ChatErrorCode } from '../hooks/use-chat-stream';
import {
  ChatBubbleOutlineRounded,
  ScheduleRounded,
  WarningAmberRounded,
} from '@mui/icons-material';

const getRateLimitSecondaryText = (message: string) => {
  const minutes = new RegExp(/(\d+)\s*phút/i).exec(message)?.[1];

  if (minutes) {
    return `Thử lại sau ${minutes} phút`;
  }

  return message;
};

const formatMessageTime = (value: string) => {
  const dateTime = DateTime.fromISO(value);

  if (!dateTime.isValid) {
    return null;
  }

  return dateTime.toFormat('HH:mm');
};

export function MessageList({
  emergencyContactName,
  emergencyContactPhone,
  errorCode,
  errorMessage,
  isEmergency,
  isStreaming,
  messages,
  pendingUserMessage,
  shouldShowAssistantDraft,
  streamingText,
  toolCalls,
}: {
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  errorCode: ChatErrorCode | null;
  errorMessage: string;
  isEmergency: boolean;
  isStreaming: boolean;
  messages: ChatMessage[];
  pendingUserMessage: string;
  shouldShowAssistantDraft: boolean;
  streamingText: string;
  toolCalls: Array<{ name: string; input: Record<string, unknown> }>;
}) {
  const visibleMessages = messages.filter((message) => {
    if (message.role === 'tool') {
      return false;
    }

    return extractChatText(message.content).length > 0;
  });

  const isEmpty = visibleMessages.length === 0 && !pendingUserMessage && !streamingText;
  const showRateLimitBanner = errorCode === 'rate_limited';

  if (isEmpty) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ minHeight: '100%', px: 4, py: 6, textAlign: 'center' }}
      >
        <Box
          sx={(theme) => ({
            alignItems: 'center',
            backgroundColor: theme.palette.surface.accentStrong,
            borderRadius: theme.appTokens.radius.pill,
            color: theme.palette.primary.main,
            display: 'flex',
            height: 80,
            justifyContent: 'center',
            width: 80,
          })}
        >
          <ChatBubbleOutlineRounded sx={{ fontSize: 36 }} />
        </Box>

        <Stack spacing={1}>
          <Typography variant="h5">Bắt đầu trò chuyện</Typography>
          <Typography color="text.secondary" variant="body2">
            Hỏi về sức khoẻ, thuốc men
            <br />
            hoặc xem lại dữ liệu của bạn
          </Typography>
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5} sx={{ px: 2, py: 2 }}>
      {showRateLimitBanner ? (
        <Stack
          alignItems="center"
          direction="row"
          spacing={1.5}
          sx={(theme) => ({
            backgroundColor: theme.palette.status.warningSurface,
            color: theme.palette.status.warningText,
            minHeight: 64,
            px: 2,
          })}
        >
          <ScheduleRounded sx={{ fontSize: 22 }} />
          <Stack spacing={0.25}>
            <Typography variant="subtitle2">Đã đạt giới hạn 30 tin/giờ</Typography>
            <Typography variant="caption">{getRateLimitSecondaryText(errorMessage)}</Typography>
          </Stack>
        </Stack>
      ) : null}

      {visibleMessages.map((message, index) => {
        const previousMessage = visibleMessages[index - 1];
        const showTimestamp =
          message.role === 'assistant' &&
          previousMessage?.role === 'user' &&
          Boolean(message.createdAt);

        return (
          <Stack key={message.id} spacing={1}>
            {showTimestamp ? (
              <Typography color="text.secondary" sx={{ ml: 0.75 }} variant="overline">
                {formatMessageTime(message.createdAt)}
              </Typography>
            ) : null}

            <MessageBubble
              content={extractChatText(message.content)}
              role={message.role === 'user' ? 'user' : 'assistant'}
            />
          </Stack>
        );
      })}

      {pendingUserMessage ? <MessageBubble content={pendingUserMessage} role="user" /> : null}

      {toolCalls.map((toolCall, index) => (
        <ToolCallChip key={`${toolCall.name}-${index}`} name={toolCall.name} />
      ))}

      {isEmergency ? (
        <EmergencyAlertCard
          emergencyContactName={emergencyContactName}
          emergencyContactPhone={emergencyContactPhone}
        />
      ) : null}

      {shouldShowAssistantDraft ? (
        <MessageBubble content={streamingText} isStreaming={isStreaming} role="assistant" />
      ) : null}

      {errorMessage && !showRateLimitBanner ? (
        <Stack
          alignItems="center"
          direction="row"
          spacing={1.25}
          sx={(theme) => ({
            backgroundColor: theme.palette.status.warningSurface,
            borderRadius: theme.appTokens.radius.lg,
            color: theme.palette.status.warningText,
            px: 1.75,
            py: 1.5,
          })}
        >
          <WarningAmberRounded sx={{ fontSize: 20 }} />
          <Typography variant="body2">{errorMessage}</Typography>
        </Stack>
      ) : null}
    </Stack>
  );
}
