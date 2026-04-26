import type { OnboardingProfile } from '@health-tracker/api';
import { DateTime } from 'luxon';

export const toDateTimeOrNull = (value: string | null) => {
  if (!value) {
    return null;
  }

  const parsedValue = DateTime.fromISO(value);
  return parsedValue.isValid ? parsedValue : null;
};

export const toOptionalNumberInput = (value: number | null) =>
  value === null ? '' : value.toString();

export const normalizeOptionalText = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue || undefined;
};

export const normalizeOptionalIsoDate = (value: DateTime | undefined) =>
  value ? (value.toISODate() ?? undefined) : undefined;

export const toPersonalInfoDefaults = (profile: OnboardingProfile) => ({
  selectedPhase: profile.selectedPhase,
  displayName: profile.displayName ?? '',
  birthDate: toDateTimeOrNull(profile.birthDate),
});

export const toCycleAndBodyDefaults = (profile: OnboardingProfile) => ({
  cycleLengthDays: toOptionalNumberInput(profile.cycleLengthDays),
  lastPeriodStartDate: toDateTimeOrNull(profile.lastPeriodStartDate),
  heightCm: toOptionalNumberInput(profile.heightCm),
  weightKg: toOptionalNumberInput(profile.weightKg),
});
