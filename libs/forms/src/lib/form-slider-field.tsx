import { Slider, Stack, Typography, type SliderProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField } from './form-field';

type FormSliderFieldProps = {
  helperText?: string;
  label: string;
  name: string;
} & Omit<SliderProps, 'name'>;

export function FormSliderField({ helperText, label, name, ...props }: FormSliderFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField error={fieldState.error?.message} helperText={helperText} label={label}>
          <Stack spacing={1}>
            <Slider
              {...props}
              value={typeof field.value === 'number' ? field.value : 0}
              onBlur={field.onBlur}
              onChange={(_event, value) => field.onChange(value)}
              valueLabelDisplay="auto"
            />
            <Typography color="text.secondary" variant="caption">
              Current value: {field.value}
            </Typography>
          </Stack>
        </FormField>
      )}
    />
  );
}
