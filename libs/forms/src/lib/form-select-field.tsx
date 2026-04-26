import { MenuItem, TextField, type TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type SelectOption = {
  label: string;
  value: string;
};

type FormSelectFieldProps = {
  name: string;
  options: SelectOption[];
} & Omit<TextFieldProps, 'name' | 'select'>;

export function FormSelectField({ name, options, ...props }: FormSelectFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          error={fieldState.invalid}
          helperText={fieldState.error?.message ?? props.helperText}
          select
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}
