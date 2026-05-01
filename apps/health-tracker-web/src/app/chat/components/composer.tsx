import { alpha } from '@mui/material/styles';
import { Box, IconButton, InputBase, Stack, type SxProps, type Theme } from '@mui/material';
import { useState } from 'react';

import type { ChatErrorCode } from '../hooks/use-chat-stream';
import { ArrowUpwardRounded } from '@mui/icons-material';

const getDisabledPlaceholder = (errorCode: ChatErrorCode | null, errorMessage?: string) => {
  if (errorCode !== 'rate_limited') {
    return 'Nhắn tin...';
  }

  const minutes = errorMessage?.match(/(\d+)\s*phút/i)?.[1];

  if (minutes) {
    return `Thử lại sau ${minutes} phút...`;
  }

  return 'Tạm thời chưa thể gửi...';
};

export function Composer({
  disabled,
  errorCode,
  errorMessage,
  onSubmit,
  sx,
}: {
  disabled: boolean;
  errorCode: ChatErrorCode | null;
  errorMessage?: string;
  onSubmit: (message: string) => Promise<void> | void;
  sx?: SxProps<Theme>;
}) {
  const [draft, setDraft] = useState('');

  const handleSubmit = async () => {
    const nextDraft = draft.trim();

    if (!nextDraft) {
      return;
    }

    setDraft('');

    try {
      await onSubmit(nextDraft);
    } catch (error) {
      setDraft(nextDraft);
      throw error;
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={[
        (theme) => ({
          alignItems: 'center',
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.border.subtle}`,
          pb: 1.75,
          pt: 1.75,
          px: 2,
        }),
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        sx={(theme) => ({
          alignItems: 'center',
          backgroundColor: disabled
            ? alpha(theme.palette.surface.sunken, 0.68)
            : theme.palette.surface.sunken,
          border:
            errorMessage && errorCode !== 'rate_limited'
              ? `1px solid ${theme.palette.error.main}`
              : `1px solid ${theme.palette.border.subtle}`,
          borderRadius: theme.appTokens.radius.lg,
          display: 'flex',
          minHeight: 44,
          px: 2,
          width: '100%',
        })}
      >
        <InputBase
          disabled={disabled}
          maxRows={4}
          minRows={1}
          multiline
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void handleSubmit();
            }
          }}
          placeholder={getDisabledPlaceholder(errorCode, errorMessage)}
          sx={{
            flex: 1,
            fontSize: 14,
            lineHeight: 1.5,
          }}
          value={draft}
        />
      </Box>

      <IconButton
        disabled={disabled || !draft.trim()}
        onClick={() => void handleSubmit()}
        sx={(theme) => ({
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          height: 44,
          width: 44,
          '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.primary.main, 0.42),
            color: alpha(theme.palette.primary.contrastText, 0.76),
          },
        })}
      >
        <ArrowUpwardRounded fontSize="small" />
      </IconButton>
    </Stack>
  );
}
