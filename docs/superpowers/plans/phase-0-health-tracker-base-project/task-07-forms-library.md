### Task 07: Build the forms library

**Files:**
- Create: `libs/forms/src/lib/form-provider.tsx`
- Create: `libs/forms/src/lib/form-text-field.tsx`
- Modify: `libs/forms/src/index.ts`

- [ ] **Step 1: Implement the shared form provider**

Create `libs/forms/src/lib/form-provider.tsx`:

```tsx
import type { PropsWithChildren } from 'react';
import { FormProvider as ReactHookFormProvider, type UseFormReturn } from 'react-hook-form';

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
        {children}
      </form>
    </ReactHookFormProvider>
  );
}
```

Expected: The workspace has a standard wrapper for RHF-based forms.

- [ ] **Step 2: Implement the shared text field wrapper**

Create `libs/forms/src/lib/form-text-field.tsx`:

```tsx
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
          helperText={fieldState.error?.message ?? props.helperText}
        />
      )}
    />
  );
}
```

Expected: A reusable MUI text field wrapper exists for future forms.

- [ ] **Step 3: Export the forms library surface**

Set `libs/forms/src/index.ts` to:

```ts
export * from './lib/form-provider';
export * from './lib/form-text-field';
```

Expected: Consumers can import the shared form primitives from the library root.

- [ ] **Step 4: Commit the forms library**

Run:

```bash
git add libs/forms
git commit -m "feat: add form foundation"
```

Expected: Git creates a commit for the forms setup.
