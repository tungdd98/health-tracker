import { TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useFormContext } from 'react-hook-form';

type FormDateFieldProps = {
  label: string;
  name: string;
};

export function FormDateField({ label, name }: FormDateFieldProps) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <DatePicker
          enableAccessibleFieldDOMStructure={false}
          label={label}
          value={field.value ?? null}
          onChange={(value) => field.onChange(value)}
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
        />
      )}
    />
  );
}
