import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { mapAuthErrorToMessage, signOutUser } from '@health-tracker/api';
import { AppCard, AppChip, AppShell, PageSection } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const [signOutError, setSignOutError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSignOutError('');
    setIsSigningOut(true);

    const { error } = await signOutUser();

    if (error) {
      setIsSigningOut(false);
      setSignOutError(mapAuthErrorToMessage(error));
      return;
    }

    navigate('/login');
  };

  return (
    <AppShell
      headerAction={
        <Button
          disabled={isSigningOut}
          onClick={handleSignOut}
          startIcon={<LogoutRoundedIcon />}
          variant="outlined"
        >
          {isSigningOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </Button>
      }
      headerEyebrow="Không gian riêng"
      headerSubtitle="Đây là đích tạm thời sau onboarding, trước khi dashboard thật được xây ở phase sau."
      headerTitle="Trang chủ tối giản"
      navValue="home"
    >
      <Stack spacing={2.5}>
        {signOutError ? (
          <Alert color="error" variant="filled">
            {signOutError}
          </Alert>
        ) : null}

        <PageSection
          eyebrow="Đăng nhập thành công"
          title={`Chào mừng${user?.email ? `, ${user.email}` : ''}`}
          description="Hiện tại Hoàng Thượng đã ở trong app shell. Phần dashboard đầy đủ sẽ được bổ sung sau khi onboarding hoàn tất."
        >
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <AppChip label="Phiên hoạt động" />
            <AppChip label={user?.email ?? 'Đã xác thực'} />
            <AppChip label="Trang chủ tạm thời" />
          </Stack>
        </PageSection>

        <AppCard sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Typography variant="overline">Bước tiếp theo</Typography>
            <Typography variant="h4">Dashboard thật sẽ thay thế bề mặt này ở phase sau</Typography>
            <Typography color="text.secondary">
              Tạm thời trang này chỉ chứng minh rằng session và route đã đi đúng nhánh sau khi
              onboarding được hoàn tất.
            </Typography>
          </Stack>
        </AppCard>
      </Stack>
    </AppShell>
  );
}
