import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { alpha } from '@mui/material/styles';
import { Box, CircularProgress, Container, Stack, Typography } from '@mui/material';

import { AppCard } from '@health-tracker/ui';

export function AuthRouteState() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="xs" sx={{ px: '0 !important' }}>
        <AppCard
          sx={(theme) => ({
            p: 4,
            textAlign: 'center',
            backgroundColor: alpha(theme.palette.background.paper, 0.92),
          })}
        >
          <Stack spacing={2} alignItems="center">
            <Box
              sx={(theme) => ({
                width: 64,
                height: 64,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                color: theme.palette.primary.main,
                backgroundColor: alpha(theme.palette.primary.light, 0.72),
              })}
            >
              <FavoriteRoundedIcon />
            </Box>
            <Typography variant="h4">Đang chuẩn bị không gian sức khỏe</Typography>
            <Typography color="text.secondary">
              Nô tỳ đang kiểm tra phiên đăng nhập để đưa Hoàng Thượng vào đúng màn hình.
            </Typography>
            <CircularProgress size={28} />
          </Stack>
        </AppCard>
      </Container>
    </Box>
  );
}
