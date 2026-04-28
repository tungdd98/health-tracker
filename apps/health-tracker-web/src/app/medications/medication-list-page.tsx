import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded';
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  ListItemIcon,
  ListItemText,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { DateTime } from 'luxon';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuthSession } from '../auth/use-auth-session';
import { AppConfirmDialog } from '../components/app-confirm-dialog';
import { MedicationPageLayout } from './medication-page-layout';
import {
  useDeleteMedicationMutation,
  useMedications,
  useToggleMedicationActiveMutation,
} from './use-medications';

const formatDate = (isoDate: string) => DateTime.fromISO(isoDate).toFormat('dd/MM/yyyy');

const getScheduleLabel = (
  scheduleType: 'daily' | 'course',
  courseStartDate: string | null,
  courseDurationDays: number | null,
) => {
  if (scheduleType === 'daily') {
    return { ended: false, label: 'Hằng ngày' };
  }

  if (!courseStartDate || !courseDurationDays) {
    return { ended: false, label: 'Theo liệu trình' };
  }

  const today = DateTime.local().startOf('day');
  const start = DateTime.fromISO(courseStartDate).startOf('day');

  if (!today.isValid || !start.isValid) {
    return { ended: false, label: 'Theo liệu trình' };
  }

  const endInclusive = start.plus({ days: courseDurationDays - 1 });

  if (today < start) {
    return { ended: false, label: `Bắt đầu ${formatDate(courseStartDate)}` };
  }

  if (today > endInclusive) {
    return { ended: true, label: 'Đã kết thúc' };
  }

  const remaining = Math.max(1, Math.ceil(endInclusive.diff(today, 'days').days) + 1);
  return { ended: false, label: `Còn ${remaining} ngày` };
};

export function MedicationListPage() {
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const { data: medications, isLoading, error } = useMedications(user?.id);
  const toggleMutation = useToggleMedicationActiveMutation(user?.id);
  const deleteMutation = useDeleteMedicationMutation(user?.id);

  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const selectedMedication = useMemo(
    () => medications?.find((item) => item.id === selectedMedicationId) ?? null,
    [medications, selectedMedicationId],
  );

  const isMenuOpen = Boolean(menuAnchorEl && selectedMedication);

  return (
    <MedicationPageLayout
      actionLabel="Thêm"
      onAction={() => navigate('/medications/new')}
      onBack={() => navigate('/')}
      title="Quản lý thuốc"
    >
      <Stack spacing={2}>
        {error ? (
          <Alert severity="error">Không thể tải danh sách thuốc. Vui lòng thử lại.</Alert>
        ) : null}

        {isLoading ? (
          <Stack spacing={1.5}>
            {Array.from({ length: 3 }, (_, index) => (
              <Skeleton key={index} height={120} sx={{ borderRadius: '20px' }} variant="rounded" />
            ))}
          </Stack>
        ) : null}

        {!isLoading && (medications?.length ?? 0) === 0 ? (
          <Stack
            alignItems="center"
            spacing={2.5}
            sx={{
              minHeight: 'calc(100dvh - 220px)',
              justifyContent: 'center',
              px: 0.5,
            }}
          >
            <MedicationRoundedIcon sx={{ color: '#c0adb3', fontSize: 56 }} />
            <Typography sx={{ fontSize: 18, fontWeight: 700 }}>Chưa có thuốc nào</Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 300, textAlign: 'center' }}>
              Thêm thuốc để theo dõi lịch uống hằng ngày.
            </Typography>
            <Button
              onClick={() => navigate('/medications/new')}
              startIcon={<AddRoundedIcon />}
              sx={{ mt: 0.5, px: 3, py: 1.75 }}
              variant="contained"
            >
              Thêm thuốc đầu tiên
            </Button>
          </Stack>
        ) : null}

        <Stack spacing={1.5} sx={{ pt: 1 }}>
          {(medications ?? []).map((medication) => {
            const schedule = getScheduleLabel(
              medication.scheduleType,
              medication.courseStartDate,
              medication.courseDurationDays,
            );
            const isFaded = !medication.active || schedule.ended;

            return (
              <Stack
                key={medication.id}
                spacing={1}
                sx={{
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '20px',
                  opacity: isFaded ? 0.58 : 1,
                  px: 2,
                  py: 2,
                }}
              >
                <Stack
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                  spacing={1}
                >
                  <ButtonBase
                    onClick={() => navigate(`/medications/${medication.id}/edit`)}
                    sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  >
                    <Typography
                      color="text.primary"
                      fontSize={15}
                      fontWeight={700}
                      textAlign="left"
                    >
                      {medication.name}
                    </Typography>
                  </ButtonBase>

                  <Stack alignItems="center" direction="row" spacing={0.25}>
                    <Switch
                      checked={medication.active}
                      disabled={toggleMutation.isPending}
                      onChange={(_event, checked) => {
                        void toggleMutation.mutateAsync({ active: checked, medication });
                      }}
                      size="small"
                    />
                    <IconButton
                      onClick={(event) => {
                        setSelectedMedicationId(medication.id);
                        setMenuAnchorEl(event.currentTarget);
                      }}
                      size="small"
                    >
                      <MoreVertRoundedIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>

                <Stack alignItems="center" direction="row" spacing={0.75}>
                  {medication.dosage ? (
                    <Typography color="text.secondary" variant="body2">
                      {medication.dosage}
                    </Typography>
                  ) : null}
                  {medication.dosage ? (
                    <Typography color="text.secondary" variant="body2">
                      ·
                    </Typography>
                  ) : null}
                  {schedule.ended ? (
                    <Chip color="default" label={schedule.label} size="small" variant="outlined" />
                  ) : (
                    <Typography color="text.secondary" sx={{ fontSize: 13 }}>
                      {schedule.label}
                    </Typography>
                  )}
                </Stack>

                <Typography color="text.secondary" sx={{ fontSize: 13, fontWeight: 500 }}>
                  {medication.doses.map((dose) => dose.timeOfDay).join(' · ')}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      </Stack>

      <Menu
        anchorEl={menuAnchorEl}
        onClose={() => {
          setMenuAnchorEl(null);
          setSelectedMedicationId(null);
        }}
        open={isMenuOpen}
      >
        <MenuItem
          onClick={() => {
            if (selectedMedication) {
              navigate(`/medications/${selectedMedication.id}/edit`);
            }

            setMenuAnchorEl(null);
            setSelectedMedicationId(null);
          }}
        >
          <ListItemIcon>
            <EditRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sửa</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (selectedMedication) {
              setDeleteTarget({ id: selectedMedication.id, name: selectedMedication.name });
            }

            setMenuAnchorEl(null);
            setSelectedMedicationId(null);
          }}
        >
          <ListItemIcon>
            <DeleteRoundedIcon color="error" fontSize="small" />
          </ListItemIcon>
          <ListItemText>Xoá</ListItemText>
        </MenuItem>
      </Menu>

      <AppConfirmDialog
        cancelLabel="Huỷ"
        confirmLabel="Xoá"
        confirmColor="error"
        description="Toàn bộ lịch sử log của thuốc này cũng sẽ bị xoá và không thể khôi phục."
        isSubmitting={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) {
            return;
          }

          await deleteMutation.mutateAsync(deleteTarget.id);
          setDeleteTarget(null);
        }}
        open={Boolean(deleteTarget)}
        title={`Xoá ${deleteTarget?.name}?`}
      />

      {toggleMutation.error ? (
        <Box sx={{ mt: 2 }}>
          <Alert severity="error" variant="outlined">
            Không thể cập nhật trạng thái thuốc.
          </Alert>
        </Box>
      ) : null}
      {deleteMutation.error ? (
        <Box sx={{ mt: 1 }}>
          <Alert severity="error" variant="outlined">
            Không thể xoá thuốc. Vui lòng thử lại.
          </Alert>
        </Box>
      ) : null}
    </MedicationPageLayout>
  );
}
