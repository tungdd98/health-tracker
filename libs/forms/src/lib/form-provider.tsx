import { FormProvider as ReactHookFormProvider, type UseFormReturn } from 'react-hook-form';
import type { PropsWithChildren } from 'react';
import { Stack } from '@mui/material';

type AppFormProviderProps<TValues extends Record<string, unknown>> = PropsWithChildren<{
  form: UseFormReturn<TValues>;
  onSubmit: (values: TValues) => void | Promise<void>;
}>;

export function AppFormProvider<TValues extends Record<string, unknown>>({
  form,
  onSubmit,
  children,
}: AppFormProviderProps<TValues>) {
  return (
    <ReactHookFormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>{children}</Stack>
      </form>
    </ReactHookFormProvider>
  );
}
