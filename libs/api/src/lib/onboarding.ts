import type { User } from '@supabase/supabase-js'

import { supabase } from './supabase'

export const SUPPORTED_ONBOARDING_PHASES = ['pre-pregnancy'] as const

export type OnboardingPhase = (typeof SUPPORTED_ONBOARDING_PHASES)[number]

export type OnboardingProfile = {
  selectedPhase: OnboardingPhase | null
  onboardingCompleted: boolean
  onboardingCompletedAt: string | null
  displayName: string | null
  birthDate: string | null
  cycleLengthDays: number | null
  lastPeriodStartDate: string | null
  heightCm: number | null
  weightKg: number | null
}

const createDefaultOnboardingProfile = (): OnboardingProfile => ({
  selectedPhase: null,
  onboardingCompleted: false,
  onboardingCompletedAt: null,
  displayName: null,
  birthDate: null,
  cycleLengthDays: null,
  lastPeriodStartDate: null,
  heightCm: null,
  weightKg: null,
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isOnboardingPhase = (value: unknown): value is OnboardingPhase =>
  typeof value === 'string' && (SUPPORTED_ONBOARDING_PHASES as readonly string[]).includes(value)

const getStringValue = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmedValue = value.trim()

  return trimmedValue ? trimmedValue : null
}

const getBooleanValue = (value: unknown): boolean => typeof value === 'boolean' && value

const getNullableNumberValue = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim()) {
    const parsedValue = Number(value)

    return Number.isFinite(parsedValue) ? parsedValue : null
  }

  return null
}

const getOnboardingMetadata = (user: User | null): Record<string, unknown> =>
  isRecord(user?.user_metadata) ? user.user_metadata : {}

const toOnboardingProfile = (metadata: Record<string, unknown>): OnboardingProfile => ({
  ...createDefaultOnboardingProfile(),
  selectedPhase: isOnboardingPhase(metadata.selectedPhase) ? metadata.selectedPhase : null,
  onboardingCompleted: getBooleanValue(metadata.onboardingCompleted),
  onboardingCompletedAt: getStringValue(metadata.onboardingCompletedAt),
  displayName: getStringValue(metadata.displayName),
  birthDate: getStringValue(metadata.birthDate),
  cycleLengthDays: getNullableNumberValue(metadata.cycleLengthDays),
  lastPeriodStartDate: getStringValue(metadata.lastPeriodStartDate),
  heightCm: getNullableNumberValue(metadata.heightCm),
  weightKg: getNullableNumberValue(metadata.weightKg),
})

const pickOnboardingPatch = (patch: Partial<OnboardingProfile>): Record<string, unknown> => {
  const entries = Object.entries(patch).filter(([, value]) => value !== undefined)

  return Object.fromEntries(entries)
}

export const getOnboardingProfileFromUser = (user: User | null): OnboardingProfile =>
  toOnboardingProfile(getOnboardingMetadata(user))

export const updateOnboardingProfile = async (user: User, patch: Partial<OnboardingProfile>) => {
  const metadata = getOnboardingMetadata(user)
  const onboardingPatch = pickOnboardingPatch(patch)

  return supabase.auth.updateUser({
    data: {
      ...metadata,
      ...onboardingPatch,
    },
  })
}

export const completeOnboarding = async (user: User) =>
  updateOnboardingProfile(user, {
    onboardingCompleted: true,
    onboardingCompletedAt: new Date().toISOString(),
  })
