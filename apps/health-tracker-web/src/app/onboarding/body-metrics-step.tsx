import { Grid, Stack, Typography } from '@mui/material';

import { FormTextField } from '@health-tracker/forms';

export function BodyMetricsStep() {
  return (
    <Stack spacing={1.5}>
      <Typography color="text.secondary">
        Dữ liệu cơ thể giúp app có bối cảnh nền cho các tính năng sức khỏe ở phase sau.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            inputMode="decimal"
            label="Chiều cao (cm)"
            name="heightCm"
            placeholder="160"
            type="number"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            inputMode="decimal"
            label="Cân nặng (kg)"
            name="weightKg"
            placeholder="52"
            type="number"
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
