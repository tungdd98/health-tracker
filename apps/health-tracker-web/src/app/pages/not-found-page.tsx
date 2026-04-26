import { Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { AppShell, EmptyState } from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';
import { AuthRouteState } from '../components/auth-route-state';

export function NotFoundPage() {
  const { isAuthResolved, session } = useAuthSession();

  if (!isAuthResolved) {
    return <AuthRouteState />;
  }

  const homePath = session ? '/' : '/login';
  const buttonLabel = session ? 'Về trang chủ' : 'Tới đăng nhập';

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
