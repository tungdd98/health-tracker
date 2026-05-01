# Task 03 — Add edit icon button to CycleHero

**File:** `apps/health-tracker-web/src/app/dashboard/cycle-hero.tsx`

Add an `onEditPeriod: () => void` prop. Render an `EditRounded` icon button (`aria-label="Chỉnh sửa ngày bắt đầu kỳ kinh"`) in the top-right corner of the card whenever `mode !== 'nudge'` (i.e. a cycle snapshot exists and predictions are shown). The button is not shown in the `nudge` branch or the loading skeleton.

The icon button sits in the top-right of the `AppCard` using absolute positioning relative to the card, which already has `overflow: 'hidden'` and `position` can be added. Follow the same icon-button pattern used elsewhere in the app (`aria-label` required per CLAUDE.md).

---

- [ ] **Step 1: Add `onEditPeriod` prop and edit button to the active card branch**

In `cycle-hero.tsx`, update `CycleHeroProps` and the return for the active (`predict`/`overdue`/`stale`) mode:

```tsx
// Add to CycleHeroProps:
type CycleHeroProps = {
  mode: CycleHeroMode;
  snapshot: CycleSnapshot | null;
  isLoading: boolean;
  onLogPeriod: () => void;
  onEditPeriod: () => void;
  dailyLogSlot?: ReactNode;
};
```

Add `EditRounded` to the existing icon import line:

```tsx
import {
  CalendarTodayRounded,
  EditRounded,
  OpacityRounded,
  SettingsRounded,
} from '@mui/icons-material';
```

Add `IconButton` to the MUI import line:

```tsx
import {
  Box,
  Button,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
```

In the active card's `AppCard`, wrap the existing content in a `Box` with `position: 'relative'` and add the icon button absolutely positioned top-right. Replace the `AppCard` return (the one that renders `CycleRing`) with:

```tsx
return (
  <AppCard
    sx={{
      border: isStale
        ? `2px solid ${theme.palette.status.warningText}`
        : `1px solid ${alpha(theme.palette.divider, 0.9)}`,
      overflow: 'hidden',
      p: 3,
      borderRadius: theme.appTokens.radius.xl,
      position: 'relative',
    }}
  >
    <IconButton
      aria-label="Chỉnh sửa ngày bắt đầu kỳ kinh"
      onClick={onEditPeriod}
      size="small"
      sx={{ position: 'absolute', top: 8, right: 8 }}
    >
      <EditRounded fontSize="small" />
    </IconButton>

    {/* rest of the existing card content unchanged */}
    {isStale ? (
      <Box
        sx={(currentTheme) => ({
          alignItems: 'flex-start',
          backgroundColor: currentTheme.palette.status.warningSurface,
          border: `1px solid ${currentTheme.palette.border.strong}`,
          borderRadius: currentTheme.appTokens.radius.lg,
          display: 'flex',
          gap: 1.25,
          mb: 2,
          px: 1.75,
          py: 1.5,
        })}
      >
        <OpacityRounded
          sx={(currentTheme) => ({
            color: currentTheme.palette.status.warningText,
            fontSize: 18,
            mt: 0.125,
          })}
        />
        <Box>
          <Typography
            sx={(currentTheme) => ({
              color: currentTheme.palette.status.warningText,
              fontSize: '0.8125rem',
              fontWeight: 700,
            })}
          >
            Dữ liệu chu kỳ có vẻ cũ
          </Typography>
          <Typography
            color="text.secondary"
            sx={(currentTheme) => currentTheme.appTokens.typography.helper}
          >
            Hãy cập nhật để dự đoán chính xác hơn.
          </Typography>
        </Box>
      </Box>
    ) : null}

    <Stack alignItems="center" spacing={2}>
      <CycleRing snapshot={snapshot} />

      {dailyLogSlot ? <Box sx={{ width: '100%' }}>{dailyLogSlot}</Box> : null}

      <Stack
        alignItems="center"
        direction="row"
        spacing={1}
        sx={(currentTheme) => ({
          bgcolor: currentTheme.palette.surface.sunken,
          borderRadius: currentTheme.appTokens.radius.pill,
          px: 1.75,
          py: 1,
        })}
      >
        <OpacityRounded sx={{ color: highlightColor, fontSize: 14 }} />
        <Typography
          color="text.primary"
          sx={(currentTheme) => currentTheme.appTokens.typography.helper}
        >
          {countdownLine}
        </Typography>
      </Stack>

      {showLogCta ? (
        <Button
          fullWidth
          onClick={onLogPeriod}
          startIcon={<OpacityRounded />}
          sx={{
            maxWidth: '100%',
          }}
          variant={isStale ? 'contained' : 'outlined'}
        >
          Đánh dấu kỳ kinh mới hôm nay
        </Button>
      ) : null}
    </Stack>
  </AppCard>
);
```

Also add `onEditPeriod` to the destructured props at the top of `CycleHero`:

```tsx
export function CycleHero({
  mode,
  snapshot,
  isLoading,
  onLogPeriod,
  onEditPeriod,
  dailyLogSlot,
}: CycleHeroProps) {
```

- [ ] **Step 2: Verify lint and build pass**

```bash
yarn lint
yarn build
```

Expected: TypeScript will flag a missing `onEditPeriod` prop at the call site in `dashboard-page.tsx` — fix in Task 04.

- [ ] **Step 3: Commit**

```bash
git add apps/health-tracker-web/src/app/dashboard/cycle-hero.tsx
git commit -m "feat: add edit period icon button to CycleHero"
```
