import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { Box, Stack, Typography } from '@mui/material';

export function AppHeader() {
  return (
    <Box component="header" sx={{ px: 3, py: 2 }}>
      <Stack alignItems="center" direction="row" spacing={1.5}>
        <FavoriteRoundedIcon color="primary" />
        <Typography variant="h6">Health Tracker</Typography>
      </Stack>
    </Box>
  );
}
