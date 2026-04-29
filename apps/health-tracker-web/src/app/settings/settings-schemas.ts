import { z } from 'zod';

import {
  cycleLengthDaysSchema,
  optionalDateTimeSchema,
  optionalPositiveNumberSchema,
  optionalTrimmedTextSchema,
} from '../profile/profile-schemas';

export const personalInfoSettingsSchema = z.object({
  displayName: optionalTrimmedTextSchema,
  birthDate: optionalDateTimeSchema,
  emergencyContactName: optionalTrimmedTextSchema,
  emergencyContactPhone: optionalTrimmedTextSchema,
});

export const cycleAndBodySettingsSchema = z.object({
  cycleLengthDays: cycleLengthDaysSchema,
  lastPeriodStartDate: optionalDateTimeSchema,
  heightCm: optionalPositiveNumberSchema,
  weightKg: optionalPositiveNumberSchema,
});
