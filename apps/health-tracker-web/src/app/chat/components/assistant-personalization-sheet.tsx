import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Box, Button, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import type { AssistantPreferences, ChatPersonalization } from '@health-tracker/api';
import { AppBottomSheetDialog, AppSubmitButton } from '@health-tracker/ui';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';

import { assistantGoalsSchema } from '../schemas/chat-schemas';

const defaultPersonalization: ChatPersonalization = {
  preferences: {
    addressingStyle: null,
    responseLength: 'medium',
    tone: 'friendly',
    chatbotName: '',
  },
  goals: [],
};

const emptyPreferences: AssistantPreferences = {
  addressingStyle: '',
  chatbotName: '',
  responseLength: 'medium',
  tone: 'friendly',
};

type AssistantPersonalizationSheetProps = {
  initialValue: ChatPersonalization | undefined;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (payload: ChatPersonalization) => Promise<void>;
};

export function AssistantPersonalizationSheet({
  initialValue,
  isOpen,
  isSaving,
  onClose,
  onSave,
}: AssistantPersonalizationSheetProps) {
  const normalizedInitial = initialValue ?? defaultPersonalization;
  const [preferences, setPreferences] = useState<AssistantPreferences>(emptyPreferences);
  const [goals, setGoals] = useState<string[]>([]);
  const [newGoal, setNewGoal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setPreferences({
      addressingStyle: normalizedInitial.preferences.addressingStyle ?? '',
      chatbotName: normalizedInitial.preferences.chatbotName ?? '',
      responseLength: normalizedInitial.preferences.responseLength ?? 'medium',
      tone: normalizedInitial.preferences.tone ?? 'friendly',
    });
    setGoals(normalizedInitial.goals);
    setNewGoal('');
    setErrorMessage('');
  }, [isOpen, normalizedInitial]);

  const canAddGoal = goals.length < 3;

  const trimmedGoal = newGoal.trim();
  const isAddDisabled = !trimmedGoal || !canAddGoal;

  const savePayload = useMemo<ChatPersonalization>(
    () => ({
      preferences: {
        addressingStyle: preferences.addressingStyle?.trim() || null,
        chatbotName: preferences.chatbotName?.trim() || null,
        responseLength: preferences.responseLength ?? 'medium',
        tone: preferences.tone ?? 'friendly',
      },
      goals,
    }),
    [goals, preferences],
  );

  const handleAddGoal = () => {
    const nextGoals = goals.concat(trimmedGoal);
    const parsed = assistantGoalsSchema.safeParse(nextGoals);

    if (!parsed.success) {
      setErrorMessage('Mỗi mục tiêu tối đa 120 ký tự và tối đa 3 mục tiêu.');
      return;
    }

    setGoals(parsed.data);
    setNewGoal('');
    setErrorMessage('');
  };

  const handleRemoveGoal = (goalIndex: number) => {
    setGoals((current) => current.filter((_, index) => index !== goalIndex));
  };

  const handleReset = () => {
    setPreferences(emptyPreferences);
    setGoals([]);
    setNewGoal('');
    setErrorMessage('');
  };

  const handleSave = async () => {
    const parsedGoals = assistantGoalsSchema.safeParse(goals);

    if (!parsedGoals.success) {
      setErrorMessage('Mỗi mục tiêu tối đa 120 ký tự và tối đa 3 mục tiêu.');
      return;
    }

    setErrorMessage('');
    await onSave({
      ...savePayload,
      goals: parsedGoals.data,
    });
    onClose();
  };

  return (
    <AppBottomSheetDialog
      actions={
        <>
          <Button
            color="inherit"
            disabled={isSaving}
            fullWidth
            onClick={handleReset}
            variant="outlined"
          >
            Khôi phục mặc định
          </Button>
          <AppSubmitButton
            fullWidth
            loading={isSaving}
            onClick={() => void handleSave()}
            variant="contained"
          >
            Lưu thay đổi
          </AppSubmitButton>
        </>
      }
      isBusy={isSaving}
      onClose={onClose}
      open={isOpen}
      title="Tuỳ chỉnh trợ lý"
    >
      <Stack spacing={2.25} useFlexGap>
        <Box sx={{ backgroundColor: 'surface.overlay', borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }} variant="body2">
            Cách trợ lý trả lời
          </Typography>

          <Stack spacing={1.5} useFlexGap>
            <TextField
              fullWidth
              label="Tên chatbot"
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  chatbotName: event.target.value,
                }))
              }
              size="small"
              value={preferences.chatbotName ?? ''}
            />
            <TextField
              fullWidth
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  addressingStyle: event.target.value,
                }))
              }
              label="Cách xưng hô mong muốn"
              size="small"
              value={preferences.addressingStyle ?? ''}
            />
            <TextField
              fullWidth
              label="Độ dài mặc định"
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  responseLength: event.target.value as AssistantPreferences['responseLength'],
                }))
              }
              select
              size="small"
              value={preferences.responseLength ?? 'medium'}
            >
              <MenuItem value="short">Ngắn</MenuItem>
              <MenuItem value="medium">Vừa</MenuItem>
              <MenuItem value="detailed">Chi tiết</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Giọng điệu"
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  tone: event.target.value as AssistantPreferences['tone'],
                }))
              }
              select
              size="small"
              value={preferences.tone ?? 'friendly'}
            >
              <MenuItem value="friendly">Thân thiện</MenuItem>
              <MenuItem value="neutral">Trung tính</MenuItem>
              <MenuItem value="expert">Chuyên gia</MenuItem>
            </TextField>
          </Stack>
        </Box>

        <Box sx={{ backgroundColor: 'surface.overlay', borderRadius: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }} variant="body2">
            Mục tiêu hiện tại
          </Typography>

          <Stack spacing={1.25} useFlexGap>
            {goals.length === 0 ? (
              <Typography color="text.secondary" variant="caption">
                Chưa có mục tiêu nào
              </Typography>
            ) : null}

            {goals.map((goal, index) => (
              <Stack
                alignItems="center"
                direction="row"
                justifyContent="space-between"
                key={`${goal}-${index}`}
              >
                <Typography sx={{ pr: 1 }} variant="caption">
                  {index + 1}. {goal}
                </Typography>
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveGoal(index)}
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}

            <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
              <TextField
                fullWidth
                helperText={`${newGoal.trim().length}/120`}
                onChange={(event) => setNewGoal(event.target.value)}
                placeholder="Thêm mục tiêu..."
                size="small"
                value={newGoal}
              />
              <IconButton
                aria-label="Thêm mục tiêu"
                disabled={isAddDisabled}
                onClick={handleAddGoal}
                size="small"
                sx={(theme) => ({
                  mb: 2.5,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                  '&.Mui-disabled': {
                    bgcolor: theme.palette.action.disabledBackground,
                    color: theme.palette.action.disabled,
                  },
                })}
              >
                <AddRoundedIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {errorMessage ? (
          <Typography color="error.main" variant="caption">
            {errorMessage}
          </Typography>
        ) : null}
      </Stack>
    </AppBottomSheetDialog>
  );
}
