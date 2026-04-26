import { SUPPORTED_ONBOARDING_PHASES } from '@health-tracker/api';
import { z } from 'zod';

import {
  optionalDateTimeSchema,
  optionalPositiveIntegerSchema,
  optionalPositiveNumberSchema,
  optionalTrimmedTextSchema,
} from '../profile/profile-schemas';

export const onboardingPhaseSchema = z.object({
  selectedPhase: z
    .enum(SUPPORTED_ONBOARDING_PHASES)
    .nullable()
    .refine((value): value is (typeof SUPPORTED_ONBOARDING_PHASES)[number] => value !== null, {
      message: 'Hãy chọn một giai đoạn để tiếp tục.',
    }),
});

export const onboardingBasicProfileSchema = z.object({
  displayName: optionalTrimmedTextSchema,
  birthDate: optionalDateTimeSchema,
});

export const onboardingCycleSchema = z.object({
  cycleLengthDays: optionalPositiveIntegerSchema,
  lastPeriodStartDate: optionalDateTimeSchema,
});

export const onboardingBodyMetricsSchema = z.object({
  heightCm: optionalPositiveNumberSchema,
  weightKg: optionalPositiveNumberSchema,
});

export type OnboardingPhaseFormValues = z.infer<typeof onboardingPhaseSchema>;
export type OnboardingBasicProfileFormValues = z.infer<typeof onboardingBasicProfileSchema>;
export type OnboardingCycleFormValues = z.infer<typeof onboardingCycleSchema>;
export type OnboardingBodyMetricsFormValues = z.infer<typeof onboardingBodyMetricsSchema>;
