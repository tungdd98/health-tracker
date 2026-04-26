import { Skeleton, Stack } from '@mui/material';

export function LoadingBlock() {
  return (
    <Stack spacing={1.5}>
      <Skeleton height={32} variant="rounded" />
      <Skeleton height={24} variant="rounded" width="80%" />
      <Skeleton height={160} variant="rounded" />
    </Stack>
  );
}
