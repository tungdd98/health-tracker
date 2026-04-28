import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createMedication,
  deleteMedication,
  getMedication,
  listMedications,
  updateMedication,
  type Medication,
  type MedicationDraft,
} from '@health-tracker/api';

export const medicationsQueryKey = (userId: string | undefined) => ['medications', userId] as const;
export const medicationQueryKey = (id: string | undefined) => ['medication', id] as const;

export const useMedications = (userId: string | undefined) =>
  useQuery({
    queryKey: medicationsQueryKey(userId),
    queryFn: () => listMedications(userId!),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

export const useMedication = (id: string | undefined) =>
  useQuery({
    queryKey: medicationQueryKey(id),
    queryFn: () => getMedication(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });

export const useCreateMedicationMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (draft: MedicationDraft) => createMedication(userId!, draft),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: medicationsQueryKey(userId) });
      queryClient.setQueryData(medicationQueryKey(created.id), created);
    },
  });
};

export const useUpdateMedicationMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ draft, id }: { id: string; draft: MedicationDraft }) =>
      updateMedication(id, draft),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: medicationsQueryKey(userId) });
      queryClient.setQueryData(medicationQueryKey(updated.id), updated);
    },
  });
};

export const useDeleteMedicationMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteMedication(id);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: medicationsQueryKey(userId) });
      queryClient.removeQueries({ queryKey: medicationQueryKey(deletedId) });
    },
  });
};

export const useToggleMedicationActiveMutation = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ active, medication }: { active: boolean; medication: Medication }) =>
      updateMedication(medication.id, {
        name: medication.name,
        dosage: medication.dosage,
        notes: medication.notes,
        scheduleType: medication.scheduleType,
        courseStartDate: medication.courseStartDate,
        courseDurationDays: medication.courseDurationDays,
        active,
        doses: medication.doses.map((dose) => ({ timeOfDay: dose.timeOfDay })),
      }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: medicationsQueryKey(userId) });
      queryClient.setQueryData(medicationQueryKey(updated.id), updated);
    },
  });
};
