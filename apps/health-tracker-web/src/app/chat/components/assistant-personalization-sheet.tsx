import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import type { AssistantPreferences, ChatPersonalization } from '@health-tracker/api';
import { AppSubmitButton } from '@health-tracker/ui';

import { assistantGoalsSchema } from '../schemas/chat-schemas';

const defaultPersonalization: ChatPersonalization = {
  preferences: {
    addressingStyle: null,
    responseLength: 'medium',
    tone: 'friendly',
  },
  goals: [],
};

const emptyPreferences: AssistantPreferences = {
  addressingStyle: '',
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
    <Drawer anchor="bottom" onClose={isSaving ? undefined : onClose} open={isOpen}>
      <Box
        sx={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxWidth: 480,
          mx: 'auto',
          p: 2,
          width: '100%',
        }}
      >
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }} useFlexGap>
          <Typography variant="h4">Tuỳ chỉnh trợ lý</Typography>
          <IconButton disabled={isSaving} onClick={onClose} size="small">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Stack spacing={2} useFlexGap>
          <Box sx={{ backgroundColor: 'surface.overlay', borderRadius: 3, p: 1.5 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }} variant="body2">
              Cách trợ lý trả lời
            </Typography>

            <Stack spacing={1} useFlexGap>
              <TextField
                fullWidth
                label="Cách xưng hô mong muốn"
                onChange={(event) =>
                  setPreferences((current) => ({
                    ...current,
                    addressingStyle: event.target.value,
                  }))
                }
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

          <Box sx={{ backgroundColor: 'surface.overlay', borderRadius: 3, p: 1.5 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }} variant="body2">
              Mục tiêu hiện tại
            </Typography>

            <Stack spacing={1} useFlexGap>
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
                  <Button
                    color="inherit"
                    onClick={() => handleRemoveGoal(index)}
                    size="small"
                    sx={{ minWidth: 'auto' }}
                  >
                    Xoá
                  </Button>
                </Stack>
              ))}

              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  helperText={`${newGoal.trim().length}/120`}
                  onChange={(event) => setNewGoal(event.target.value)}
                  placeholder="Thêm mục tiêu..."
                  size="small"
                  value={newGoal}
                />
                <Button disabled={isAddDisabled} onClick={handleAddGoal} variant="outlined">
                  Thêm
                </Button>
              </Stack>
            </Stack>
          </Box>

          {errorMessage ? (
            <Typography color="error.main" variant="caption">
              {errorMessage}
            </Typography>
          ) : null}

          <Stack direction="row" justifyContent="space-between" sx={{ pt: 0.5 }}>
            <Button color="inherit" disabled={isSaving} onClick={handleReset}>
              Khôi phục mặc định
            </Button>
            <AppSubmitButton
              loading={isSaving}
              onClick={() => void handleSave()}
              variant="contained"
            >
              Lưu thay đổi
            </AppSubmitButton>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}
