import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import { Alert, Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { mapAuthErrorToMessage, signOutUser } from '@health-tracker/api';
import {
  AppFormProvider,
  FormCheckboxField,
  FormDateField,
  FormRadioGroup,
  FormSegmentedControl,
  FormSelectField,
  FormSliderField,
  FormStepper,
  FormSwitchField,
  FormTextAreaField,
  FormTextField,
} from '@health-tracker/forms';
import {
  AppCard,
  AppChip,
  AppListItem,
  AppShell,
  EmptyState,
  LoadingBlock,
  PageSection,
} from '@health-tracker/ui';

import { useAuthSession } from '../auth/use-auth-session';

type PreviewFormValues = {
  energy: number;
  focus: string;
  journal: string;
  mealStyle: string;
  reminders: boolean;
  sleepQuality: string;
  targetDate: DateTime | null;
  waterGoal: string;
  workoutToday: boolean;
};

export function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const [signOutError, setSignOutError] = useState('');
  const [isSigningOut, setIsSigningOut] = useState(false);

  const form = useForm<PreviewFormValues>({
    defaultValues: {
      energy: 7,
      focus: 'steady',
      journal: 'Felt calm after a shorter walk and a lighter dinner.',
      mealStyle: 'balanced',
      reminders: true,
      sleepQuality: 'good',
      targetDate: DateTime.now().plus({ days: 3 }),
      waterGoal: '2l',
      workoutToday: true,
    },
  });

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
      headerEyebrow="Bảng điều khiển riêng"
      headerSubtitle="Nhịp theo dõi hôm nay đã sẵn sàng để Hoàng Thượng tiếp tục cập nhật."
      headerTitle="Không gian sức khỏe"
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
          title={`Chào mừng trở lại${user?.email ? ',' : ''} ${user?.email ?? ''}`.trim()}
          description="Từ đây Hoàng Thượng có thể tiếp tục theo dõi nhịp sinh hoạt, nước uống, bữa ăn, và những thay đổi nhỏ mỗi ngày."
        >
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <AppChip label="Phiên hoạt động" />
            <AppChip label={user?.email ?? 'Đã xác thực'} />
            <AppChip label="Nhịp chăm sóc ổn định" />
          </Stack>
        </PageSection>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AppCard sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="overline">Hôm nay</Typography>
                <Typography variant="h2">82</Typography>
                <Typography color="text.secondary">
                  Chỉ số cân bằng hôm nay đang được giữ tốt nhờ giấc ngủ, nước uống, và bữa ăn.
                </Typography>
              </Stack>
            </AppCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AppCard sx={{ p: 3 }}>
              <Stack spacing={1.5}>
                <Typography variant="overline">Điểm nổi bật</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <AppChip color="secondary" icon={<WaterDropRoundedIcon />} label="Nước uống" />
                  <AppChip color="secondary" icon={<HotelRoundedIcon />} label="Giấc ngủ" />
                  <AppChip color="secondary" icon={<RestaurantRoundedIcon />} label="Bữa ăn" />
                </Stack>
                <Typography color="text.secondary">
                  Bố cục vẫn nhẹ và thoáng để dữ liệu sức khỏe hằng ngày không trở nên nặng nề.
                </Typography>
              </Stack>
            </AppCard>
          </Grid>
        </Grid>

        <PageSection
          eyebrow="Theo dõi nhanh"
          title="Các mốc chăm sóc đang được lưu lại"
          description="Trang chủ tạm thời này cho thấy vòng lặp đăng nhập, phiên làm việc, và bề mặt sản phẩm đã nối với nhau."
        >
          <Stack spacing={1.5}>
            <AppListItem
              leading={<WaterDropRoundedIcon />}
              subtitle="Theo dõi mục tiêu dịu nhẹ, không tạo cảm giác như dashboard dày đặc"
              title="Nhật ký nước uống"
              trailing="2.1L"
            />
            <AppListItem
              leading={<HotelRoundedIcon />}
              subtitle="Khung tóm tắt ngắn cho lần kiểm tra sức khỏe đầu ngày"
              title="Tóm tắt giấc ngủ"
              trailing="7h 45m"
            />
            <Alert color="success" variant="filled">
              Phiên đăng nhập đã hoạt động. Hoàng Thượng đang ở trong khu vực riêng của ứng dụng.
            </Alert>
          </Stack>
        </PageSection>

        <PageSection
          eyebrow="Nhập liệu"
          title="Biểu mẫu dùng chung cho các lần cập nhật tiếp theo"
          description="Các control hiện tại vẫn được giữ lại để phase sau tiếp tục xây dựng luồng ghi nhận sức khỏe thật sự."
        >
          <FormStepper activeStep={1} steps={['Hồ sơ', 'Thói quen', 'Xem trước']} />
          <Divider flexItem sx={{ my: 1 }} />
          <AppFormProvider form={form} onSubmit={async () => undefined}>
            <FormTextField label="Ghi chú buổi sáng" name="journal" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormSelectField
                  label="Mục tiêu nước uống"
                  name="waterGoal"
                  options={[
                    { label: '1.5L', value: '1.5l' },
                    { label: '2L', value: '2l' },
                    { label: '2.5L', value: '2.5l' },
                  ]}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormDateField label="Lần kiểm tra tiếp theo" name="targetDate" />
              </Grid>
            </Grid>
            <FormSegmentedControl
              label="Nhịp tập trung"
              name="focus"
              options={[
                { label: 'Khởi động lại', value: 'reset' },
                { label: 'Ổn định', value: 'steady' },
                { label: 'Tăng tốc', value: 'push' },
              ]}
            />
            <FormRadioGroup
              label="Chất lượng giấc ngủ"
              name="sleepQuality"
              options={[
                { label: 'Nhẹ', value: 'light' },
                { label: 'Tốt', value: 'good' },
                { label: 'Sâu', value: 'deep' },
              ]}
              row
            />
            <FormSliderField label="Mức năng lượng" max={10} min={0} name="energy" step={1} />
            <FormTextAreaField
              label="Nhật ký ngắn"
              name="journal"
              placeholder="Lưu lại một ghi chú thật ngắn cho cuối ngày..."
            />
            <FormCheckboxField
              helperText="Giữ kiểu xác nhận nhẹ nhàng cho các thói quen lặp lại."
              label="Hôm nay đã vận động"
              name="workoutToday"
            />
            <FormSwitchField
              helperText="Các toggle kiểu cài đặt cũng dùng cùng ngôn ngữ hình khối hiện tại."
              label="Nhắc nhở nhẹ"
              name="reminders"
            />
            <Button type="submit" variant="contained">
              Lưu trạng thái xem trước
            </Button>
          </AppFormProvider>
        </PageSection>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <PageSection
              eyebrow="Đang tải"
              title="Skeleton cho các phần sắp tới"
              description="Giữ lại mẫu loading mềm cho những màn tóm tắt sức khỏe sẽ được bổ sung ở phase sau."
            >
              <LoadingBlock />
            </PageSection>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <EmptyState
              action={<Button variant="outlined">Bắt đầu lần ghi đầu tiên</Button>}
              description="Empty state hiện đã nằm trong vùng riêng của người dùng, không còn là màn preview thuần thiết kế."
              icon={<FavoriteRoundedIcon />}
              title="Chưa có cột mốc sức khỏe nào"
            />
          </Grid>
        </Grid>

        <AppCard sx={{ p: 3 }}>
          <Stack direction="row" spacing={1.5}>
            <AccessTimeRoundedIcon color="primary" />
            <Stack spacing={0.5}>
              <Typography variant="subtitle1">Bước tiếp theo</Typography>
              <Typography color="text.secondary">
                Auth routing đã hoàn chỉnh để phase kế tiếp có thể thêm màn riêng tư mà không phải
                dựng lại nền tảng phiên đăng nhập.
              </Typography>
            </Stack>
          </Stack>
        </AppCard>
      </Stack>
    </AppShell>
  );
}
