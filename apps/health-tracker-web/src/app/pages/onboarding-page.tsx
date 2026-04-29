import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Alert, Button } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch, type Path, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { ZodIssue } from 'zod';

import {
  completeOnboarding,
  generateMoodImages,
  getUserMoodImages,
  mapAuthErrorToMessage,
  type MoodValue,
  type OnboardingProfile,
  updateAvatarMeta,
  updateOnboardingProfile,
  uploadAvatar,
} from '@health-tracker/api';
import { AppFormProvider } from '@health-tracker/forms';
import { AppSubmitButton } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';
import { OnboardingLayout } from '../components/onboarding-layout';
import { BasicProfileStep } from '../onboarding/basic-profile-step';
import { OnboardingWowScreen } from '../onboarding/onboarding-wow-screen';
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
import {
  normalizeOptionalIsoDate,
  normalizeOptionalText,
  toCycleAndBodyDefaults,
  toPersonalInfoDefaults,
} from '../profile/profile-mappers';

const isSameOnboardingProfile = (current: OnboardingProfile, next: OnboardingProfile) =>
  current.selectedPhase === next.selectedPhase &&
  current.onboardingCompleted === next.onboardingCompleted &&
  current.onboardingCompletedAt === next.onboardingCompletedAt &&
  current.displayName === next.displayName &&
  current.birthDate === next.birthDate &&
  current.cycleLengthDays === next.cycleLengthDays &&
  current.lastPeriodStartDate === next.lastPeriodStartDate &&
  current.heightCm === next.heightCm &&
  current.weightKg === next.weightKg;

const buildFormDefaults = (
  profile: ReturnType<typeof useAuthSession>['onboardingProfile'],
): OnboardingFormValues => ({
  ...toPersonalInfoDefaults(profile),
  ...toCycleAndBodyDefaults(profile),
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
      form.setError(fieldName as Path<OnboardingFormValues>, {
        type: 'manual',
        message: issue.message,
      });
    }
  });
};

export function OnboardingPage() {
  const navigate = useNavigate();
  const { isOnboardingComplete, onboardingProfile, user } = useAuthSession();

  const [currentStepId, setCurrentStepId] = useState<OnboardingStepId>(ONBOARDING_STEP_IDS.phase);
  const [profileSnapshot, setProfileSnapshot] = useState(onboardingProfile);
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [showWowScreen, setShowWowScreen] = useState(false);
  const [wowMoodImages, setWowMoodImages] = useState<Partial<Record<MoodValue, string>>>({});

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
    setProfileSnapshot((current) =>
      isSameOnboardingProfile(current, onboardingProfile) ? current : onboardingProfile,
    );
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
  const canGoBack =
    currentStepId !== ONBOARDING_STEP_IDS.phase && currentStepId !== ONBOARDING_STEP_IDS.completion;

  const mergeProfileSnapshot = (patch: Partial<OnboardingProfile>) => {
    setProfileSnapshot((current) => ({
      ...current,
      ...patch,
    }));
  };

  const handleAvatarChange = async (file: File) => {
    if (!user) return;
    try {
      const url = await uploadAvatar(user.id, file);
      await updateAvatarMeta(user.id, { avatarUrl: url });
      setAvatarFile(file);
      setAvatarPreviewUrl(url);
    } catch {
      // silent — avatar upload failure is non-blocking in onboarding
    }
  };

  const handleWowContinue = () => {
    setShowWowScreen(false);
    setCurrentStepId(
      getNextOnboardingStepId(ONBOARDING_STEP_IDS.basicProfile) ?? ONBOARDING_STEP_IDS.cycle,
    );
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
        displayName: normalizeOptionalText(result.data.displayName),
        birthDate: normalizeOptionalIsoDate(result.data.birthDate),
      });
      setIsSaving(false);

      if (error) {
        setSubmitError(mapAuthErrorToMessage(error));
        return;
      }

      mergeProfileSnapshot({
        displayName: normalizeOptionalText(result.data.displayName) ?? null,
        birthDate: normalizeOptionalIsoDate(result.data.birthDate) ?? null,
      });

      if (avatarFile) {
        setIsSaving(true);
        try {
          await generateMoodImages(user.id);
          const images = await getUserMoodImages(user.id);
          setWowMoodImages(images);
          setShowWowScreen(true);
        } catch {
          setCurrentStepId(getNextOnboardingStepId(currentStepId) ?? ONBOARDING_STEP_IDS.cycle);
        } finally {
          setIsSaving(false);
        }
        return;
      }

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
        lastPeriodStartDate: normalizeOptionalIsoDate(result.data.lastPeriodStartDate),
      });
      setIsSaving(false);

      if (error) {
        setSubmitError(mapAuthErrorToMessage(error));
        return;
      }

      mergeProfileSnapshot({
        cycleLengthDays: result.data.cycleLengthDays ?? null,
        lastPeriodStartDate: normalizeOptionalIsoDate(result.data.lastPeriodStartDate) ?? null,
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
        heightCm: result.data.heightCm ?? null,
        weightKg: result.data.weightKg ?? null,
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
        return (
          <BasicProfileStep
            avatarPreviewUrl={avatarPreviewUrl}
            onAvatarChange={(file) => void handleAvatarChange(file)}
          />
        );
      case ONBOARDING_STEP_IDS.cycle:
        return <CycleStep />;
      case ONBOARDING_STEP_IDS.bodyMetrics:
        return <BodyMetricsStep />;
      case ONBOARDING_STEP_IDS.completion:
        return (
          <CompletionStep
            onPrimaryAction={handleComplete}
            primaryActionDisabled={isSubmitting}
            primaryActionLabel="Vào app"
            primaryActionLoading={isSubmitting}
          />
        );
      default:
        return null;
    }
  })();

  const continueAction =
    currentStepId === ONBOARDING_STEP_IDS.completion ? null : (
      <AppSubmitButton fullWidth loading={isSubmitting} type="submit" variant="contained">
        Tiếp tục
      </AppSubmitButton>
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

  if (showWowScreen) {
    return <OnboardingWowScreen moodImages={wowMoodImages} onContinue={handleWowContinue} />;
  }

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
        eyebrow="Thiết lập ban đầu"
        skipAction={skipAction}
        stepLabel={currentStep.title}
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
