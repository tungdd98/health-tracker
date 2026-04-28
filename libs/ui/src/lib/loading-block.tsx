import { Skeleton, Stack } from '@mui/material';

export function LoadingBlock() {
  return (
    <Stack spacing={1.5}>
      <Skeleton height={18} variant="rounded" width="34%" />
      <Skeleton height={28} variant="rounded" width="58%" />
      <Skeleton height={18} variant="rounded" width="78%" />
      <Skeleton
        height={150}
        sx={(theme) => ({ borderRadius: theme.appTokens.radius.xl })}
        variant="rounded"
      />
    </Stack>
  );
}
