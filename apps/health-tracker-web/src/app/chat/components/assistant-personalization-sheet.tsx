import { Button, IconButton, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import type {
  AssistantResponseLength,
  AssistantTone,
  ChatPersonalization,
} from '@health-tracker/api';
import { AppFormProvider, FormSelectField, FormTextField } from '@health-tracker/forms';
import { AppBottomSheetDialog, AppSubmitButton } from '@health-tracker/ui';

import { assistantGoalsSchema } from '../schemas/chat-schemas';
import { AddRounded, DeleteOutlineRounded } from '@mui/icons-material';

const defaultPersonalization: ChatPersonalization = {
  preferences: {
    addressingStyle: null,
    responseLength: 'medium',
    tone: 'friendly',
    chatbotName: '',
  },
  goals: [],
};

type AssistantPersonalizationFormValues = Record<string, unknown> & {
  addressingStyle: string;
  chatbotName: string;
  goalDraft: string;
  responseLength: AssistantResponseLength;
  tone: AssistantTone;
};

const emptyPreferences: AssistantPersonalizationFormValues = {
  addressingStyle: '',
  chatbotName: '',
  goalDraft: '',
  responseLength: 'medium',
  tone: 'friendly',
};

const responseLengthOptions = [
  { label: 'Ngắn', value: 'short' },
  { label: 'Vừa', value: 'medium' },
  { label: 'Chi tiết', value: 'detailed' },
];

const toneOptions = [
  { label: 'Thân thiện', value: 'friendly' },
  { label: 'Trung tính', value: 'neutral' },
  { label: 'Chuyên gia', value: 'expert' },
];

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
  const form = useForm<AssistantPersonalizationFormValues>({
    defaultValues: emptyPreferences,
  });
  const [goals, setGoals] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const goalDraft = form.watch('goalDraft');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    form.reset({
      addressingStyle: normalizedInitial.preferences.addressingStyle ?? '',
      chatbotName: normalizedInitial.preferences.chatbotName ?? '',
      goalDraft: '',
      responseLength: normalizedInitial.preferences.responseLength ?? 'medium',
      tone: normalizedInitial.preferences.tone ?? 'friendly',
    });
    setGoals(normalizedInitial.goals);
    setErrorMessage('');
  }, [form, isOpen, normalizedInitial]);

  const canAddGoal = goals.length < 3;

  const trimmedGoal = goalDraft.trim();
  const isAddDisabled = !trimmedGoal || !canAddGoal;

  const handleAddGoal = () => {
    const nextGoals = goals.concat(trimmedGoal);
    const parsed = assistantGoalsSchema.safeParse(nextGoals);

    if (!parsed.success) {
      setErrorMessage('Mỗi mục tiêu tối đa 120 ký tự và tối đa 3 mục tiêu.');
      return;
    }

    setGoals(parsed.data);
    form.setValue('goalDraft', '');
    setErrorMessage('');
  };

  const handleRemoveGoal = (goalIndex: number) => {
    setGoals((current) => current.filter((_, index) => index !== goalIndex));
  };

  const handleReset = () => {
    form.reset(emptyPreferences);
    setGoals([]);
    setErrorMessage('');
  };

  const handleSave = async (values: AssistantPersonalizationFormValues) => {
    const parsedGoals = assistantGoalsSchema.safeParse(goals);

    if (!parsedGoals.success) {
      setErrorMessage('Mỗi mục tiêu tối đa 120 ký tự và tối đa 3 mục tiêu.');
      return;
    }

    setErrorMessage('');
    await onSave({
      preferences: {
        addressingStyle: values.addressingStyle.trim() || null,
        chatbotName: values.chatbotName.trim() || null,
        responseLength: values.responseLength,
        tone: values.tone,
      },
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
            onClick={() => void form.handleSubmit(handleSave)()}
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
      <AppFormProvider form={form} onSubmit={handleSave}>
        <Stack spacing={2.25}>
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 700, mb: 1 }} variant="body2">
              Cách trợ lý trả lời
            </Typography>

            <FormTextField label="Tên chatbot" name="chatbotName" size="small" />
            <FormTextField label="Cách xưng hô mong muốn" name="addressingStyle" size="small" />
            <FormSelectField
              fullWidth
              label="Độ dài mặc định"
              name="responseLength"
              options={responseLengthOptions}
              size="small"
            />
            <FormSelectField
              fullWidth
              label="Giọng điệu"
              name="tone"
              options={toneOptions}
              size="small"
            />
          </Stack>

          <Stack spacing={2}>
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
                    type="button"
                  >
                    <DeleteOutlineRounded fontSize="small" />
                  </IconButton>
                </Stack>
              ))}

              <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
                <FormTextField
                  helperText={`${trimmedGoal.length}/120`}
                  name="goalDraft"
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter') {
                      return;
                    }

                    event.preventDefault();

                    if (!isAddDisabled) {
                      handleAddGoal();
                    }
                  }}
                  placeholder="Thêm mục tiêu..."
                  size="small"
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
                  type="button"
                >
                  <AddRounded fontSize="small" />
                </IconButton>
              </Stack>
            </Stack>
          </Stack>

          {errorMessage ? (
            <Typography color="error.main" variant="caption">
              {errorMessage}
            </Typography>
          ) : null}
        </Stack>
      </AppFormProvider>
    </AppBottomSheetDialog>
  );
}
