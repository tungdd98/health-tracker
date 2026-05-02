import { Box, Drawer, IconButton, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import { CloseRounded } from '@mui/icons-material';

type AppBottomSheetDialogProps = {
  open: boolean;
  onClose: () => void;
  isBusy?: boolean;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AppBottomSheetDialog({
  open,
  onClose,
  isBusy = false,
  title,
  description,
  actions,
  children,
}: AppBottomSheetDialogProps) {
  return (
    <Drawer anchor="bottom" onClose={isBusy ? undefined : onClose} open={open}>
      <Stack spacing={2} sx={{ mx: 'auto', pb: 3, pt: 1.25, px: 2, width: '100%', maxWidth: 480 }}>
        <Box
          sx={(theme) => ({
            alignSelf: 'center',
            bgcolor: theme.palette.border.strong,
            borderRadius: theme.appTokens.radius.xs,
            height: 4,
            width: 36,
          })}
        />

        <Stack alignItems="center" direction="row" justifyContent="space-between">
          <Stack spacing={0.5}>
            <Typography variant="h6">{title}</Typography>
            {description ? (
              <Typography color="text.secondary" variant="body2">
                {description}
              </Typography>
            ) : null}
          </Stack>

          <IconButton disabled={isBusy} onClick={onClose} size="small">
            <CloseRounded fontSize="small" />
          </IconButton>
        </Stack>

        {children}

        {actions ? (
          <Stack direction="row" spacing={1.5}>
            {actions}
          </Stack>
        ) : null}
      </Stack>
    </Drawer>
  );
}
