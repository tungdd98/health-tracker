import type { DateTime } from 'luxon';

export const SETTINGS_SECTION_IDS = {
  personalInfo: 'personal-info',
  cycleAndBody: 'cycle-and-body',
} as const;

export type SettingsSectionId = (typeof SETTINGS_SECTION_IDS)[keyof typeof SETTINGS_SECTION_IDS];

export type SettingsSaveState = 'idle' | 'saving' | 'success' | 'error';

export type PersonalInfoSettingsFormValues = {
  displayName: string;
  birthDate: DateTime | null;
  emergencyContactName: string;
  emergencyContactPhone: string;
};

export type CycleAndBodySettingsFormValues = {
  cycleLengthDays: string;
  lastPeriodStartDate: DateTime | null;
  heightCm: string;
  weightKg: string;
};
