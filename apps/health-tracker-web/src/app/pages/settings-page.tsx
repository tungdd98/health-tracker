import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import {
  Alert,
  Avatar,
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Snackbar,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';
import { useForm, type Path, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { ZodIssue } from 'zod';

import {
  generateMoodImages,
  getAvatarMeta,
  mapAuthErrorToMessage,
  type OnboardingPhase,
  type OnboardingProfile,
  signOutUser,
  updateAvatarMeta,
  updateOnboardingProfile,
  updateOnboardingCycleAndBody,
  uploadAvatar,
  type UserAvatarMeta,
} from '@health-tracker/api';
import { AppFormProvider, FormDateField, FormTextField } from '@health-tracker/forms';
import { AppShell, AppSubmitButton } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';
import { AppConfirmDialog } from '../components/app-confirm-dialog';
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
import { useAppNavChange } from '../use-app-nav-change';

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
  current.weightKg === next.weightKg &&
  current.emergencyContactName === next.emergencyContactName &&
  current.emergencyContactPhone === next.emergencyContactPhone &&
  current.hasSeenChatDisclaimer === next.hasSeenChatDisclaimer;

const mapZodIssuesToFields = <TValues extends Record<string, unknown>>(
  form: UseFormReturn<TValues>,
  issues: ZodIssue[],
) => {
  form.clearErrors();

  issues.forEach((issue) => {
    const fieldName = issue.path[0];

    if (typeof fieldName === 'string') {
      form.setError(fieldName as Path<TValues>, {
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
  const handleNavChange = useAppNavChange();

  const [profileSnapshot, setProfileSnapshot] = useState(onboardingProfile);

  const [personalInfoState, setPersonalInfoState] = useState<SettingsSaveState>('idle');

  const [cycleAndBodyState, setCycleAndBodyState] = useState<SettingsSaveState>('idle');

  const [avatarMeta, setAvatarMeta] = useState<UserAvatarMeta | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!user) return;
    void getAvatarMeta(user.id)
      .then(setAvatarMeta)
      .catch(() => null);
  }, [user]);

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
      emergencyContactName: personalInfoDefaults.emergencyContactName,
      emergencyContactPhone: personalInfoDefaults.emergencyContactPhone,
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
      emergencyContactName: personalInfoDefaults.emergencyContactName,
      emergencyContactPhone: personalInfoDefaults.emergencyContactPhone,
    });
  }, [personalInfoDefaults, personalInfoForm]);

  useEffect(() => {
    cycleAndBodyForm.reset(cycleAndBodyDefaults);
  }, [cycleAndBodyDefaults, cycleAndBodyForm]);

  const selectedPhaseLabel = profileSnapshot.selectedPhase
    ? ONBOARDING_PHASE_LABELS[profileSnapshot.selectedPhase]
    : 'Chưa thiết lập';

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !user) return;
    try {
      const url = await uploadAvatar(user.id, file);
      await updateAvatarMeta(user.id, { avatarUrl: url });
      setAvatarMeta((current) => ({ ...(current ?? { useAvatarMood: true }), avatarUrl: url }));
      setShowRegenerateDialog(true);
    } catch {
      setSnackbarState({ open: true, message: 'Không thể tải ảnh lên.', severity: 'error' });
    }
  };

  const handleRegenerateConfirm = async () => {
    if (!user) return;
    setIsRegenerating(true);
    setShowRegenerateDialog(false);
    try {
      await generateMoodImages(user.id);
      setSnackbarState({
        open: true,
        message: 'Đã tạo sticker mới từ avatar của bạn!',
        severity: 'success',
      });
    } catch {
      setSnackbarState({
        open: true,
        message: 'Không thể tạo sticker. Vui lòng thử lại.',
        severity: 'error',
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleToggleUseAvatarMood = async (checked: boolean) => {
    if (!user) return;
    setAvatarMeta((current) => (current ? { ...current, useAvatarMood: checked } : null));
    try {
      await updateAvatarMeta(user.id, { useAvatarMood: checked });
    } catch {
      setAvatarMeta((current) => (current ? { ...current, useAvatarMood: !checked } : null));
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
      emergencyContactName: normalizeOptionalText(result.data.emergencyContactName) ?? null,
      emergencyContactPhone: normalizeOptionalText(result.data.emergencyContactPhone) ?? null,
    };

    const { error } = await updateOnboardingProfile(user, patch);

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
      emergencyContactName: patch.emergencyContactName,
      emergencyContactPhone: patch.emergencyContactPhone,
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
      headerEyebrow="Tài khoản"
      headerSubtitle="Quản lý thông tin của bạn"
      headerTitle="Cài đặt"
      navValue="settings"
      onNavChange={handleNavChange}
    >
      <Stack spacing={2.5}>
        <SettingsSectionCard title="Thông tin cá nhân">
          <Stack alignItems="center" direction="row" spacing={2} sx={{ mb: 1 }}>
            <Box sx={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
              <Avatar
                src={avatarMeta?.avatarUrl ?? undefined}
                sx={(theme) => ({
                  width: 60,
                  height: 60,
                  bgcolor: theme.palette.surface.subtle,
                  color: 'text.secondary',
                })}
              >
                {!avatarMeta?.avatarUrl && <AddAPhotoRoundedIcon />}
              </Avatar>
              <IconButton
                aria-label="Thay ảnh đại diện"
                onClick={() => avatarFileInputRef.current?.click()}
                size="small"
                sx={(theme) => ({
                  bgcolor: 'primary.main',
                  bottom: 0,
                  color: 'primary.contrastText',
                  position: 'absolute',
                  right: 0,
                  '&:hover': { bgcolor: 'primary.dark' },
                  width: 24,
                  height: 24,
                  border: `2px solid ${theme.palette.background.default}`,
                })}
              >
                <AddAPhotoRoundedIcon sx={{ fontSize: 12 }} />
              </IconButton>
              <input
                accept="image/*"
                onChange={(e) => void handleAvatarFileChange(e)}
                ref={avatarFileInputRef}
                style={{ display: 'none' }}
                type="file"
              />
            </Box>
            <Stack spacing={0.5}>
              <Typography color="text.secondary" variant="body2">
                Thay ảnh đại diện
              </Typography>
              {avatarMeta?.avatarUrl ? (
                <Button
                  disabled={isRegenerating}
                  onClick={() => void handleRegenerateConfirm()}
                  size="small"
                  variant="text"
                >
                  {isRegenerating ? 'Đang tạo...' : 'Tạo lại sticker'}
                </Button>
              ) : null}
            </Stack>
          </Stack>
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
                <FormTextField label="Tên" name="displayName" placeholder="Ví dụ: Lan Anh" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormDateField label="Ngày sinh" name="birthDate" />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  label="Tên người liên hệ khẩn cấp"
                  name="emergencyContactName"
                  placeholder="Ví dụ: Mẹ"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormTextField
                  inputMode="tel"
                  label="Số điện thoại khẩn cấp"
                  name="emergencyContactPhone"
                  placeholder="Ví dụ: 0901234567"
                />
              </Grid>
            </Grid>
            {avatarMeta?.avatarUrl ? (
              <FormControlLabel
                control={
                  <Switch
                    checked={avatarMeta.useAvatarMood}
                    onChange={(e) => void handleToggleUseAvatarMood(e.target.checked)}
                  />
                }
                label="Dùng sticker avatar cho tâm trạng"
              />
            ) : null}
            <AppSubmitButton
              disabled={isSavingPersonalInfo}
              loading={isSavingPersonalInfo}
              type="submit"
              variant="contained"
            >
              Lưu thay đổi
            </AppSubmitButton>
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
            <AppSubmitButton
              disabled={isSavingCycleAndBody}
              loading={isSavingCycleAndBody}
              type="submit"
              variant="contained"
            >
              Lưu thay đổi
            </AppSubmitButton>
          </AppFormProvider>
        </SettingsSectionCard>

        <SettingsSectionCard title="Tài khoản">
          <Button
            color="error"
            disabled={isSigningOut}
            onClick={handleOpenSignOutDialog}
            startIcon={<LogoutRoundedIcon />}
            variant="outlined"
          >
            Đăng xuất
          </Button>
        </SettingsSectionCard>
      </Stack>

      <AppConfirmDialog
        confirmLabel={isRegenerating ? 'Đang tạo...' : 'Tạo sticker'}
        description="Bạn có muốn tạo sticker tâm trạng mới từ avatar vừa tải lên không?"
        isSubmitting={isRegenerating}
        onCancel={() => setShowRegenerateDialog(false)}
        onConfirm={() => void handleRegenerateConfirm()}
        open={showRegenerateDialog}
        title="Tạo sticker mới?"
      />
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
