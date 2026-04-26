import { Checkbox, FormControlLabel, type CheckboxProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField } from './form-field';

type FormCheckboxFieldProps = {
  helperText?: string;
  label: string;
  name: string;
} & Omit<CheckboxProps, 'name'>;

export function FormCheckboxField({ helperText, label, name, ...props }: FormCheckboxFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField error={fieldState.error?.message} helperText={helperText}>
          <FormControlLabel
            control={
              <Checkbox
                {...props}
                checked={Boolean(field.value)}
                onBlur={field.onBlur}
                onChange={(_event, checked) => field.onChange(checked)}
              />
            }
            label={label}
          />
        </FormField>
      )}
    />
  );
}
