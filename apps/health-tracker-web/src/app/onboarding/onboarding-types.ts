import type { OnboardingPhase } from '@health-tracker/api';
import type { DateTime } from 'luxon';

export const ONBOARDING_STEP_IDS = {
  phase: 'phase',
  basicProfile: 'basic-profile',
  cycle: 'cycle',
  bodyMetrics: 'body-metrics',
  completion: 'completion',
} as const;

export type OnboardingStepId = (typeof ONBOARDING_STEP_IDS)[keyof typeof ONBOARDING_STEP_IDS];

export type OnboardingStepDefinition = {
  id: OnboardingStepId;
  title: string;
  description: string;
};

export type OnboardingPhaseOption = {
  phase?: OnboardingPhase;
  label: string;
  description: string;
  disabled?: boolean;
  helperLabel?: string;
};

export type OnboardingPhaseStepValues = {
  selectedPhase: OnboardingPhase | null;
};

export type OnboardingBasicProfileStepValues = {
  displayName: string;
  birthDate: DateTime | null;
};

export type OnboardingCycleStepValues = {
  cycleLengthDays: string;
  lastPeriodStartDate: DateTime | null;
};

export type OnboardingBodyMetricsStepValues = {
  heightCm: string;
  weightKg: string;
};

export type OnboardingFormValues = OnboardingPhaseStepValues &
  OnboardingBasicProfileStepValues &
  OnboardingCycleStepValues &
  OnboardingBodyMetricsStepValues;
