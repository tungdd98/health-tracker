import { Grid, Stack, Typography } from '@mui/material';

import { FormDateField, FormTextField } from '@health-tracker/forms';

export function CycleStep() {
  return (
    <Stack spacing={1.5}>
      <Typography color="text.secondary">
        Nếu chưa sẵn sàng, bạn có thể bỏ qua và cập nhật lại sau trong phần cài đặt.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormTextField
            inputMode="numeric"
            label="Độ dài chu kỳ"
            name="cycleLengthDays"
            placeholder="28"
            type="number"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormDateField label="Ngày bắt đầu kỳ kinh gần nhất" name="lastPeriodStartDate" />
        </Grid>
      </Grid>
    </Stack>
  );
}
