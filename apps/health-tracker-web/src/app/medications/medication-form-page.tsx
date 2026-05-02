import { Alert, Button, ButtonBase, Skeleton, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useEffect, useMemo } from 'react';
import { useForm, type Path, type UseFormReturn } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import type { ZodIssue } from 'zod';

import {
  AppFormProvider,
  FormDateField,
  FormTextAreaField,
  FormTextField,
} from '@health-tracker/forms';
import { AppSubmitButton } from '@health-tracker/ui';
import { useAuthSession } from '../auth/use-auth-session';
import {
  defaultMedicationFormValues,
  medicationFormSchema,
  type MedicationFormValues,
} from './medication-form-schema';
import { DoseTimeListField } from './dose-time-list-field';
import { MedicationPageLayout } from './medication-page-layout';
import {
  useCreateMedicationMutation,
  useMedication,
  useUpdateMedicationMutation,
} from './use-medications';

const mapZodIssuesToFields = <TValues extends Record<string, unknown>>(
  form: UseFormReturn<TValues>,
  issues: ZodIssue[],
) => {
  form.clearErrors();

  issues.forEach((issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === 'string') {
      form.setError(fieldName as Path<TValues>, {
        type: 'manual',
        message: issue.message,
      });
    }
  });
};

const toIsoDate = (value: unknown): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  if (DateTime.isDateTime(value)) {
    return value.isValid ? value.toISODate() : null;
  }

  if (typeof value === 'string') {
    const parsed = DateTime.fromISO(value);
    return parsed.isValid ? parsed.toISODate() : null;
  }

  return null;
};

export function MedicationFormPage() {
  const navigate = useNavigate();
  const { medicationId } = useParams<{ medicationId: string }>();
  const isEditMode = Boolean(medicationId);
  const { user } = useAuthSession();

  const { data: medication, isLoading: isLoadingMedication } = useMedication(medicationId);
  const createMutation = useCreateMedicationMutation(user?.id);
  const updateMutation = useUpdateMedicationMutation(user?.id);

  const form = useForm<MedicationFormValues>({
    defaultValues: defaultMedicationFormValues,
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!medication || !isEditMode) {
      return;
    }

    form.reset({
      name: medication.name,
      dosage: medication.dosage ?? '',
      notes: medication.notes ?? '',
      scheduleType: medication.scheduleType,
      courseStartDate: medication.courseStartDate
        ? DateTime.fromISO(medication.courseStartDate)
        : null,
      courseDurationDays: medication.courseDurationDays ?? undefined,
      active: medication.active,
      doses:
        medication.doses.length > 0
          ? medication.doses.map((dose) => ({ timeOfDay: dose.timeOfDay }))
          : [{ timeOfDay: '08:00' }],
    });
  }, [form, isEditMode, medication]);

  const scheduleType = form.watch('scheduleType');
  const courseStartDate = form.watch('courseStartDate');
  const courseDurationDays = form.watch('courseDurationDays');

  const computedEndDateLabel = useMemo(() => {
    const startIso = toIsoDate(courseStartDate);

    const parsedDuration =
      typeof courseDurationDays === 'number'
        ? courseDurationDays
        : Number.parseInt(String(courseDurationDays ?? ''), 10);

    if (!startIso || !Number.isFinite(parsedDuration) || parsedDuration < 1) {
      return null;
    }

    const start = DateTime.fromISO(startIso);

    if (!start.isValid) {
      return null;
    }

    return start.plus({ days: parsedDuration - 1 }).toFormat('dd/MM/yyyy');
  }, [courseDurationDays, courseStartDate]);

  const saveError = (createMutation.error || updateMutation.error) as Error | null;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async (values: MedicationFormValues) => {
    const parsed = medicationFormSchema.safeParse(values);

    if (!parsed.success) {
      mapZodIssuesToFields(form, parsed.error.issues);
      return;
    }

    const startIso = toIsoDate(parsed.data.courseStartDate);

    const draft = {
      name: parsed.data.name,
      dosage: parsed.data.dosage.trim() || null,
      notes: parsed.data.notes.trim() || null,
      scheduleType: parsed.data.scheduleType,
      courseStartDate: parsed.data.scheduleType === 'course' ? startIso : null,
      courseDurationDays:
        parsed.data.scheduleType === 'course' ? (parsed.data.courseDurationDays ?? null) : null,
      active: parsed.data.active,
      doses: parsed.data.doses,
    };

    if (isEditMode && medicationId) {
      await updateMutation.mutateAsync({ id: medicationId, draft });
      navigate('/medications');
      return;
    }

    await createMutation.mutateAsync(draft);
    navigate('/medications');
  };

  if (isEditMode && isLoadingMedication) {
    return (
      <MedicationPageLayout onBack={() => navigate('/medications')} title="Sửa thuốc">
        <Stack spacing={1.5}>
          <Skeleton
            height={56}
            sx={(theme) => ({ borderRadius: theme.appTokens.radius.sm })}
            variant="rounded"
          />
          <Skeleton
            height={56}
            sx={(theme) => ({ borderRadius: theme.appTokens.radius.sm })}
            variant="rounded"
          />
          <Skeleton
            height={56}
            sx={(theme) => ({ borderRadius: theme.appTokens.radius.sm })}
            variant="rounded"
          />
          <Skeleton
            height={120}
            sx={(theme) => ({ borderRadius: theme.appTokens.radius.xl })}
            variant="rounded"
          />
        </Stack>
      </MedicationPageLayout>
    );
  }

  return (
    <MedicationPageLayout
      onBack={() => navigate('/medications')}
      title={isEditMode ? 'Sửa thuốc' : 'Thêm thuốc'}
    >
      <Stack spacing={2.5}>
        <AppFormProvider form={form} onSubmit={handleSubmit}>
          <FormTextField label="Tên thuốc *" name="name" required />
          <FormTextField label="Liều lượng" name="dosage" placeholder="vd: 1 viên" />
          <FormTextAreaField label="Ghi chú" name="notes" minRows={3} />

          <Stack spacing={1}>
            <Typography color="text.secondary" variant="subtitle2">
              Loại lịch *
            </Typography>
            <ButtonBase
              onClick={() => form.setValue('scheduleType', 'daily')}
              sx={(theme) => ({
                alignItems: 'center',
                backgroundColor:
                  scheduleType === 'daily'
                    ? theme.palette.surface.selected
                    : theme.palette.background.paper,
                border: '1px solid',
                borderColor: scheduleType === 'daily' ? 'primary.main' : 'divider',
                borderRadius: theme.appTokens.radius.sm,
                justifyContent: 'flex-start',
                px: 2,
                py: 1.25,
              })}
            >
              <Typography
                color={scheduleType === 'daily' ? 'text.primary' : 'text.secondary'}
                variant={scheduleType === 'daily' ? 'subtitle1' : 'subtitle2'}
              >
                Hằng ngày
              </Typography>
            </ButtonBase>
            <ButtonBase
              onClick={() => form.setValue('scheduleType', 'course')}
              sx={(theme) => ({
                alignItems: 'center',
                backgroundColor:
                  scheduleType === 'course'
                    ? theme.palette.surface.selected
                    : theme.palette.background.paper,
                border: '1px solid',
                borderColor: scheduleType === 'course' ? 'primary.main' : 'divider',
                borderRadius: theme.appTokens.radius.sm,
                justifyContent: 'flex-start',
                px: 2,
                py: 1.25,
              })}
            >
              <Typography
                color={scheduleType === 'course' ? 'text.primary' : 'text.secondary'}
                variant={scheduleType === 'course' ? 'subtitle1' : 'subtitle2'}
              >
                Theo liệu trình
              </Typography>
            </ButtonBase>
          </Stack>

          {scheduleType === 'course' ? (
            <Stack spacing={2}>
              <FormDateField label="Ngày bắt đầu *" name="courseStartDate" />
              <FormTextField
                inputMode="numeric"
                label="Số ngày *"
                name="courseDurationDays"
                type="number"
              />
              <Stack direction="row" justifyContent="space-between" px={0.25}>
                <Typography color="text.secondary" variant="subtitle2">
                  Kết thúc dự kiến
                </Typography>
                <Typography color="text.secondary" variant="subtitle1">
                  {computedEndDateLabel ?? '--/--/----'}
                </Typography>
              </Stack>
            </Stack>
          ) : null}

          <Stack spacing={1}>
            <Typography color="text.secondary" variant="subtitle2">
              Lịch uống
            </Typography>
            <DoseTimeListField />
          </Stack>

          {saveError ? (
            <Alert severity="error">Không thể lưu thuốc. Vui lòng thử lại.</Alert>
          ) : null}

          <Stack direction="row" spacing={1.25} sx={{ pt: 0.5 }}>
            <Button
              disabled={isSaving}
              fullWidth
              onClick={() => navigate('/medications')}
              variant="outlined"
            >
              Huỷ
            </Button>
            <AppSubmitButton
              disabled={isSaving}
              loading={isSaving}
              fullWidth
              type="submit"
              variant="contained"
            >
              Lưu
            </AppSubmitButton>
          </Stack>
        </AppFormProvider>
      </Stack>
    </MedicationPageLayout>
  );
}
