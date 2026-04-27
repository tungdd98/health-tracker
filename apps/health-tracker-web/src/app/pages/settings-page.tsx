import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { ZodIssue } from 'zod';

import {
  mapAuthErrorToMessage,
  type OnboardingPhase,
  type OnboardingProfile,
  signOutUser,
  updateOnboardingCycleAndBody,
  updateOnboardingPersonalInfo,
} from '@health-tracker/api';
import { AppFormProvider, FormDateField, FormTextField } from '@health-tracker/forms';
import { AppShell } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';
import { SettingsSectionCard } from '../components/settings-section-card';
import { SignOutConfirmDialog } from '../components/sign-out-confirm-dialog';
import {
  normalizeOptionalIsoDate,
  normalizeOptionalText,
  toCycleAndBodyDefaults,
  toPersonalInfoDefaults,
} from '../profile/profile-mappers';
import {
  cycleAndBodySettingsSchema,
  personalInfoSettingsSchema,
} from '../settings/settings-schemas';
import type {
  CycleAndBodySettingsFormValues,
  PersonalInfoSettingsFormValues,
  SettingsSaveState,
} from '../settings/settings-types';

const ONBOARDING_PHASE_LABELS: Record<OnboardingPhase, string> = {
  'pre-pregnancy': 'Tiền thai kỳ',
};

const isSameOnboardingProfile = (current: OnboardingProfile, next: OnboardingProfile) =>
  current.selectedPhase === next.selectedPhase &&
  current.onboardingCompleted === next.onboardingCompleted &&
  current.onboardingCompletedAt === next.onboardingCompletedAt &&
  current.displayName === next.displayName &&
  current.birthDate === next.birthDate &&
  current.cycleLengthDays === next.cycleLengthDays &&
  current.lastPeriodStartDate === next.lastPeriodStartDate &&
  current.heightCm === next.heightCm &&
  current.weightKg === next.weightKg;

const mapZodIssuesToFields = <TValues extends Record<string, unknown>>(
  form: UseFormReturn<TValues>,
  issues: ZodIssue[],
) => {
  form.clearErrors();

  issues.forEach((issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === 'string') {
      form.setError(fieldName as keyof TValues, {
        type: 'manual',
        message: issue.message,
      });
    }
  });
};

type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
};

export function SettingsPage() {
  const navigate = useNavigate();
  const { onboardingProfile, user } = useAuthSession();

  const [profileSnapshot, setProfileSnapshot] = useState(onboardingProfile);

  const [personalInfoState, setPersonalInfoState] = useState<SettingsSaveState>('idle');

  const [cycleAndBodyState, setCycleAndBodyState] = useState<SettingsSaveState>('idle');

  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    setProfileSnapshot((current) =>
      isSameOnboardingProfile(current, onboardingProfile) ? current : onboardingProfile,
    );
  }, [onboardingProfile]);

  const personalInfoDefaults = useMemo(
    () => toPersonalInfoDefaults(profileSnapshot),
    [profileSnapshot],
  );
  const cycleAndBodyDefaults = useMemo(
    () => toCycleAndBodyDefaults(profileSnapshot),
    [profileSnapshot],
  );

  const personalInfoForm = useForm<PersonalInfoSettingsFormValues>({
    defaultValues: {
      displayName: personalInfoDefaults.displayName,
      birthDate: personalInfoDefaults.birthDate,
    },
    mode: 'onBlur',
  });

  const cycleAndBodyForm = useForm<CycleAndBodySettingsFormValues>({
    defaultValues: cycleAndBodyDefaults,
    mode: 'onBlur',
  });

  useEffect(() => {
    personalInfoForm.reset({
      displayName: personalInfoDefaults.displayName,
      birthDate: personalInfoDefaults.birthDate,
    });
  }, [personalInfoDefaults, personalInfoForm]);

  useEffect(() => {
    cycleAndBodyForm.reset(cycleAndBodyDefaults);
  }, [cycleAndBodyDefaults, cycleAndBodyForm]);

  const selectedPhaseLabel = profileSnapshot.selectedPhase
    ? ONBOARDING_PHASE_LABELS[profileSnapshot.selectedPhase]
    : 'Chưa thiết lập';
  const greetingName =
    profileSnapshot.displayName?.trim() || user?.email?.split('@')[0]?.trim() || 'bạn';

  const handleNavChange = (value: string) => {
    if (value === 'home') {
      navigate('/');
      return;
    }

    if (value === 'calendar') {
      navigate('/calendar');
      return;
    }

    if (value === 'settings') {
      navigate('/settings');
    }
  };

  const handleSavePersonalInfo = async (values: PersonalInfoSettingsFormValues) => {
    if (!user) {
      return;
    }

    const result = personalInfoSettingsSchema.safeParse(values);

    if (!result.success) {
      mapZodIssuesToFields(personalInfoForm, result.error.issues);
      return;
    }

    setPersonalInfoState('saving');

    const patch = {
      displayName: normalizeOptionalText(result.data.displayName) ?? null,
      birthDate: normalizeOptionalIsoDate(result.data.birthDate) ?? null,
    };

    const { error } = await updateOnboardingPersonalInfo(user, patch);

    if (error) {
      setPersonalInfoState('error');
      const message = mapAuthErrorToMessage(error);
      setSnackbarState({
        open: true,
        message,
        severity: 'error',
      });
      return;
    }

    setProfileSnapshot((current) => ({
      ...current,
      displayName: patch.displayName,
      birthDate: patch.birthDate,
    }));
    setPersonalInfoState('success');
    const message = 'Đã lưu thông tin cá nhân.';
    setSnackbarState({
      open: true,
      message,
      severity: 'success',
    });
  };

  const handleSaveCycleAndBody = async (values: CycleAndBodySettingsFormValues) => {
    if (!user) {
      return;
    }

    const result = cycleAndBodySettingsSchema.safeParse(values);

    if (!result.success) {
      mapZodIssuesToFields(cycleAndBodyForm, result.error.issues);
      return;
    }

    setCycleAndBodyState('saving');

    const patch = {
      cycleLengthDays: result.data.cycleLengthDays ?? null,
      lastPeriodStartDate: normalizeOptionalIsoDate(result.data.lastPeriodStartDate) ?? null,
      heightCm: result.data.heightCm ?? null,
      weightKg: result.data.weightKg ?? null,
    };

    const { error } = await updateOnboardingCycleAndBody(user, patch);

    if (error) {
      setCycleAndBodyState('error');
      const message = mapAuthErrorToMessage(error);
      setSnackbarState({
        open: true,
        message,
        severity: 'error',
      });
      return;
    }

    setProfileSnapshot((current) => ({
      ...current,
      cycleLengthDays: patch.cycleLengthDays,
      lastPeriodStartDate: patch.lastPeriodStartDate,
      heightCm: patch.heightCm,
      weightKg: patch.weightKg,
    }));
    setCycleAndBodyState('success');
    const message = 'Đã lưu chu kỳ và cơ thể.';
    setSnackbarState({
      open: true,
      message,
      severity: 'success',
    });
  };

  const handleOpenSignOutDialog = () => {
    setSignOutError('');
    setIsSignOutDialogOpen(true);
  };

  const handleCloseSignOutDialog = () => {
    if (isSigningOut) {
      return;
    }

    setIsSignOutDialogOpen(false);
  };

  const handleConfirmSignOut = async () => {
    setSignOutError('');
    setIsSigningOut(true);

    const { error } = await signOutUser();

    if (error) {
      setIsSigningOut(false);
      setSignOutError(mapAuthErrorToMessage(error));
      return;
    }

    navigate('/login', { replace: true });
  };

  const isSavingPersonalInfo = personalInfoState === 'saving';
  const isSavingCycleAndBody = cycleAndBodyState === 'saving';
  const handleCloseSnackbar = (_event?: Event | SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarState((current) => ({
      ...current,
      open: false,
    }));
  };

  return (
    <AppShell
      headerSubtitle="Cài đặt"
      headerSubtitleFontWeight={600}
      headerTitle={`Hello ${greetingName}`}
      navValue="settings"
      onNavChange={handleNavChange}
    >
      <Stack spacing={2.5}>
        <SettingsSectionCard title="Thông tin cá nhân">
          <AppFormProvider form={personalInfoForm} onSubmit={handleSavePersonalInfo}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  InputProps={{ readOnly: true }}
                  label="Giai đoạn hiện tại"
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  value={selectedPhaseLabel}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  helperText="Không bắt buộc"
                  label="Tên"
                  name="displayName"
                  placeholder="Ví dụ: Lan Anh"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormDateField label="Ngày sinh" name="birthDate" />
              </Grid>
            </Grid>
            <Button disabled={isSavingPersonalInfo} type="submit" variant="contained">
              <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
                {isSavingPersonalInfo ? <CircularProgress color="inherit" size={18} /> : null}
                {isSavingPersonalInfo ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Box>
            </Button>
          </AppFormProvider>
        </SettingsSectionCard>

        <SettingsSectionCard title="Chu kỳ & cơ thể">
          <AppFormProvider form={cycleAndBodyForm} onSubmit={handleSaveCycleAndBody}>
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
                <FormDateField label="Ngày bắt đầu kỳ gần nhất" name="lastPeriodStartDate" />
              </Grid>
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
            <Button disabled={isSavingCycleAndBody} type="submit" variant="contained">
              <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
                {isSavingCycleAndBody ? <CircularProgress color="inherit" size={18} /> : null}
                {isSavingCycleAndBody ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Box>
            </Button>
          </AppFormProvider>
        </SettingsSectionCard>

        <SettingsSectionCard title="Tài khoản">
          <Button
            color="error"
            disabled={isSigningOut}
            onClick={handleOpenSignOutDialog}
            startIcon={<LogoutRoundedIcon />}
            variant="contained"
          >
            Đăng xuất
          </Button>
        </SettingsSectionCard>
      </Stack>

      <SignOutConfirmDialog
        errorMessage={signOutError}
        isSubmitting={isSigningOut}
        onCancel={handleCloseSignOutDialog}
        onConfirm={handleConfirmSignOut}
        open={isSignOutDialogOpen}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3200}
        onClose={handleCloseSnackbar}
        open={snackbarState.open}
      >
        <Alert
          color={snackbarState.severity}
          onClose={handleCloseSnackbar}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>
    </AppShell>
  );
}
