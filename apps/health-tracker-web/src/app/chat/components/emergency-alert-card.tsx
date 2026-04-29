import EmergencyRoundedIcon from '@mui/icons-material/EmergencyRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import { Button, Stack, Typography } from '@mui/material';

export function EmergencyAlertCard({
  emergencyContactName,
  emergencyContactPhone,
}: {
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
}) {
  return (
    <Stack
      sx={(theme) => ({
        backgroundColor: theme.palette.error.main,
        borderRadius: theme.appTokens.radius.xl,
        color: theme.palette.primary.contrastText,
        p: 2,
      })}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.25}>
          <EmergencyRoundedIcon sx={{ fontSize: 24 }} />
          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <Typography fontSize={15} fontWeight={700} lineHeight={1.3}>
              Đây có thể là tình trạng cấp cứu!
            </Typography>
            <Typography fontSize={14} lineHeight={1.5} sx={{ opacity: 0.94 }}>
              Hãy gọi ngay 115 hoặc nhờ người thân đưa đến cơ sở y tế gần nhất. Đừng tự lái xe.
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1.25}>
          <Button
            component="a"
            href="tel:115"
            startIcon={<LocalPhoneRoundedIcon sx={{ fontSize: 18 }} />}
            sx={(theme) => ({
              backgroundColor: theme.palette.background.paper,
              borderRadius: theme.appTokens.radius.pill,
              color: theme.palette.error.main,
              flex: 1,
              minHeight: 48,
            })}
            variant="contained"
          >
            Gọi 115
          </Button>

          {emergencyContactPhone ? (
            <Button
              component="a"
              href={`tel:${emergencyContactPhone}`}
              startIcon={<GroupRoundedIcon sx={{ fontSize: 18 }} />}
              sx={(theme) => ({
                borderColor: theme.palette.background.paper,
                borderRadius: theme.appTokens.radius.pill,
                color: theme.palette.background.paper,
                flex: 1,
                minHeight: 48,
              })}
              variant="outlined"
            >
              {emergencyContactName?.trim() || 'Người thân'}
            </Button>
          ) : null}
        </Stack>

        {!emergencyContactPhone ? (
          <Typography fontSize={13} lineHeight={1.5} sx={{ opacity: 0.9 }}>
            Nếu đang ở một mình, hãy nhờ người xung quanh hỗ trợ gọi cấp cứu ngay bây giờ.
          </Typography>
        ) : null}
      </Stack>
    </Stack>
  );
}
