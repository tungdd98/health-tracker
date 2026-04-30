import { Grid } from '@mui/material';

import { FormDateField, FormTextField } from '@health-tracker/forms';

type BasicProfileStepProps = Record<string, never>;

export function BasicProfileStep(_: BasicProfileStepProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <FormTextField label="Tên hiển thị" name="displayName" placeholder="Ví dụ: Lan Anh" />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormDateField label="Ngày sinh" name="birthDate" />
      </Grid>
    </Grid>
  );
}
