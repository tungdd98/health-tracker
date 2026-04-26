import { ToggleButton, ToggleButtonGroup, type ToggleButtonGroupProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField } from './form-field';

type SegmentOption = {
  label: string;
  value: string;
};

type FormSegmentedControlProps = {
  label?: string;
  name: string;
  options: SegmentOption[];
} & Omit<ToggleButtonGroupProps, 'exclusive' | 'name' | 'value'>;

export function FormSegmentedControl({
  label,
  name,
  options,
  ...props
}: FormSegmentedControlProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField error={fieldState.error?.message} label={label}>
          <ToggleButtonGroup
            {...props}
            exclusive
            fullWidth
            value={field.value ?? null}
            onChange={(_event, value) => {
              if (value !== null) {
                field.onChange(value);
              }
            }}
          >
            {options.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </FormField>
      )}
    />
  );
}
