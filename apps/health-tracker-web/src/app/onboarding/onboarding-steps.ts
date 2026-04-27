import {
  ONBOARDING_STEP_IDS,
  type OnboardingStepDefinition,
  type OnboardingStepId,
} from './onboarding-types';

export const ONBOARDING_STEPS: readonly OnboardingStepDefinition[] = [
  {
    id: ONBOARDING_STEP_IDS.phase,
    title: 'Chọn giai đoạn',
    description: 'Bắt đầu bằng việc chọn giai đoạn phù hợp với hành trình của bạn.',
  },
  {
    id: ONBOARDING_STEP_IDS.basicProfile,
    title: 'Thông tin cơ bản',
    description: 'Thêm vài thông tin nhẹ nhàng để trải nghiệm theo dõi gần gũi hơn.',
  },
  {
    id: ONBOARDING_STEP_IDS.cycle,
    title: 'Chu kỳ',
    description: 'Nếu đã có sẵn, hãy thêm dữ liệu chu kỳ để việc theo dõi sát hơn.',
  },
  {
    id: ONBOARDING_STEP_IDS.bodyMetrics,
    title: 'Chỉ số cơ thể',
    description: 'Bạn có thể bổ sung chiều cao và cân nặng ngay bây giờ hoặc để sau.',
  },
  {
    id: ONBOARDING_STEP_IDS.completion,
    title: 'Hoàn tất',
    description: 'Bạn đã sẵn sàng để bắt đầu theo dõi nhịp sức khỏe của mình.',
  },
];

export const ONBOARDING_STEP_COUNT = ONBOARDING_STEPS.length;

export const ONBOARDING_STEP_FIELD_NAMES = {
  [ONBOARDING_STEP_IDS.phase]: ['selectedPhase'] as const,
  [ONBOARDING_STEP_IDS.basicProfile]: ['displayName', 'birthDate'] as const,
  [ONBOARDING_STEP_IDS.cycle]: ['cycleLengthDays', 'lastPeriodStartDate'] as const,
  [ONBOARDING_STEP_IDS.bodyMetrics]: ['heightCm', 'weightKg'] as const,
  [ONBOARDING_STEP_IDS.completion]: [] as const,
} as const;

export const ONBOARDING_OPTIONAL_STEP_IDS = [
  ONBOARDING_STEP_IDS.basicProfile,
  ONBOARDING_STEP_IDS.cycle,
  ONBOARDING_STEP_IDS.bodyMetrics,
] as const;

export const getOnboardingStepIndex = (stepId: OnboardingStepId) =>
  ONBOARDING_STEPS.findIndex((step) => step.id === stepId);

export const getOnboardingStepById = (stepId: OnboardingStepId) =>
  ONBOARDING_STEPS.find((step) => step.id === stepId) ?? ONBOARDING_STEPS[0];

export const getNextOnboardingStepId = (stepId: OnboardingStepId) => {
  const currentIndex = getOnboardingStepIndex(stepId);

  return currentIndex >= 0 && currentIndex < ONBOARDING_STEPS.length - 1
    ? (ONBOARDING_STEPS[currentIndex + 1]?.id ?? null)
    : null;
};

export const getPreviousOnboardingStepId = (stepId: OnboardingStepId) => {
  const currentIndex = getOnboardingStepIndex(stepId);

  return currentIndex > 0 ? (ONBOARDING_STEPS[currentIndex - 1]?.id ?? null) : null;
};

export { SUPPORTED_ONBOARDING_PHASES as SUPPORTED_PHASE_OPTIONS } from '@health-tracker/api';
