import { FormControlLabel, Radio, RadioGroup, type RadioGroupProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField } from './form-field';

type RadioOption = {
  label: string;
  value: string;
};

type FormRadioGroupProps = {
  label?: string;
  name: string;
  options: RadioOption[];
} & Omit<RadioGroupProps, 'name'>;

export function FormRadioGroup({ label, name, options, ...props }: FormRadioGroupProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField error={fieldState.error?.message} label={label}>
          <RadioGroup {...props} {...field}>
            {options.map((option) => (
              <FormControlLabel
                control={<Radio />}
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </RadioGroup>
        </FormField>
      )}
    />
  );
}
