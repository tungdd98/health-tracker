import { Box, Button, CircularProgress, type ButtonProps } from '@mui/material';

type AppSubmitButtonProps = ButtonProps & {
  loading?: boolean;
  loadingIndicatorSize?: number;
};

export function AppSubmitButton({
  children,
  disabled = false,
  loading = false,
  loadingIndicatorSize = 18,
  startIcon,
  sx,
  ...props
}: AppSubmitButtonProps) {
  return (
    <Button
      disabled={disabled || loading}
      startIcon={loading ? undefined : startIcon}
      sx={sx}
      {...props}
    >
      <Box component="span" sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}>
        {loading ? <CircularProgress color="inherit" size={loadingIndicatorSize} /> : null}
        {children}
      </Box>
    </Button>
  );
}
