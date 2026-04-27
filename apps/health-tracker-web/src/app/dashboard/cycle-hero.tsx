import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import OpacityRoundedIcon from '@mui/icons-material/OpacityRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { Alert, Box, Button, Skeleton, Stack, Typography, alpha, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { AppCard } from '@health-tracker/ui';

import type { CycleHeroMode } from './cycle-hero-modes';
import { PHASE_BADGE_LABELS, PHASE_LABELS, type CycleSnapshot } from './cycle-utils';

const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};

const describeArc = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;

  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
};

const getCountdownLine = (snapshot: CycleSnapshot): string => {
  if (snapshot.isFertileWindow && snapshot.daysUntilFertileEnd !== null) {
    return `Cửa sổ thụ thai kết thúc · còn ${snapshot.daysUntilFertileEnd} ngày`;
  }

  if (snapshot.daysUntilFertileStart !== null) {
    return `Cửa sổ thụ thai bắt đầu · còn ${snapshot.daysUntilFertileStart} ngày`;
  }

  return `Kỳ kinh tiếp · còn ${snapshot.daysUntilNextPeriod} ngày`;
};

type CycleRingProps = {
  snapshot: CycleSnapshot;
};

function CycleRing({ snapshot }: CycleRingProps) {
  const theme = useTheme();
  const phaseColors = theme.palette.phase;
  const cycleLength = snapshot.dayOfCycle + snapshot.daysUntilNextPeriod - 1;
  const ovulationDay = cycleLength - 14;
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;
  const menstrualEndDeg = (5 / cycleLength) * 360;
  const fertileStartDeg = ((fertileStart - 1) / cycleLength) * 360;
  const fertileEndDeg = (fertileEnd / cycleLength) * 360;
  const markerDeg = ((snapshot.dayOfCycle - 1) / cycleLength) * 360;
  const marker = polarToCartesian(100, 100, 80, markerDeg);
  const markerColor = phaseColors[snapshot.phase];

  return (
    <svg height={200} viewBox="0 0 200 200" width={200}>
      <circle
        cx={100}
        cy={100}
        fill="none"
        r={80}
        stroke={alpha(theme.palette.text.secondary, 0.16)}
        strokeWidth={14}
      />
      <path
        d={describeArc(100, 100, 80, 0, menstrualEndDeg)}
        fill="none"
        stroke={phaseColors.menstrual}
        strokeLinecap="round"
        strokeWidth={14}
      />
      <path
        d={describeArc(100, 100, 80, fertileStartDeg, fertileEndDeg)}
        fill="none"
        stroke={phaseColors.fertile}
        strokeLinecap="round"
        strokeWidth={14}
      />
      <circle
        cx={marker.x}
        cy={marker.y}
        fill={markerColor}
        r={10}
        stroke={theme.palette.background.paper}
        strokeWidth={3}
      />
      <text
        fill={markerColor}
        fontFamily={theme.typography.fontFamily}
        fontSize={10}
        fontWeight={700}
        letterSpacing={1.2}
        textAnchor="middle"
        x={100}
        y={82}
      >
        {PHASE_BADGE_LABELS[snapshot.phase]}
      </text>
      <text
        fill={theme.palette.text.primary}
        fontFamily={theme.typography.fontFamily}
        fontSize={20}
        fontWeight={700}
        textAnchor="middle"
        x={100}
        y={108}
      >
        {`Ngày ${snapshot.dayOfCycle} / ${cycleLength}`}
      </text>
      <text
        fill={theme.palette.text.secondary}
        fontFamily={theme.typography.fontFamily}
        fontSize={12}
        textAnchor="middle"
        x={100}
        y={128}
      >
        {PHASE_LABELS[snapshot.phase]}
      </text>
    </svg>
  );
}

type CycleHeroProps = {
  mode: CycleHeroMode;
  snapshot: CycleSnapshot | null;
  isLoading: boolean;
  onLogPeriod: () => void;
};

export function CycleHero({ mode, snapshot, isLoading, onLogPeriod }: CycleHeroProps) {
  const navigate = useNavigate();
  const theme = useTheme();

  if (isLoading) {
    return (
      <AppCard
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
          p: 3,
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <Skeleton height={200} variant="circular" width={200} />
          <Skeleton height={16} variant="rounded" width={200} />
        </Stack>
      </AppCard>
    );
  }

  if (mode === 'nudge' || snapshot === null) {
    return (
      <AppCard
        sx={{
          border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
          p: 4,
        }}
      >
        <Stack alignItems="center" spacing={2} textAlign="center">
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: alpha(theme.palette.primary.light, 0.7),
              borderRadius: 999,
              display: 'flex',
              height: 64,
              justifyContent: 'center',
              width: 64,
            }}
          >
            <CalendarTodayRoundedIcon color="primary" />
          </Box>
          <Stack spacing={1} sx={{ maxWidth: 280 }}>
            <Typography variant="h5">Bổ sung thông tin chu kỳ để xem dự đoán hôm nay</Typography>
            <Typography color="text.secondary" variant="body2">
              Chúng tôi cần ngày bắt đầu kỳ kinh gần nhất và độ dài chu kỳ trung bình của Hoàng
              Thượng để gợi ý cửa sổ thụ thai.
            </Typography>
          </Stack>
          <Button
            onClick={() => navigate('/settings')}
            startIcon={<SettingsRoundedIcon />}
            variant="contained"
          >
            Mở cài đặt
          </Button>
        </Stack>
      </AppCard>
    );
  }

  const countdownLine = getCountdownLine(snapshot);
  const highlightColor = theme.palette.phase[snapshot.phase];
  const showLogCta = mode === 'overdue' || mode === 'stale';

  return (
    <AppCard
      sx={{
        border: `1px solid ${alpha(theme.palette.divider, 0.9)}`,
        overflow: 'hidden',
        p: 3,
      }}
    >
      {mode === 'stale' ? (
        <Alert
          severity="warning"
          sx={{
            mb: 2,
          }}
        >
          Dữ liệu chu kỳ có vẻ cũ. Hãy cập nhật để dự đoán chính xác hơn.
        </Alert>
      ) : null}

      <Stack alignItems="center" spacing={2}>
        <CycleRing snapshot={snapshot} />

        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
          sx={{
            bgcolor: alpha(highlightColor, 0.12),
            borderRadius: 999,
            px: 1.75,
            py: 1,
          }}
        >
          <OpacityRoundedIcon sx={{ color: highlightColor, fontSize: 14 }} />
          <Typography color="text.primary" variant="caption">
            {countdownLine}
          </Typography>
        </Stack>

        {showLogCta ? (
          <Button
            fullWidth
            onClick={onLogPeriod}
            startIcon={<OpacityRoundedIcon />}
            sx={{
              borderWidth: 1.5,
              maxWidth: 280,
            }}
            variant="outlined"
          >
            Đánh dấu kỳ kinh mới hôm nay
          </Button>
        ) : null}
      </Stack>
    </AppCard>
  );
}
