import { Grid, Stack } from '@mui/material';

import { FormDateField, FormTextField } from '@health-tracker/forms';

export function BasicProfileStep() {
  return (
    <Stack spacing={1.5}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormTextField label="Tên hiển thị" name="displayName" placeholder="Ví dụ: Lan Anh" />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormDateField label="Ngày sinh" name="birthDate" />
        </Grid>
      </Grid>
    </Stack>
  );
}
