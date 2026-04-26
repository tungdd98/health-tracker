import { Stack, Typography } from '@mui/material';

import { AppChip, AppShell, PageSection } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';

export function OnboardingPage() {
  const { hasSelectedOnboardingPhase, onboardingProfile, user } = useAuthSession();

  return (
    <AppShell
      headerEyebrow="Thiết lập ban đầu"
      headerSubtitle="Route onboarding đã sẵn sàng cho flow nhiều bước ở task tiếp theo."
      headerTitle="Hoàn tất bước khởi tạo"
      navValue="home"
    >
      <Stack spacing={2.5}>
        <PageSection
          eyebrow="Trạng thái phiên"
          title="Onboarding đang chờ được lắp vào"
          description="Task 03 chỉ dựng route và session gating. Wizard nhiều bước sẽ được nối vào ngay sau khi các step UI sẵn sàng."
        >
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <AppChip label={user?.email ?? 'Đã xác thực'} />
            <AppChip label={hasSelectedOnboardingPhase ? 'Đã chọn phase' : 'Chưa chọn phase'} />
            <AppChip
              label={onboardingProfile.onboardingCompleted ? 'Đã hoàn tất' : 'Chưa hoàn tất'}
            />
          </Stack>
        </PageSection>

        <Stack spacing={1}>
          <Typography color="text.secondary" variant="body2">
            Khi task 04 và 05 được nối vào, màn hình này sẽ trở thành wizard onboarding thật.
          </Typography>
        </Stack>
      </Stack>
    </AppShell>
  );
}
