import AddRoundedIcon from '@mui/icons-material/AddRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { Box, Container, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';

import { markChatDisclaimerSeen, type ChatMessage } from '@health-tracker/api';

import { useAuthSession } from '../auth/use-auth-session';
import { Composer } from './components/composer';
import { DisclaimerWelcome } from './components/disclaimer-welcome';
import { MessageList } from './components/message-list';
import { SessionHistoryDrawer } from './components/session-history-drawer';
import { useChatMessages } from './hooks/use-chat-messages';
import { useChatSessions } from './hooks/use-chat-sessions';
import { useChatStream } from './hooks/use-chat-stream';
import { useNavigate } from 'react-router-dom';

export function ChatPage() {
  const navigate = useNavigate();
  const { onboardingProfile, user } = useAuthSession();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null | undefined>(undefined);
  const [showDisclaimer, setShowDisclaimer] = useState(!onboardingProfile.hasSeenChatDisclaimer);
  const [isSavingDisclaimer, setIsSavingDisclaimer] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const lastSessionIdRef = useRef<string | null | undefined>(undefined);

  const { data: sessions = [], archiveSession } = useChatSessions(user?.id);
  const { data: storedMessages = [], isFetching: isMessagesFetching } = useChatMessages(
    activeSessionId ?? null,
  );

  useEffect(() => {
    if (activeSessionId !== undefined) {
      return;
    }

    setActiveSessionId(sessions[0]?.id ?? null);
  }, [activeSessionId, sessions]);

  const {
    errorCode,
    errorMessage,
    isBusy,
    isEmergency,
    pendingUserMessage,
    resetRuntimeState,
    sendMessage,
    shouldShowAssistantDraft,
    status,
    streamingText,
    toolCalls,
  } = useChatStream({
    activeSessionId: activeSessionId ?? null,
    isMessagesFetching,
    persistedMessageCount: storedMessages.length,
    userId: user?.id,
    onSessionCreated: (sessionId) => {
      setActiveSessionId(sessionId);
    },
  });

  const messages = useMemo<ChatMessage[]>(() => storedMessages, [storedMessages]);

  useLayoutEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }

    const sessionChanged = lastSessionIdRef.current !== activeSessionId;
    lastSessionIdRef.current = activeSessionId;

    requestAnimationFrame(() => {
      if (sessionChanged) {
        container.scrollTop = container.scrollHeight;
        return;
      }

      container.scrollTo({ behavior: 'smooth', top: container.scrollHeight });
    });
  }, [
    activeSessionId,
    historyOpen,
    messages.length,
    pendingUserMessage,
    status,
    streamingText,
    toolCalls.length,
  ]);

  const handleNewChat = () => {
    setHistoryOpen(false);
    setActiveSessionId(null);
    resetRuntimeState();
  };

  const handleDismissDisclaimer = async () => {
    if (!user || onboardingProfile.hasSeenChatDisclaimer) {
      setShowDisclaimer(false);
      return;
    }

    setIsSavingDisclaimer(true);
    await markChatDisclaimerSeen(user);
    setIsSavingDisclaimer(false);
    setShowDisclaimer(false);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: 'background.default',
          boxSizing: 'border-box',
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        <Container
          maxWidth="sm"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100dvh',
            px: '0 !important',
          }}
        >
          <Box component="header" sx={{ pb: 1.5, pt: 2, px: 2.5 }}>
            <Stack alignItems="center" direction="row" justifyContent="space-between">
              <Stack alignItems="center" direction="row" spacing={1}>
                <IconButton
                  color="primary"
                  onClick={() => navigate('/')}
                  size="small"
                  sx={{ bgcolor: 'surface.raised' }}
                >
                  <ArrowBackRoundedIcon fontSize="small" />
                </IconButton>
                <Typography variant="h4">Trò chuyện</Typography>
              </Stack>

              <Stack alignItems="center" direction="row" spacing={1}>
                <IconButton
                  disableRipple={sessions.length === 0}
                  color="primary"
                  onClick={sessions.length > 0 ? () => setHistoryOpen(true) : undefined}
                  size="small"
                  sx={(theme) => ({
                    backgroundColor: theme.palette.surface.overlay,
                    height: 36,
                    width: 36,
                    ml: 'auto',
                  })}
                >
                  <HistoryRoundedIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={handleNewChat}
                  sx={(theme) => ({
                    backgroundColor: theme.palette.surface.accentStrong,
                    height: 36,
                    width: 36,
                  })}
                >
                  <AddRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              minHeight: 0,
            }}
          >
            <Box ref={messagesContainerRef} sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
              <MessageList
                emergencyContactName={onboardingProfile.emergencyContactName}
                emergencyContactPhone={onboardingProfile.emergencyContactPhone}
                errorCode={errorCode}
                errorMessage={errorMessage}
                isEmergency={isEmergency}
                isStreaming={status === 'streaming'}
                messages={messages}
                pendingUserMessage={pendingUserMessage}
                shouldShowAssistantDraft={shouldShowAssistantDraft}
                streamingText={streamingText}
                toolCalls={toolCalls}
              />
            </Box>

            <Composer
              disabled={isBusy || !user || errorCode === 'rate_limited'}
              errorCode={errorCode}
              errorMessage={errorMessage}
              onSubmit={async (message) => {
                await sendMessage(message);
              }}
            />
          </Box>
        </Container>
      </Box>

      <SessionHistoryDrawer
        activeSessionId={activeSessionId ?? null}
        isOpen={historyOpen}
        onArchive={(sessionId) => void archiveSession(sessionId)}
        onClose={() => setHistoryOpen(false)}
        onSelectSession={(sessionId) => {
          setActiveSessionId(sessionId);
          setHistoryOpen(false);
          resetRuntimeState();
        }}
        sessions={sessions}
      />

      <DisclaimerWelcome
        isSubmitting={isSavingDisclaimer}
        onConfirm={() => void handleDismissDisclaimer()}
        open={showDisclaimer}
      />
    </>
  );
}
