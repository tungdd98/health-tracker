import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import { Alert, Button, Divider, Grid, Stack, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { useForm } from 'react-hook-form';

import {
  AppFormProvider,
  FormCheckboxField,
  FormDateField,
  FormRadioGroup,
  FormSegmentedControl,
  FormSelectField,
  FormSliderField,
  FormStepper,
  FormSwitchField,
  FormTextAreaField,
  FormTextField,
} from '@health-tracker/forms';
import {
  AppCard,
  AppChip,
  AppListItem,
  AppShell,
  EmptyState,
  LoadingBlock,
  PageSection,
} from '@health-tracker/ui';

type PreviewFormValues = {
  energy: number;
  focus: string;
  journal: string;
  mealStyle: string;
  reminders: boolean;
  sleepQuality: string;
  targetDate: DateTime | null;
  waterGoal: string;
  workoutToday: boolean;
};

export function LandingPage() {
  const form = useForm<PreviewFormValues>({
    defaultValues: {
      energy: 7,
      focus: 'steady',
      journal: 'Felt calm after a shorter walk and a lighter dinner.',
      mealStyle: 'balanced',
      reminders: true,
      sleepQuality: 'good',
      targetDate: DateTime.now().plus({ days: 3 }),
      waterGoal: '2l',
      workoutToday: true,
    },
  });

  return (
    <AppShell
      headerEyebrow="Health Tracker DS"
      headerSubtitle="Mobile-first tokens and base components synchronized from Stitch"
      headerTitle="Soft mobile system"
      navValue="home"
    >
      <Stack spacing={2.5}>
        <PageSection
          eyebrow="Foundation"
          title="A calm design system, ready for feature screens"
          description="The app theme, shell, navigation, surfaces, and form controls now share the same mobile-first language."
        >
          <Stack direction="row" flexWrap="wrap" gap={1}>
            <AppChip label="Plus Jakarta Sans" />
            <AppChip label="Soft rose palette" />
            <AppChip label="Rounded surfaces" />
            <AppChip label="Form-heavy flows" />
          </Stack>
        </PageSection>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AppCard sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="overline">Today</Typography>
                <Typography variant="h2">82</Typography>
                <Typography color="text.secondary">
                  Serenity score shaped by sleep, water, and meal rhythm.
                </Typography>
              </Stack>
            </AppCard>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <AppCard sx={{ p: 3 }}>
              <Stack spacing={1.5}>
                <Typography variant="overline">Highlights</Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  <AppChip color="secondary" icon={<WaterDropRoundedIcon />} label="Hydration" />
                  <AppChip color="secondary" icon={<HotelRoundedIcon />} label="Sleep" />
                  <AppChip color="secondary" icon={<RestaurantRoundedIcon />} label="Meals" />
                </Stack>
                <Typography color="text.secondary">
                  Surfaces stay soft and spacious so dense health data does not feel clinical.
                </Typography>
              </Stack>
            </AppCard>
          </Grid>
        </Grid>

        <PageSection
          eyebrow="Surfaces"
          title="Cards, list items, and feedback blocks"
          description="Reusable building blocks for the first feature screens."
        >
          <Stack spacing={1.5}>
            <AppListItem
              leading={<WaterDropRoundedIcon />}
              subtitle="Soft goal tracking without dashboard noise"
              title="Hydration log"
              trailing="2.1L"
            />
            <AppListItem
              leading={<HotelRoundedIcon />}
              subtitle="Gentle framing for daily health check-ins"
              title="Sleep recap"
              trailing="7h 45m"
            />
            <Alert color="info" variant="filled">
              Buttons, chips, cards, and list rows now inherit the same design tokens.
            </Alert>
          </Stack>
        </PageSection>

        <PageSection
          eyebrow="Forms"
          title="Shared controls for mobile-first health entry"
          description="The forms library now exposes consistent wrappers instead of hand-styled fields per screen."
        >
          <FormStepper activeStep={1} steps={['Profile', 'Habits', 'Preview']} />
          <Divider flexItem sx={{ my: 1 }} />
          <AppFormProvider form={form} onSubmit={async () => undefined}>
            <FormTextField label="Morning note" name="journal" />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormSelectField
                  label="Water target"
                  name="waterGoal"
                  options={[
                    { label: '1.5L', value: '1.5l' },
                    { label: '2L', value: '2l' },
                    { label: '2.5L', value: '2.5l' },
                  ]}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormDateField label="Next check-in" name="targetDate" />
              </Grid>
            </Grid>
            <FormSegmentedControl
              label="Focus mode"
              name="focus"
              options={[
                { label: 'Reset', value: 'reset' },
                { label: 'Steady', value: 'steady' },
                { label: 'Push', value: 'push' },
              ]}
            />
            <FormRadioGroup
              label="Sleep quality"
              name="sleepQuality"
              options={[
                { label: 'Light', value: 'light' },
                { label: 'Good', value: 'good' },
                { label: 'Deep', value: 'deep' },
              ]}
              row
            />
            <FormSliderField label="Energy level" max={10} min={0} name="energy" step={1} />
            <FormTextAreaField
              label="Journal reflection"
              name="journal"
              placeholder="Capture a light end-of-day note..."
            />
            <FormCheckboxField
              helperText="Use a soft confirmation style for repeat habits."
              label="Workout completed today"
              name="workoutToday"
            />
            <FormSwitchField
              helperText="Settings-style toggles also share the same shape language."
              label="Gentle reminders"
              name="reminders"
            />
            <Button type="submit" variant="contained">
              Save preview state
            </Button>
          </AppFormProvider>
        </PageSection>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <PageSection
              eyebrow="Loading"
              title="Soft skeletons"
              description="Use these while health summaries or timelines are fetching."
            >
              <LoadingBlock />
            </PageSection>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <EmptyState
              action={<Button variant="outlined">Start first entry</Button>}
              description="Empty and success states now sit on the same visual foundation as the rest of the app."
              icon={<FavoriteRoundedIcon />}
              title="No health moments yet"
            />
          </Grid>
        </Grid>

        <AppCard sx={{ p: 3 }}>
          <Stack direction="row" spacing={1.5}>
            <AccessTimeRoundedIcon color="primary" />
            <Stack spacing={0.5}>
              <Typography variant="subtitle1">Next move</Typography>
              <Typography color="text.secondary">
                Feature screens can now build on shared tokens and wrappers instead of inventing UI
                from scratch.
              </Typography>
            </Stack>
          </Stack>
        </AppCard>
      </Stack>
    </AppShell>
  );
}
