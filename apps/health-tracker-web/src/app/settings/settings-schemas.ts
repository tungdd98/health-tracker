import { z } from 'zod';

import {
  optionalDateTimeSchema,
  optionalPositiveIntegerSchema,
  optionalPositiveNumberSchema,
  optionalTrimmedTextSchema,
} from '../profile/profile-schemas';

export const personalInfoSettingsSchema = z.object({
  displayName: optionalTrimmedTextSchema,
  birthDate: optionalDateTimeSchema,
});

export const cycleAndBodySettingsSchema = z.object({
  cycleLengthDays: optionalPositiveIntegerSchema,
  lastPeriodStartDate: optionalDateTimeSchema,
  heightCm: optionalPositiveNumberSchema,
  weightKg: optionalPositiveNumberSchema,
});
