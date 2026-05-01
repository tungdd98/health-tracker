import { Alert, Box, Button, ButtonBase, Skeleton, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useTodayMedications } from '../medications/use-today-medications';
import {
  CheckBoxOutlineBlankRounded,
  CheckBoxRounded,
  KeyboardArrowRightRounded,
  MedicationRounded,
} from '@mui/icons-material';

type MedicationStripProps = {
  userId: string;
  date: string;
};

export function MedicationStrip({ userId, date }: MedicationStripProps) {
  const navigate = useNavigate();
  const {
    error,
    isLoading,
    isToggling,
    logDose,
    resetError,
    takenCount,
    todayDoses,
    totalCount,
    unlogDose,
  } = useTodayMedications(userId, date);

  const handleToggleDose = async (doseId: string, taken: boolean) => {
    resetError();

    if (taken) {
      await unlogDose(doseId);
      return;
    }

    await logDose(doseId);
  };

  if (isLoading) {
    return (
      <Skeleton
        height={180}
        sx={(theme) => ({ borderRadius: theme.appTokens.radius.xl })}
        variant="rounded"
      />
    );
  }

  if (totalCount === 0) {
    return (
      <Stack
        alignItems="center"
        spacing={1.5}
        sx={(theme) => ({
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: theme.appTokens.radius.xl,
          px: 2.5,
          py: 3,
        })}
      >
        <MedicationRounded color="action" sx={{ fontSize: 34 }} />
        <Typography
          color="text.secondary"
          sx={(theme) => theme.appTokens.typography.sectionValue}
          textAlign="center"
        >
          Chưa có thuốc nào hôm nay
        </Typography>

        <Button
          endIcon={<KeyboardArrowRightRounded fontSize="small" />}
          onClick={() => navigate('/medications')}
          variant="text"
        >
          Quản lý thuốc
        </Button>
      </Stack>
    );
  }

  return (
    <Stack
      spacing={1.5}
      sx={(theme) => ({
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: theme.appTokens.radius.xl,
        px: 2.5,
        py: 2.5,
      })}
    >
      <Stack alignItems="center" direction="row" justifyContent="space-between">
        <Typography fontWeight={700}>Thuốc hôm nay</Typography>
        <Box
          sx={(theme) => ({
            backgroundColor: theme.palette.surface.canvas,
            borderRadius: theme.appTokens.radius.pill,
            px: 1.25,
            py: 0.5,
          })}
        >
          <Typography
            color="text.secondary"
            sx={(theme) => theme.appTokens.typography.sectionValue}
          >
            {takenCount}/{totalCount} đã uống
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={0.5}>
        {todayDoses.map((dose) => (
          <ButtonBase
            disabled={isToggling}
            key={`${dose.doseId}-${dose.timeOfDay}`}
            onClick={() => {
              void handleToggleDose(dose.doseId, dose.taken);
            }}
            sx={(theme) => ({
              alignItems: 'flex-start',
              borderRadius: theme.appTokens.radius.xs,
              justifyContent: 'flex-start',
              opacity: dose.taken ? 1 : 0.55,
              px: 0.25,
              py: 1,
              textAlign: 'left',
            })}
          >
            <Stack alignItems="flex-start" direction="row" spacing={1.25} width="100%">
              <Box
                sx={{
                  color: dose.taken ? 'primary.main' : 'text.secondary',
                  lineHeight: 0,
                  mt: 0.2,
                }}
              >
                {dose.taken ? <CheckBoxRounded /> : <CheckBoxOutlineBlankRounded />}
              </Box>
              <Stack spacing={0.25} width="100%">
                <Typography
                  sx={(theme) => ({
                    ...theme.appTokens.typography.sectionValue,
                    color: theme.palette.text.primary,
                  })}
                >
                  {dose.timeOfDay} {dose.medicationName}
                  {dose.dosage ? ` · ${dose.dosage}` : ''}
                </Typography>

                {dose.notes ? (
                  <Typography
                    color="text.secondary"
                    sx={(theme) => theme.appTokens.typography.helper}
                  >
                    {dose.notes}
                  </Typography>
                ) : null}
              </Stack>
            </Stack>
          </ButtonBase>
        ))}
      </Stack>

      <ButtonBase
        onClick={() => navigate('/medications')}
        sx={(theme) => ({
          alignItems: 'center',
          borderRadius: theme.appTokens.radius.pill,
          color: 'primary.main',
          display: 'inline-flex',
          gap: 0.25,
          justifyContent: 'center',
          px: 1,
          py: 0.5,
          width: '100%',
        })}
      >
        <Typography sx={(theme) => theme.appTokens.typography.sectionValue}>
          Quản lý thuốc
        </Typography>
        <KeyboardArrowRightRounded fontSize="small" />
      </ButtonBase>

      {error ? (
        <Alert severity="error" variant="outlined">
          Không thể lưu, thử lại.
        </Alert>
      ) : null}
    </Stack>
  );
}
