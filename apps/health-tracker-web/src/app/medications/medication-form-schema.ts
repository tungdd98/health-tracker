import { z } from 'zod';

export const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const optionalTrimmedString = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .optional()
    .transform((value) => value ?? '');

const optionalPositiveInt = z.preprocess((value) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}, z.number().int().min(1, 'Tối thiểu 1 ngày').max(365, 'Tối đa 365 ngày').optional());

export const medicationFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Tên thuốc bắt buộc').max(100),
    dosage: optionalTrimmedString(50),
    notes: optionalTrimmedString(500),
    scheduleType: z.enum(['daily', 'course']),
    courseStartDate: z.any().optional().nullable(),
    courseDurationDays: optionalPositiveInt,
    active: z.boolean(),
    doses: z
      .array(
        z.object({
          timeOfDay: z.string().regex(timePattern, 'Giờ không hợp lệ'),
        }),
      )
      .min(1, 'Cần ít nhất 1 liều')
      .max(12, 'Tối đa 12 liều/ngày'),
  })
  .superRefine((data, ctx) => {
    if (data.scheduleType === 'course') {
      if (!data.courseStartDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bắt buộc',
          path: ['courseStartDate'],
        });
      }

      if (typeof data.courseDurationDays !== 'number') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Bắt buộc',
          path: ['courseDurationDays'],
        });
      }
    }
  });

export type MedicationFormValues = z.infer<typeof medicationFormSchema>;

export const defaultMedicationFormValues: MedicationFormValues = {
  name: '',
  dosage: '',
  notes: '',
  scheduleType: 'daily',
  courseStartDate: null,
  courseDurationDays: undefined,
  active: true,
  doses: [{ timeOfDay: '08:00' }],
};
