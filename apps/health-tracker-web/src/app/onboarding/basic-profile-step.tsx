import AddAPhotoRoundedIcon from '@mui/icons-material/AddAPhotoRounded';
import { Avatar, Box, Grid, IconButton, Stack } from '@mui/material';
import { useRef } from 'react';

import { FormDateField, FormTextField } from '@health-tracker/forms';

type BasicProfileStepProps = {
  onAvatarChange?: (file: File) => void;
  avatarPreviewUrl?: string | null;
};

export function BasicProfileStep({ onAvatarChange, avatarPreviewUrl }: BasicProfileStepProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
    e.target.value = '';
  };

  return (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ position: 'relative', width: 80, height: 80 }}>
          <Avatar
            src={avatarPreviewUrl ?? undefined}
            sx={(theme) => ({
              width: 80,
              height: 80,
              bgcolor: theme.palette.surface.subtle,
              color: 'text.secondary',
            })}
          >
            {!avatarPreviewUrl && <AddAPhotoRoundedIcon />}
          </Avatar>
          <IconButton
            aria-label="Chọn ảnh đại diện"
            onClick={() => fileInputRef.current?.click()}
            size="small"
            sx={(theme) => ({
              bgcolor: 'primary.main',
              bottom: 0,
              color: 'primary.contrastText',
              position: 'absolute',
              right: 0,
              '&:hover': { bgcolor: 'primary.dark' },
              width: 28,
              height: 28,
              border: `2px solid ${theme.palette.background.default}`,
            })}
          >
            <AddAPhotoRoundedIcon sx={{ fontSize: 14 }} />
          </IconButton>
          <input
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
            type="file"
          />
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <FormTextField label="Tên hiển thị" name="displayName" placeholder="Ví dụ: Lan Anh" />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormDateField label="Ngày sinh" name="birthDate" />
        </Grid>
      </Grid>
    </Stack>
  );
}
