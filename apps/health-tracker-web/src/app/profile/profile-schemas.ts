import { DateTime } from 'luxon';
import { z } from 'zod';

const luxonDateTimeSchema = z.custom<DateTime>((value) => DateTime.isDateTime(value));
const optionalStringValue = (value: unknown) =>
  value === null || value === undefined ? undefined : value;
const parseOptionalPositiveNumber = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : value;
  }

  if (typeof value === 'string') {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return undefined;
    }

    const parsedValue = Number(trimmedValue);
    return Number.isFinite(parsedValue) ? parsedValue : value;
  }

  return value;
};

export const optionalTrimmedTextSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return optionalStringValue(value);
  }

  const trimmedValue = value.trim();
  return trimmedValue || undefined;
}, z.string().max(120).optional());

export const optionalDateTimeSchema = z.preprocess((value) => {
  return DateTime.isDateTime(value) ? value : undefined;
}, luxonDateTimeSchema.optional());

export const optionalPositiveIntegerSchema = z.preprocess(
  parseOptionalPositiveNumber,
  z.number().int().positive().optional(),
);

export const cycleLengthDaysSchema = z.preprocess(
  parseOptionalPositiveNumber,
  z.number().int().min(21).max(45).optional(),
);

export const optionalPositiveNumberSchema = z.preprocess(
  parseOptionalPositiveNumber,
  z.number().positive().optional(),
);
