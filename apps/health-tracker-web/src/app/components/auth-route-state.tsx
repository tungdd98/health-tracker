import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';

import { AppCard } from '@health-tracker/ui';

export function AuthRouteState() {
  return (
    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        minHeight: '100dvh',
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="xs" sx={{ px: '0 !important' }}>
        <AppCard
          sx={(theme) => ({
            backgroundColor: theme.palette.surface.raised,
            boxShadow: theme.appTokens.shadow.modal,
            p: 4,
            textAlign: 'center',
          })}
        >
          <Stack alignItems="center" spacing={2}>
            <Box
              sx={(theme) => ({
                alignItems: 'center',
                bgcolor: theme.palette.surface.accent,
                borderRadius: '50%',
                color: theme.palette.primary.main,
                display: 'grid',
                height: 64,
                placeItems: 'center',
                width: 64,
              })}
            >
              <FavoriteRoundedIcon />
            </Box>
            <Typography variant="h4">Đang chuẩn bị không gian sức khỏe</Typography>
            <Typography color="text.secondary" variant="body2">
              Nô tỳ đang kiểm tra phiên đăng nhập để đưa Hoàng Thượng vào đúng màn hình.
            </Typography>
            <CircularProgress size={28} />
          </Stack>
        </AppCard>
      </Container>
    </Box>
  );
}
