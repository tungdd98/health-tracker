import { Alert, Box, Container, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';

import { markChatDisclaimerSeen, type ChatMessage } from '@health-tracker/api';

import { useAuthSession } from '../auth/use-auth-session';
import { AppConfirmDialog } from '../components/app-confirm-dialog';
import { Composer } from './components/composer';
import { DisclaimerWelcome } from './components/disclaimer-welcome';
import { MessageList } from './components/message-list';
import { SessionHistoryDrawer } from './components/session-history-drawer';
import { AssistantPersonalizationSheet } from './components/assistant-personalization-sheet';
import { useChatMessages } from './hooks/use-chat-messages';
import { useChatPersonalization } from './hooks/use-chat-personalization';
import { useChatSessions } from './hooks/use-chat-sessions';
import { useChatStream } from './hooks/use-chat-stream';
import { useNavigate } from 'react-router-dom';
import { AddRounded, ArrowBackRounded, HistoryRounded, SettingsRounded } from '@mui/icons-material';

export function ChatPage() {
  const navigate = useNavigate();
  const { onboardingProfile, user } = useAuthSession();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null | undefined>(undefined);
  const [showDisclaimer, setShowDisclaimer] = useState(!onboardingProfile.hasSeenChatDisclaimer);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [isSavingDisclaimer, setIsSavingDisclaimer] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<{ id: string; title: string } | null>(null);
  const [archiveError, setArchiveError] = useState('');
  const [personalizationError, setPersonalizationError] = useState('');
  const [isPersonalizationErrorOpen, setIsPersonalizationErrorOpen] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const lastSessionIdRef = useRef<string | null | undefined>(undefined);

  const { data: sessions = [], archiveSession, isArchiving } = useChatSessions(user?.id);
  const {
    data: personalization,
    isSaving: isSavingPersonalization,
    savePersonalization,
  } = useChatPersonalization(user?.id);
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

  const handleConfirmArchive = async () => {
    if (!archiveTarget) {
      return;
    }

    setArchiveError('');

    try {
      await archiveSession(archiveTarget.id);
      setActiveSessionId((current) => (current === archiveTarget.id ? null : current));
      setArchiveTarget(null);
    } catch {
      setArchiveError('Không thể xoá hội thoại lúc này. Vui lòng thử lại.');
    }
  };

  const handlePersonalizationSave = async (payload: Parameters<typeof savePersonalization>[0]) => {
    try {
      await savePersonalization(payload);
      setPersonalizationError('');
      setIsPersonalizationErrorOpen(false);
    } catch (error) {
      setPersonalizationError(
        error instanceof Error
          ? error.message
          : 'Không thể lưu tuỳ chỉnh trợ lý. Vui lòng thử lại.',
      );
      setIsPersonalizationErrorOpen(true);
      throw error;
    }
  };

  const handleClosePersonalizationSnackbar = (_event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsPersonalizationErrorOpen(false);
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
                  <ArrowBackRounded fontSize="small" />
                </IconButton>
                <Typography variant="h5">Trò chuyện</Typography>
              </Stack>

              <Stack alignItems="center" direction="row" spacing={1}>
                <IconButton
                  color="primary"
                  onClick={() => setIsPersonalizationOpen(true)}
                  size="small"
                  sx={(theme) => ({
                    backgroundColor: theme.palette.surface.overlay,
                    height: 36,
                    width: 36,
                  })}
                >
                  <SettingsRounded fontSize="small" />
                </IconButton>
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
                  <HistoryRounded fontSize="small" />
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
                  <AddRounded fontSize="small" />
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
        onArchive={(sessionId) => {
          const session = sessions.find((item) => item.id === sessionId);
          setArchiveError('');
          setArchiveTarget({
            id: sessionId,
            title: session?.title?.trim() || 'Cuộc trò chuyện mới',
          });
        }}
        onClose={() => setHistoryOpen(false)}
        onSelectSession={(sessionId) => {
          setActiveSessionId(sessionId);
          setHistoryOpen(false);
          resetRuntimeState();
        }}
        sessions={sessions}
      />

      <AppConfirmDialog
        confirmColor="error"
        confirmLabel="Xoá"
        description={`Bạn có chắc muốn xoá "${archiveTarget?.title}" không?`}
        errorMessage={archiveError}
        isSubmitting={isArchiving}
        onCancel={() => {
          if (isArchiving) {
            return;
          }

          setArchiveTarget(null);
          setArchiveError('');
        }}
        onConfirm={handleConfirmArchive}
        open={Boolean(archiveTarget)}
        title="Xoá hội thoại?"
      />

      <DisclaimerWelcome
        isSubmitting={isSavingDisclaimer}
        onConfirm={() => void handleDismissDisclaimer()}
        open={showDisclaimer}
      />

      <AssistantPersonalizationSheet
        initialValue={personalization}
        isOpen={isPersonalizationOpen}
        isSaving={isSavingPersonalization}
        onClose={() => setIsPersonalizationOpen(false)}
        onSave={handlePersonalizationSave}
      />

      <Snackbar
        autoHideDuration={4000}
        onClose={handleClosePersonalizationSnackbar}
        open={isPersonalizationErrorOpen}
      >
        <Alert color="error" onClose={handleClosePersonalizationSnackbar} variant="filled">
          {personalizationError || 'Không thể lưu tuỳ chỉnh trợ lý. Vui lòng thử lại.'}
        </Alert>
      </Snackbar>
    </>
  );
}
