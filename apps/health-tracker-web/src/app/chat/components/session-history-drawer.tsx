import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ChatBubbleRoundedIcon from '@mui/icons-material/ChatBubbleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { Box, Drawer, IconButton, List, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';

import type { ChatSession } from '@health-tracker/api';

export function SessionHistoryDrawer({
  activeSessionId,
  isOpen,
  onArchive,
  onClose,
  onSelectSession,
  sessions,
}: {
  activeSessionId: string | null;
  isOpen: boolean;
  onArchive: (sessionId: string) => void;
  onClose: () => void;
  onSelectSession: (sessionId: string) => void;
  sessions: ChatSession[];
}) {
  return (
    <Drawer
      anchor="bottom"
      onClose={onClose}
      open={isOpen}
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      }}
    >
      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.background.paper,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        })}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            pb: 1,
            pt: 1.5,
          }}
        >
          <Box
            sx={(theme) => ({
              backgroundColor: theme.palette.border.default,
              borderRadius: theme.appTokens.radius.pill,
              height: 4,
              width: 36,
            })}
          />
        </Box>

        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          sx={{ px: 2.5, py: 1.25 }}
        >
          <Typography sx={(theme) => ({ ...theme.appTokens.typography.titleMd, fontSize: 17 })}>
            Lịch sử hội thoại
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.border.subtle,
            height: 1,
          })}
        />

        <List sx={{ p: 0 }}>
          {sessions.length === 0 ? (
            <Typography color="text.secondary" sx={{ px: 2.5, py: 3 }}>
              Chưa có hội thoại nào được lưu.
            </Typography>
          ) : null}

          {sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            const subtitle = DateTime.fromISO(session.lastMessageAt).isValid
              ? DateTime.fromISO(session.lastMessageAt).toFormat('dd/MM, HH:mm')
              : '';

            return (
              <Stack
                key={session.id}
                alignItems="center"
                direction="row"
                onClick={() => {
                  onSelectSession(session.id);
                }}
                sx={(theme) => ({
                  backgroundColor: isActive ? theme.palette.surface.selected : 'transparent',
                  borderBottom: `1px solid ${theme.palette.border.subtle}`,
                  cursor: 'pointer',
                  gap: 1.5,
                  px: 2.5,
                  py: 1.75,
                })}
              >
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  sx={(theme) => ({
                    backgroundColor: theme.palette.surface.accentStrong,
                    borderRadius: theme.appTokens.radius.md,
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                    height: 40,
                    width: 40,
                  })}
                >
                  <ChatBubbleRoundedIcon sx={{ fontSize: 20 }} />
                </Stack>

                <Stack spacing={0.5} sx={{ minWidth: 0, width: '100%' }}>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {session.title?.trim() || 'Cuộc trò chuyện mới'}
                  </Typography>
                  <Stack alignItems="center" direction="row" spacing={0.75}>
                    <AccessTimeRoundedIcon sx={{ color: 'text.secondary', fontSize: 14 }} />
                    <Typography color="text.secondary" fontSize={12}>
                      {subtitle}
                    </Typography>
                  </Stack>
                </Stack>

                <IconButton
                  edge="end"
                  onClick={(event) => {
                    event.stopPropagation();
                    onArchive(session.id);
                  }}
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
}
