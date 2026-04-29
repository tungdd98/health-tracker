import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { IconButton, Stack, TextField, Typography } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DateTime } from 'luxon';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import type { MedicationFormValues } from './medication-form-schema';

const MAX_DOSES = 12;

export function DoseTimeListField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<MedicationFormValues>();

  const { append, fields, remove } = useFieldArray({
    control,
    name: 'doses',
  });

  const dosesError = errors.doses;

  const parseTimeValue = (value: string | undefined) => {
    if (!value) {
      return null;
    }

    const parsed = DateTime.fromFormat(value, 'HH:mm');
    return parsed.isValid ? parsed : null;
  };

  const toTimeString = (value: DateTime | null) => {
    if (!value?.isValid) {
      return '';
    }

    return value.toFormat('HH:mm');
  };

  return (
    <Stack spacing={1}>
      {fields.map((field, index) => (
        <Controller
          key={field.id}
          control={control}
          name={`doses.${index}.timeOfDay`}
          render={({ field: inputField, fieldState }) => (
            <Stack alignItems="center" direction="row" spacing={1}>
              <TimePicker
                ampm={false}
                enableAccessibleFieldDOMStructure={false}
                format="HH:mm"
                label={`Liều ${index + 1}`}
                onChange={(value) => inputField.onChange(toTimeString(value))}
                slotProps={{
                  textField: {
                    error: fieldState.invalid,
                    fullWidth: true,
                    helperText: fieldState.error?.message,
                  },
                }}
                slots={{
                  textField: TextField,
                }}
                value={parseTimeValue(inputField.value)}
              />
              {fields.length > 1 ? (
                <IconButton
                  aria-label={`Xoá liều ${index + 1}`}
                  onClick={() => remove(index)}
                  size="small"
                >
                  <CloseRoundedIcon />
                </IconButton>
              ) : null}
            </Stack>
          )}
        />
      ))}

      <Stack direction="row" justifyContent="space-between">
        <IconButton
          aria-label="Thêm liều"
          disabled={fields.length >= MAX_DOSES}
          onClick={() => append({ timeOfDay: '08:00' })}
          size="small"
          sx={(theme) => ({
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            },
            '&.Mui-disabled': {
              bgcolor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          })}
        >
          <AddRoundedIcon />
        </IconButton>
      </Stack>

      {dosesError && !Array.isArray(dosesError) ? (
        <Typography color="error" variant="caption">
          {dosesError.message}
        </Typography>
      ) : null}
    </Stack>
  );
}
