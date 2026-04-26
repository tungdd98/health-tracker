import { TextField, type TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type FormTextFieldProps = {
  name: string;
} & Omit<TextFieldProps, 'name'>;

export function FormTextField({ name, ...props }: FormTextFieldProps) {
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
          fullWidth
          helperText={fieldState.error?.message ?? props.helperText}
          value={field.value ?? ''}
        />
      )}
    />
  );
}
