import { FormControlLabel, Switch, type SwitchProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField } from './form-field';

type FormSwitchFieldProps = {
  helperText?: string;
  label: string;
  name: string;
} & Omit<SwitchProps, 'name'>;

export function FormSwitchField({ helperText, label, name, ...props }: FormSwitchFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField error={fieldState.error?.message} helperText={helperText}>
          <FormControlLabel
            control={
              <Switch
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
