import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { ButtonBase, Chip, Stack, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import { FormField } from '@health-tracker/forms';
import { AppCard } from '@health-tracker/ui';

import { type OnboardingPhaseStepValues, type OnboardingPhaseOption } from './onboarding-types';

const PHASE_OPTIONS: OnboardingPhaseOption[] = [
  {
    phase: 'pre-pregnancy',
    label: 'Chuẩn bị có em bé',
    description: 'Lộ trình dành cho giai đoạn chuẩn bị mang thai.',
  },
  {
    label: 'Đang có em bé',
    description: 'Mục này sẽ sớm được mở trong bản cập nhật tiếp theo.',
    disabled: true,
    helperLabel: 'Sắp ra mắt',
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
      sx={(theme) => ({
        borderRadius: theme.appTokens.radius.xl,
        display: 'block',
        textAlign: 'left',
        width: '100%',
      })}
    >
      <AppCard
        sx={(theme) => ({
          backgroundColor: selected ? theme.palette.surface.selected : theme.palette.surface.raised,
          border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
          boxShadow: selected ? theme.appTokens.shadow.floating : 'none',
          opacity: disabled ? 0.72 : 1,
          p: 2.25,
          transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow'], {
            duration: theme.transitions.duration.short,
          }),
        })}
      >
        <Stack spacing={1.25}>
          <Stack alignItems="flex-start" direction="row" gap={1} justifyContent="space-between">
            <Stack spacing={0.5}>
              <Typography variant="subtitle1">{label}</Typography>
              <Typography color="text.secondary" variant="body2">
                {description}
              </Typography>
            </Stack>
            <Stack alignItems="center" direction="row" spacing={1}>
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
        <FormField error={fieldState.error?.message} label="Giai đoạn phù hợp">
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
