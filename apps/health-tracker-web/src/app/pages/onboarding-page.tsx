import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Alert, Box, Button, CircularProgress } from '@mui/material';
import { DateTime } from 'luxon';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { ZodIssue } from 'zod';

import {
  completeOnboarding,
  mapAuthErrorToMessage,
  updateOnboardingProfile,
} from '@health-tracker/api';
import { AppFormProvider } from '@health-tracker/forms';

import { useAuthSession } from '../auth/use-auth-session';
import { OnboardingLayout } from '../components/onboarding-layout';
import { BasicProfileStep } from '../onboarding/basic-profile-step';
import { BodyMetricsStep } from '../onboarding/body-metrics-step';
import { CompletionStep } from '../onboarding/completion-step';
import { CycleStep } from '../onboarding/cycle-step';
import { PhaseStep } from '../onboarding/phase-step';
import {
  onboardingBasicProfileSchema,
  onboardingBodyMetricsSchema,
  onboardingCycleSchema,
  onboardingPhaseSchema,
} from '../onboarding/onboarding-schemas';
import {
  ONBOARDING_OPTIONAL_STEP_IDS,
  ONBOARDING_STEP_COUNT,
  ONBOARDING_STEP_FIELD_NAMES,
  getNextOnboardingStepId,
  getOnboardingStepById,
  getOnboardingStepIndex,
  getPreviousOnboardingStepId,
} from '../onboarding/onboarding-steps';
import type {
  OnboardingBasicProfileStepValues,
  OnboardingBodyMetricsStepValues,
  OnboardingCycleStepValues,
  OnboardingFormValues,
  OnboardingPhaseStepValues,
  OnboardingStepId,
} from '../onboarding/onboarding-types';
import { ONBOARDING_STEP_IDS } from '../onboarding/onboarding-types';

const toDateTimeOrNull = (value: string | null) => {
  if (!value) {
    return null;
  }

  const parsedValue = DateTime.fromISO(value);

  return parsedValue.isValid ? parsedValue : null;
};

const buildFormDefaults = (
  profile: ReturnType<typeof useAuthSession>['onboardingProfile'],
): OnboardingFormValues => ({
  selectedPhase: profile.selectedPhase,
  displayName: profile.displayName ?? '',
  birthDate: toDateTimeOrNull(profile.birthDate),
  cycleLengthDays: profile.cycleLengthDays?.toString() ?? '',
  lastPeriodStartDate: toDateTimeOrNull(profile.lastPeriodStartDate),
  heightCm: profile.heightCm?.toString() ?? '',
  weightKg: profile.weightKg?.toString() ?? '',
});

const isOptionalStep = (stepId: OnboardingStepId) =>
  ONBOARDING_OPTIONAL_STEP_IDS.includes(stepId as (typeof ONBOARDING_OPTIONAL_STEP_IDS)[number]);

const clearStepErrors = (
  clearErrors: UseFormReturn<OnboardingFormValues>['clearErrors'],
  stepId: OnboardingStepId,
) => {
  clearErrors(ONBOARDING_STEP_FIELD_NAMES[stepId]);
};

const mapZodIssuesToFields = (
  form: UseFormReturn<OnboardingFormValues>,
  issues: ZodIssue[],
  stepId: OnboardingStepId,
) => {
  clearStepErrors(form.clearErrors, stepId);

  issues.forEach((issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === 'string') {
      form.setError(fieldName as keyof OnboardingFormValues, {
        type: 'manual',
        message: issue.message,
      });
    }
  });
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const { hasSelectedOnboardingPhase, isOnboardingComplete, onboardingProfile, user } =
    useAuthSession();

  const [currentStepId, setCurrentStepId] = useState<OnboardingStepId>(ONBOARDING_STEP_IDS.phase);
  const [profileSnapshot, setProfileSnapshot] = useState(onboardingProfile);
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const defaultValues = useMemo(() => buildFormDefaults(profileSnapshot), [profileSnapshot]);

  const form = useForm<OnboardingFormValues>({
    defaultValues,
    mode: 'onBlur',
  });

  const selectedPhase = useWatch({ control: form.control, name: 'selectedPhase' });
  const displayName = useWatch({ control: form.control, name: 'displayName' });
  const birthDate = useWatch({ control: form.control, name: 'birthDate' });
  const cycleLengthDays = useWatch({ control: form.control, name: 'cycleLengthDays' });
  const lastPeriodStartDate = useWatch({ control: form.control, name: 'lastPeriodStartDate' });
  const heightCm = useWatch({ control: form.control, name: 'heightCm' });
  const weightKg = useWatch({ control: form.control, name: 'weightKg' });

  useEffect(() => {
    setProfileSnapshot(onboardingProfile);
  }, [onboardingProfile]);

  useEffect(() => {
    form.reset(defaultValues);
    clearStepErrors(form.clearErrors, currentStepId);
    setSubmitError('');
  }, [currentStepId, defaultValues, form]);

  useEffect(() => {
    if (isOnboardingComplete) {
      navigate('/', { replace: true });
    }
  }, [isOnboardingComplete, navigate]);

  const currentStep = getOnboardingStepById(currentStepId);
  const currentStepNumber = getOnboardingStepIndex(currentStepId) + 1;
  const isSubmitting = isSaving || form.formState.isSubmitting;

  const isCurrentStepEmpty = (() => {
    switch (currentStepId) {
      case ONBOARDING_STEP_IDS.basicProfile:
        return !displayName && !birthDate;
      case ONBOARDING_STEP_IDS.cycle:
        return !cycleLengthDays && !lastPeriodStartDate;
      case ONBOARDING_STEP_IDS.bodyMetrics:
        return !heightCm && !weightKg;
      default:
        return true;
    }
  })();

  const showSkip = isOptionalStep(currentStepId) && isCurrentStepEmpty;
  const canGoBack = currentStepId !== ONBOARDING_STEP_IDS.phase;

  const mergeProfileSnapshot = (patch: Partial<ReturnType<typeof buildFormDefaults>>) => {
    setProfileSnapshot((current) => ({
      ...current,
      ...patch,
    }));
  };

  const validateAndPersistCurrentStep = async () => {
    if (!user) {
      return;
    }

    if (currentStepId === ONBOARDING_STEP_IDS.phase) {
      const result = onboardingPhaseSchema.safeParse({
        selectedPhase,
      } satisfies OnboardingPhaseStepValues);

      if (!result.success) {
        mapZodIssuesToFields(form, result.error.issues, currentStepId);
        return;
      }

      setIsSaving(true);
      const { error } = await updateOnboardingProfile(user, {
        selectedPhase: result.data.selectedPhase,
      });
      setIsSaving(false);

      if (error) {
        setSubmitError(mapAuthErrorToMessage(error));
        return;
      }

      mergeProfileSnapshot({
        selectedPhase: result.data.selectedPhase,
      });
      setCurrentStepId(getNextOnboardingStepId(currentStepId) ?? ONBOARDING_STEP_IDS.basicProfile);
      return;
    }

    if (currentStepId === ONBOARDING_STEP_IDS.basicProfile) {
      const result = onboardingBasicProfileSchema.safeParse({
        displayName,
        birthDate,
      } satisfies OnboardingBasicProfileStepValues);

      if (!result.success) {
        mapZodIssuesToFields(form, result.error.issues, currentStepId);
        return;
      }

      setIsSaving(true);
      const { error } = await updateOnboardingProfile(user, {
        displayName: result.data.displayName?.trim() || undefined,
        birthDate: result.data.birthDate
          ? (result.data.birthDate.toISODate() ?? undefined)
          : undefined,
      });
      setIsSaving(false);

      if (error) {
        setSubmitError(mapAuthErrorToMessage(error));
        return;
      }

      mergeProfileSnapshot({
        displayName: result.data.displayName?.trim() ?? '',
        birthDate: result.data.birthDate ? (result.data.birthDate.toISODate() ?? null) : null,
      });
      setCurrentStepId(getNextOnboardingStepId(currentStepId) ?? ONBOARDING_STEP_IDS.cycle);
      return;
    }

    if (currentStepId === ONBOARDING_STEP_IDS.cycle) {
      const result = onboardingCycleSchema.safeParse({
        cycleLengthDays,
        lastPeriodStartDate,
      } satisfies OnboardingCycleStepValues);

      if (!result.success) {
        mapZodIssuesToFields(form, result.error.issues, currentStepId);
        return;
      }

      setIsSaving(true);
      const { error } = await updateOnboardingProfile(user, {
        cycleLengthDays: result.data.cycleLengthDays,
        lastPeriodStartDate: result.data.lastPeriodStartDate
          ? (result.data.lastPeriodStartDate.toISODate() ?? undefined)
          : undefined,
      });
      setIsSaving(false);

      if (error) {
        setSubmitError(mapAuthErrorToMessage(error));
        return;
      }

      mergeProfileSnapshot({
        cycleLengthDays: result.data.cycleLengthDays?.toString() ?? '',
        lastPeriodStartDate: result.data.lastPeriodStartDate
          ? (result.data.lastPeriodStartDate.toISODate() ?? null)
          : null,
      });
      setCurrentStepId(getNextOnboardingStepId(currentStepId) ?? ONBOARDING_STEP_IDS.bodyMetrics);
      return;
    }

    if (currentStepId === ONBOARDING_STEP_IDS.bodyMetrics) {
      const result = onboardingBodyMetricsSchema.safeParse({
        heightCm,
        weightKg,
      } satisfies OnboardingBodyMetricsStepValues);

      if (!result.success) {
        mapZodIssuesToFields(form, result.error.issues, currentStepId);
        return;
      }

      setIsSaving(true);
      const { error } = await updateOnboardingProfile(user, {
        heightCm: result.data.heightCm,
        weightKg: result.data.weightKg,
      });
      setIsSaving(false);

      if (error) {
        setSubmitError(mapAuthErrorToMessage(error));
        return;
      }

      mergeProfileSnapshot({
        heightCm: result.data.heightCm?.toString() ?? '',
        weightKg: result.data.weightKg?.toString() ?? '',
      });
      setCurrentStepId(ONBOARDING_STEP_IDS.completion);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      return;
    }

    setSubmitError('');
    setIsSaving(true);

    const { error } = await completeOnboarding(user);

    setIsSaving(false);

    if (error) {
      setSubmitError(mapAuthErrorToMessage(error));
      return;
    }

    navigate('/', { replace: true });
  };

  const handleBack = () => {
    const previousStepId = getPreviousOnboardingStepId(currentStepId);

    if (previousStepId) {
      setSubmitError('');
      setCurrentStepId(previousStepId);
    }
  };

  const handleSkip = () => {
    const nextStepId = getNextOnboardingStepId(currentStepId);

    if (nextStepId && isOptionalStep(currentStepId)) {
      setSubmitError('');
      setCurrentStepId(nextStepId);
    }
  };

  const stepContent = (() => {
    switch (currentStepId) {
      case ONBOARDING_STEP_IDS.phase:
        return <PhaseStep />;
      case ONBOARDING_STEP_IDS.basicProfile:
        return <BasicProfileStep />;
      case ONBOARDING_STEP_IDS.cycle:
        return <CycleStep />;
      case ONBOARDING_STEP_IDS.bodyMetrics:
        return <BodyMetricsStep />;
      case ONBOARDING_STEP_IDS.completion:
        return (
          <CompletionStep
            footer="Khi xác nhận, Hoàng Thượng sẽ vào trang chủ tạm thời của ứng dụng."
            onPrimaryAction={handleComplete}
            primaryActionDisabled={isSubmitting}
            primaryActionLabel="Vào ứng dụng"
            primaryActionLoading={isSubmitting}
          />
        );
      default:
        return null;
    }
  })();

  const continueAction =
    currentStepId === ONBOARDING_STEP_IDS.completion ? null : (
      <Button disabled={isSubmitting} fullWidth type="submit" variant="contained">
        {isSubmitting ? (
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress color="inherit" size={18} />
            Đang lưu...
          </Box>
        ) : (
          'Tiếp tục'
        )}
      </Button>
    );

  const skipAction = showSkip ? (
    <Button
      disabled={isSubmitting}
      fullWidth
      onClick={handleSkip}
      startIcon={<CloseRoundedIcon />}
      variant="text"
    >
      Bỏ qua
    </Button>
  ) : null;

  const backAction = canGoBack ? (
    <Button
      disabled={isSubmitting}
      fullWidth
      onClick={handleBack}
      startIcon={<ArrowBackRoundedIcon />}
      variant="outlined"
    >
      Quay lại
    </Button>
  ) : null;

  return (
    <AppFormProvider
      form={form}
      onSubmit={
        currentStepId === ONBOARDING_STEP_IDS.completion
          ? handleComplete
          : validateAndPersistCurrentStep
      }
    >
      <OnboardingLayout
        backAction={backAction}
        continueAction={continueAction}
        currentStepNumber={currentStepNumber}
        description={currentStep.description}
        eyebrow={hasSelectedOnboardingPhase ? 'Đã chọn phase' : 'Thiết lập ban đầu'}
        footerNote={
          currentStepId === ONBOARDING_STEP_IDS.phase
            ? 'Phase đầu tiên là bắt buộc.'
            : 'Các bước còn lại có thể bỏ qua nếu chưa có dữ liệu.'
        }
        skipAction={skipAction}
        title={currentStep.title}
        totalSteps={ONBOARDING_STEP_COUNT}
      >
        {submitError ? (
          <Alert color="error" variant="filled">
            {submitError}
          </Alert>
        ) : null}
        {stepContent}
      </OnboardingLayout>
    </AppFormProvider>
  );
}
