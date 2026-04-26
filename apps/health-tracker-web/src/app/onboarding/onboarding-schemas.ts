import { SUPPORTED_ONBOARDING_PHASES } from '@health-tracker/api';
import { DateTime } from 'luxon';
import { z } from 'zod';

const optionalTextSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return value === null || value === undefined ? undefined : value;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : undefined;
}, z.string().max(120).optional());

const optionalDateSchema = z.preprocess((value) => {
  if (value instanceof DateTime) {
    return value;
  }

  return undefined;
}, z.instanceof(DateTime).optional());

const optionalIntegerSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return undefined;
    }

    const parsedValue = Number(trimmedValue);

    return Number.isFinite(parsedValue) ? parsedValue : value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return value;
}, z.number().int().positive().optional());

const optionalNumberSchema = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return undefined;
    }

    const parsedValue = Number(trimmedValue);

    return Number.isFinite(parsedValue) ? parsedValue : value;
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return value;
}, z.number().positive().optional());

export const onboardingPhaseSchema = z.object({
  selectedPhase: z
    .enum(SUPPORTED_ONBOARDING_PHASES)
    .nullable()
    .refine((value): value is (typeof SUPPORTED_ONBOARDING_PHASES)[number] => value !== null, {
      message: 'Hãy chọn một giai đoạn để tiếp tục.',
    }),
});

export const onboardingBasicProfileSchema = z.object({
  displayName: optionalTextSchema,
  birthDate: optionalDateSchema,
});

export const onboardingCycleSchema = z.object({
  cycleLengthDays: optionalIntegerSchema,
  lastPeriodStartDate: optionalDateSchema,
});

export const onboardingBodyMetricsSchema = z.object({
  heightCm: optionalNumberSchema,
  weightKg: optionalNumberSchema,
});

export type OnboardingPhaseFormValues = z.infer<typeof onboardingPhaseSchema>;
export type OnboardingBasicProfileFormValues = z.infer<typeof onboardingBasicProfileSchema>;
export type OnboardingCycleFormValues = z.infer<typeof onboardingCycleSchema>;
export type OnboardingBodyMetricsFormValues = z.infer<typeof onboardingBodyMetricsSchema>;
