import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Stack, Typography } from '@mui/material';

const TOOL_LABELS: Record<string, string> = {
  get_profile: 'Đang đọc hồ sơ của bạn',
  get_medications: 'Đang tra cứu thuốc',
  get_medication_adherence: 'Đang tính mức độ uống thuốc đều',
  get_daily_logs: 'Đang xem lại nhật ký sức khoẻ',
  get_log_summary: 'Đang tóm tắt dữ liệu gần đây',
};

export function ToolCallChip({ name }: { name: string }) {
  return (
    <Stack
      alignItems="center"
      direction="row"
      spacing={1}
      sx={(theme) => ({
        alignSelf: 'flex-start',
        backgroundColor: theme.palette.surface.accentStrong,
        borderRadius: theme.appTokens.radius.pill,
        color: theme.palette.primary.main,
        px: 1.5,
        py: 1,
      })}
    >
      <SearchRoundedIcon sx={{ fontSize: 18 }} />
      <Typography fontSize={13} fontWeight={600} lineHeight={1.3}>
        {TOOL_LABELS[name] ?? 'Đang tra cứu thêm dữ liệu'}
      </Typography>
    </Stack>
  );
}
