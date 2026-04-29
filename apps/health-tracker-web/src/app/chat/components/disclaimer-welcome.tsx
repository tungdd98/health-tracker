import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { alpha } from '@mui/material/styles';
import { Dialog, DialogContent, Stack, Typography } from '@mui/material';

import { AppSubmitButton } from '@health-tracker/ui';

export function DisclaimerWelcome({
  isSubmitting,
  onConfirm,
  open,
}: {
  isSubmitting: boolean;
  onConfirm: () => void;
  open: boolean;
}) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      BackdropProps={{
        sx: (theme) => ({
          backgroundColor: alpha(theme.palette.text.primary, 0.4),
        }),
      }}
      PaperProps={{
        sx: (theme) => ({
          backgroundImage: 'none',
          borderRadius: `${theme.appTokens.radius.card}px`,
          boxShadow: theme.appTokens.shadow.modal,
          maxWidth: 342,
          mx: 'auto',
        }),
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Stack spacing={2.5} sx={{ p: '28px 24px 24px' }}>
          <Stack alignItems="center" direction="row" spacing={1.5}>
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={(theme) => ({
                backgroundColor: theme.palette.surface.accentStrong,
                borderRadius: 1.75,
                color: theme.palette.primary.main,
                height: 44,
                width: 44,
              })}
            >
              <InfoOutlinedIcon sx={{ fontSize: 22 }} />
            </Stack>
            <Typography sx={(theme) => ({ ...theme.appTokens.typography.titleMd, fontSize: 17 })}>
              Lưu ý quan trọng
            </Typography>
          </Stack>

          <Typography color="text.secondary" fontSize={14} lineHeight={1.6}>
            Trợ lý này cung cấp thông tin sức khoẻ mang tính tham khảo, không thay thế lời khuyên từ
            bác sĩ hoặc dược sĩ.
            <br />
            <br />
            Khi có triệu chứng nghiêm trọng hoặc khẩn cấp, hãy gọi 115 hoặc đến cơ sở y tế gần nhất.
          </Typography>

          <AppSubmitButton
            fullWidth
            loading={isSubmitting}
            onClick={onConfirm}
            sx={(theme) => ({
              borderRadius: theme.appTokens.radius.pill,
              minHeight: 50,
            })}
            variant="contained"
          >
            Đã hiểu
          </AppSubmitButton>

          <Typography color="text.secondary" fontSize={13} textAlign="center">
            Không hiện lại
          </Typography>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
