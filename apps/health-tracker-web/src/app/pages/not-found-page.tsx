import { Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { AppShell, EmptyState } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';
import { AuthRouteState } from '../components/auth-route-state';

export function NotFoundPage() {
  const { hasSelectedOnboardingPhase, isAuthResolved, session } = useAuthSession();

  if (!isAuthResolved) {
    return <AuthRouteState />;
  }

  let homePath: string;
  let buttonLabel: string;
  if (!session) {
    homePath = '/login';
    buttonLabel = 'Tới đăng nhập';
  } else if (hasSelectedOnboardingPhase) {
    homePath = '/';
    buttonLabel = 'Về trang chủ';
  } else {
    homePath = '/onboarding';
    buttonLabel = 'Tới onboarding';
  }

  return (
    <AppShell>
      <EmptyState
        title="Không tìm thấy trang"
        description="Đường dẫn này không tồn tại trong phase hiện tại của ứng dụng."
        action={
          <Button component={RouterLink} to={homePath} variant="contained">
            {buttonLabel}
          </Button>
        }
      />
    </AppShell>
  );
}
