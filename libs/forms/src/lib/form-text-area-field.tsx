import { TextField, type TextFieldProps } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

type FormTextAreaFieldProps = {
  name: string;
} & Omit<TextFieldProps, 'multiline' | 'name'>;

export function FormTextAreaField({ name, ...props }: FormTextAreaFieldProps) {
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
          minRows={4}
          multiline
        />
      )}
    />
  );
}
