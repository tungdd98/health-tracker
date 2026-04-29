import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { alpha, Backdrop, LinearProgress, Paper, Stack, Typography } from '@mui/material';

type MoodGeneratingOverlayProps = {
  open: boolean;
};

export function MoodGeneratingOverlay({ open }: MoodGeneratingOverlayProps) {
  return (
    <Backdrop
      open={open}
      sx={(theme) => ({
        zIndex: 1400,
        bgcolor: alpha(theme.palette.common.black, 0.6),
        backdropFilter: 'blur(8px)',
      })}
    >
      <Paper
        sx={(theme) => ({
          width: '100%',
          p: 4,
          mx: 2,
          textAlign: 'center',
          borderRadius: theme.appTokens.radius.card,
          boxShadow: theme.appTokens.shadow.modal,
        })}
      >
        <Stack spacing={1.5}>
          <AutoAwesomeRoundedIcon
            sx={(theme) => ({
              fontSize: 56,
              color: theme.palette.primary.main,
              alignSelf: 'center',
              animation: 'moodPulse 1.8s ease-in-out infinite',
              '@keyframes moodPulse': {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.15)', opacity: 0.6 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            })}
          />
          <Typography variant="h6">Đang tạo sticker...</Typography>
          <Typography color="text.secondary" variant="body2">
            Vui lòng chờ trong giây lát...
          </Typography>
        </Stack>
        <LinearProgress sx={{ mt: 3, borderRadius: 1 }} />
      </Paper>
    </Backdrop>
  );
}
