import { FormControl, FormHelperText, FormLabel, Stack, Typography } from '@mui/material';
import type { PropsWithChildren, ReactNode } from 'react';

type FormFieldProps = PropsWithChildren<{
  error?: string;
  helperText?: ReactNode;
  label?: string;
}>;

export function FormField({ children, error, helperText, label }: FormFieldProps) {
  return (
    <FormControl error={Boolean(error)} fullWidth>
      <Stack spacing={1.1}>
        {label ? (
          <FormLabel>
            <Typography color="text.secondary" component="span" variant="subtitle2">
              {label}
            </Typography>
          </FormLabel>
        ) : null}
        {children}
        {error || helperText ? (
          <FormHelperText>
            <Typography component="span" variant="body2">
              {error ?? helperText}
            </Typography>
          </FormHelperText>
        ) : null}
      </Stack>
    </FormControl>
  );
}
