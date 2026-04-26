import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { mapAuthErrorToMessage, signUpWithEmailPassword } from '@health-tracker/api';
import { AppFormProvider, FormTextField } from '@health-tracker/forms';

import { authCopy } from '../auth/auth-copy';
import { type SignUpFormValues, signUpSchema } from '../auth/auth-schemas';
import { AuthLayout } from '../components/auth-layout';

export function SignUpPage() {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit = async (values: SignUpFormValues) => {
    setSubmitError('');

    const { error } = await signUpWithEmailPassword(values.email, values.password);

    if (error) {
      setSubmitError(mapAuthErrorToMessage(error));
      return;
    }

    navigate('/');
  };

  return (
    <AuthLayout
      eyebrow={authCopy.signUp.eyebrow}
      title={authCopy.signUp.title}
      description={authCopy.signUp.description}
      footer={
        <Typography variant="body2" textAlign="center" color="text.secondary">
          {authCopy.signUp.switchPrompt}{' '}
          <Link component={RouterLink} to="/login" underline="hover">
            {authCopy.signUp.switchActionLabel}
          </Link>
        </Typography>
      }
    >
      <AppFormProvider form={form} onSubmit={handleSubmit}>
        <FormTextField
          autoComplete="email"
          autoFocus
          label={authCopy.signUp.emailLabel}
          name="email"
          placeholder="nguyenvana@email.com"
        />
        <Stack spacing={1}>
          <FormTextField
            autoComplete="new-password"
            label={authCopy.signUp.passwordLabel}
            name="password"
            placeholder="••••••••"
            type={isPasswordVisible ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={isPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    edge="end"
                    onClick={() => setIsPasswordVisible((value) => !value)}
                  >
                    {isPasswordVisible ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {authCopy.signUp.passwordRule}
          </Typography>
        </Stack>
        <FormTextField
          autoComplete="new-password"
          label={authCopy.signUp.confirmPasswordLabel}
          name="confirmPassword"
          placeholder="••••••••"
          type={isConfirmPasswordVisible ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={isConfirmPasswordVisible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  edge="end"
                  onClick={() => setIsConfirmPasswordVisible((value) => !value)}
                >
                  {isConfirmPasswordVisible ? (
                    <VisibilityOffRoundedIcon />
                  ) : (
                    <VisibilityRoundedIcon />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {submitError ? (
          <Alert color="error" variant="filled">
            {submitError}
          </Alert>
        ) : null}
        <Button disabled={isSubmitting} fullWidth type="submit" variant="contained">
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            {isSubmitting ? <CircularProgress color="inherit" size={18} /> : null}
            {isSubmitting ? authCopy.signUp.submitLoadingLabel : authCopy.signUp.submitLabel}
          </Box>
        </Button>
      </AppFormProvider>
    </AuthLayout>
  );
}
