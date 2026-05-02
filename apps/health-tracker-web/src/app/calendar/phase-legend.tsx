import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import type { CyclePhase } from '../dashboard/cycle-utils';

const PHASES: CyclePhase[] = ['menstrual', 'follicular', 'fertile', 'luteal'];

const PHASE_LEGEND_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Kỳ kinh',
  follicular: 'Tiền rụng trứng',
  fertile: 'Cửa sổ thụ thai',
  luteal: 'Hoàng thể',
};

export function PhaseLegend() {
  const theme = useTheme();

  return (
    <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="space-between" px={0.5}>
      {PHASES.map((phase) => (
        <Stack alignItems="center" direction="row" gap={0.75} key={phase}>
          <Box
            sx={{
              bgcolor: theme.palette.phase[phase],
              borderRadius: '50%',
              height: 10,
              width: 10,
            }}
          />
          <Typography color="text.secondary" variant="caption">
            {PHASE_LEGEND_LABELS[phase]}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
