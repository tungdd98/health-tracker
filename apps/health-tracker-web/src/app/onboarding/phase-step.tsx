import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { alpha } from '@mui/material/styles';
import { Box, ButtonBase, Chip, Stack, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField } from '@health-tracker/forms';
import { AppCard } from '@health-tracker/ui';

import { type OnboardingPhaseStepValues, type OnboardingPhaseOption } from './onboarding-types';

const PHASE_OPTIONS: OnboardingPhaseOption[] = [
  {
    phase: 'pre-pregnancy',
    label: 'Preparing for pregnancy',
    description: 'Bộ công cụ dành cho người đang chuẩn bị có em bé.',
    helperLabel: 'Đang mở',
  },
  {
    label: 'Currently pregnant',
    description: 'Nhánh này sẽ được mở ở phase sau.',
    disabled: true,
    helperLabel: 'Coming soon',
  },
];

type PhaseOptionCardProps = OnboardingPhaseOption & {
  selected?: boolean;
  onClick?: () => void;
};

function PhaseOptionCard({
  description,
  disabled,
  helperLabel,
  label,
  onClick,
  selected,
}: PhaseOptionCardProps) {
  return (
    <ButtonBase
      disabled={disabled}
      onClick={onClick}
      sx={{
        borderRadius: 4,
        display: 'block',
        textAlign: 'left',
        width: '100%',
      }}
    >
      <AppCard
        sx={(theme) => ({
          p: 2.25,
          border: `1px solid ${selected ? theme.palette.primary.main : alpha(theme.palette.divider, 0.72)}`,
          backgroundColor: selected
            ? alpha(theme.palette.primary.light, 0.24)
            : alpha(theme.palette.background.paper, 0.9),
          boxShadow: selected ? `0 14px 30px ${alpha(theme.palette.primary.main, 0.12)}` : 'none',
          opacity: disabled ? 0.72 : 1,
          transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
            duration: theme.transitions.duration.short,
          }),
        })}
      >
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
            <Box>
              <Typography variant="subtitle1">{label}</Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                {description}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              {helperLabel ? <Chip label={helperLabel} size="small" /> : null}
              {!disabled ? <ChevronRightRoundedIcon color="primary" fontSize="small" /> : null}
            </Stack>
          </Stack>
        </Stack>
      </AppCard>
    </ButtonBase>
  );
}

export function PhaseStep() {
  const { control } = useFormContext<OnboardingPhaseStepValues>();

  return (
    <Controller
      control={control}
      name="selectedPhase"
      render={({ field, fieldState }) => (
        <FormField
          error={fieldState.error?.message}
          label="Chọn giai đoạn phù hợp"
          helperText="Hoàng Thượng cần chọn một nhánh để tiếp tục qua các bước còn lại."
        >
          <Stack spacing={1.5}>
            {PHASE_OPTIONS.map((option) => (
              <PhaseOptionCard
                {...option}
                key={option.label}
                selected={field.value === option.phase}
                onClick={option.disabled ? undefined : () => field.onChange(option.phase ?? null)}
              />
            ))}
          </Stack>
        </FormField>
      )}
    />
  );
}
