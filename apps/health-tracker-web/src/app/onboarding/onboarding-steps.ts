import { SUPPORTED_ONBOARDING_PHASES } from '@health-tracker/api';

import {
  ONBOARDING_STEP_IDS,
  type OnboardingStepDefinition,
  type OnboardingStepId,
} from './onboarding-types';

export const ONBOARDING_STEPS: readonly OnboardingStepDefinition[] = [
  {
    id: ONBOARDING_STEP_IDS.phase,
    title: 'Select Phase',
    description: 'Chọn nhánh sản phẩm phù hợp trước khi tiếp tục.',
  },
  {
    id: ONBOARDING_STEP_IDS.basicProfile,
    title: 'Basic Profile',
    description: 'Thêm tên và ngày sinh nếu Hoàng Thượng muốn cá nhân hóa.',
  },
  {
    id: ONBOARDING_STEP_IDS.cycle,
    title: 'Cycle Information',
    description: 'Bổ sung dữ liệu chu kỳ để các bước sau có bối cảnh phù hợp.',
  },
  {
    id: ONBOARDING_STEP_IDS.bodyMetrics,
    title: 'Body Metrics',
    description: 'Ghi nhận chiều cao và cân nặng nếu có sẵn.',
  },
  {
    id: ONBOARDING_STEP_IDS.completion,
    title: 'Completion',
    description: 'Xác nhận rằng bước khởi tạo đã hoàn tất.',
  },
];

export const ONBOARDING_STEP_COUNT = ONBOARDING_STEPS.length;

export const ONBOARDING_STEP_FIELD_NAMES = {
  phase: ['selectedPhase'] as const,
  basicProfile: ['displayName', 'birthDate'] as const,
  cycle: ['cycleLengthDays', 'lastPeriodStartDate'] as const,
  bodyMetrics: ['heightCm', 'weightKg'] as const,
  completion: [] as const,
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

export const SUPPORTED_PHASE_OPTIONS = SUPPORTED_ONBOARDING_PHASES;
