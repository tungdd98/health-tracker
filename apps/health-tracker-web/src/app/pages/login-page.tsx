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
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { mapAuthErrorToMessage, signInWithEmailPassword } from '@health-tracker/api';
import { AppFormProvider, FormTextField } from '@health-tracker/forms';

import { authCopy } from '../auth/auth-copy';
import { type LoginFormValues, loginSchema } from '../auth/auth-schemas';
import { AuthLayout } from '../components/auth-layout';

export function LoginPage() {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const email = form.watch('email');
  const password = form.watch('password');

  useEffect(() => {
    if (submitError) {
      setSubmitError('');
    }
  }, [email, password, submitError]);

  const handleSubmit = async (values: LoginFormValues) => {
    setSubmitError('');

    const { error } = await signInWithEmailPassword(values.email, values.password);

    if (error) {
      setSubmitError(mapAuthErrorToMessage(error));
      return;
    }

    navigate('/', { replace: true });
  };

  return (
    <AuthLayout
      eyebrow={authCopy.login.eyebrow}
      title={authCopy.login.title}
      description={authCopy.login.description}
      footer={
        <Typography variant="body2" textAlign="center" color="text.secondary">
          {authCopy.login.switchPrompt}{' '}
          <Link component={RouterLink} to="/signup" underline="hover" sx={{ fontWeight: 600 }}>
            {authCopy.login.switchActionLabel}
          </Link>
        </Typography>
      }
    >
      <AppFormProvider form={form} onSubmit={handleSubmit}>
        <FormTextField
          autoComplete="email"
          autoFocus
          label={authCopy.login.emailLabel}
          name="email"
          placeholder="nguyenvana@email.com"
        />
        <FormTextField
          autoComplete="current-password"
          label={authCopy.login.passwordLabel}
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
        {submitError ? (
          <Alert color="error" variant="filled">
            {submitError}
          </Alert>
        ) : null}
        <Button disabled={isSubmitting} fullWidth type="submit" variant="contained">
          <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            {isSubmitting ? <CircularProgress color="inherit" size={18} /> : null}
            {isSubmitting ? authCopy.login.submitLoadingLabel : authCopy.login.submitLabel}
          </Box>
        </Button>
      </AppFormProvider>
    </AuthLayout>
  );
}
