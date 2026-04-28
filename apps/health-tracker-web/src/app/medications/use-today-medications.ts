import { DateTime } from 'luxon';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  listDoseLogs,
  listMedications,
  logDose,
  unlogDose,
  type DoseLog,
  type Medication,
} from '@health-tracker/api';

import { medicationsQueryKey } from './use-medications';

export type TodayDose = {
  medicationId: string;
  medicationName: string;
  dosage: string | null;
  notes: string | null;
  doseId: string;
  timeOfDay: string;
  taken: boolean;
  takenAt: string | null;
};

export const doseLogsQueryKey = (userId: string | undefined, date: string) =>
  ['dose-logs', userId, date] as const;

const isMedicationEligibleForDate = (medication: Medication, date: string) => {
  if (!medication.active) {
    return false;
  }

  if (medication.scheduleType === 'daily') {
    return true;
  }

  if (!medication.courseStartDate || !medication.courseDurationDays) {
    return false;
  }

  const targetDate = DateTime.fromISO(date).startOf('day');
  const startDate = DateTime.fromISO(medication.courseStartDate).startOf('day');

  if (!targetDate.isValid || !startDate.isValid) {
    return false;
  }

  const courseEndExclusive = startDate.plus({ days: medication.courseDurationDays });

  return targetDate >= startDate && targetDate < courseEndExclusive;
};

const buildTodayDoses = (medications: Medication[], logs: DoseLog[], date: string): TodayDose[] => {
  const logByDoseId = new Map(logs.map((log) => [log.doseId, log]));

  return medications
    .filter((medication) => isMedicationEligibleForDate(medication, date))
    .flatMap((medication) =>
      medication.doses.map((dose) => {
        const log = logByDoseId.get(dose.id);

        return {
          medicationId: medication.id,
          medicationName: medication.name,
          dosage: medication.dosage,
          notes: medication.notes,
          doseId: dose.id,
          timeOfDay: dose.timeOfDay,
          taken: Boolean(log),
          takenAt: log?.takenAt ?? null,
        } satisfies TodayDose;
      }),
    )
    .sort((a, b) => a.timeOfDay.localeCompare(b.timeOfDay));
};

export const useTodayMedications = (userId: string | undefined, date: string) => {
  const queryClient = useQueryClient();

  const { data: medications, isLoading: isLoadingMedications } = useQuery({
    queryKey: medicationsQueryKey(userId),
    queryFn: () => listMedications(userId!),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: doseLogs, isLoading: isLoadingDoseLogs } = useQuery({
    queryKey: doseLogsQueryKey(userId, date),
    queryFn: () => listDoseLogs(userId!, date),
    enabled: Boolean(userId),
    staleTime: 60 * 60 * 1000,
  });

  const logDoseMutation = useMutation({
    mutationFn: (doseId: string) => logDose(userId!, doseId, date),
    onMutate: async (doseId) => {
      const key = doseLogsQueryKey(userId, date);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<DoseLog[]>(key) ?? [];

      const optimistic: DoseLog = {
        id: `optimistic-${doseId}`,
        doseId,
        date,
        takenAt: new Date().toISOString(),
      };

      const nextLogs = previous.filter((log) => log.doseId !== doseId).concat(optimistic);
      queryClient.setQueryData(key, nextLogs);

      return { previous };
    },
    onError: (_error, _doseId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(doseLogsQueryKey(userId, date), context.previous);
      }
    },
    onSuccess: (saved) => {
      queryClient.setQueryData<DoseLog[]>(doseLogsQueryKey(userId, date), (prev) => {
        const current = prev ?? [];
        return current.filter((log) => log.doseId !== saved.doseId).concat(saved);
      });
    },
  });

  const unlogDoseMutation = useMutation({
    mutationFn: (doseId: string) => unlogDose(userId!, doseId, date),
    onMutate: async (doseId) => {
      const key = doseLogsQueryKey(userId, date);
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<DoseLog[]>(key) ?? [];
      queryClient.setQueryData(
        key,
        previous.filter((log) => log.doseId !== doseId),
      );

      return { previous };
    },
    onError: (_error, _doseId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(doseLogsQueryKey(userId, date), context.previous);
      }
    },
  });

  const todayDoses = buildTodayDoses(medications ?? [], doseLogs ?? [], date);

  return {
    todayDoses,
    isLoading: isLoadingMedications || isLoadingDoseLogs,
    takenCount: todayDoses.filter((dose) => dose.taken).length,
    totalCount: todayDoses.length,
    logDose: logDoseMutation.mutateAsync,
    unlogDose: unlogDoseMutation.mutateAsync,
    isToggling: logDoseMutation.isPending || unlogDoseMutation.isPending,
    error: (logDoseMutation.error || unlogDoseMutation.error) as Error | null,
    resetError: () => {
      logDoseMutation.reset();
      unlogDoseMutation.reset();
    },
  };
};
