import { FormControl, FormHelperText, FormLabel, Stack } from '@mui/material';
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
          <FormLabel
            sx={(theme) => ({
              ...theme.appTokens.typography.sectionLabel,
              color: theme.palette.text.secondary,
            })}
          >
            {label}
          </FormLabel>
        ) : null}
        {children}
        {error || helperText ? <FormHelperText>{error ?? helperText}</FormHelperText> : null}
      </Stack>
    </FormControl>
  );
}
