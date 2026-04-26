import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { Button, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { AppCard, AppChip, AppShell, PageSection } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuthSession();

  const handleNavChange = (value: string) => {
    if (value === 'settings') {
      navigate('/settings');
      return;
    }

    if (value === 'home') {
      navigate('/');
    }
  };

  return (
    <AppShell
      headerEyebrow="Không gian riêng"
      headerSubtitle="Đây là đích tạm thời sau onboarding, trước khi dashboard thật được xây ở phase sau."
      headerTitle="Trang chủ tối giản"
      onNavChange={handleNavChange}
      navValue="home"
    >
      <Stack spacing={2.5}>
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
            <Button
              onClick={() => navigate('/settings')}
              startIcon={<TuneRoundedIcon />}
              sx={{ alignSelf: 'flex-start', mt: 1 }}
              variant="outlined"
            >
              Mở cài đặt
            </Button>
          </Stack>
        </AppCard>
      </Stack>
    </AppShell>
  );
}
