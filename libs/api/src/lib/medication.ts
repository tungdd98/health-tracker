import { supabase } from './supabase';

export type ScheduleType = 'daily' | 'course';

export type Dose = {
  id: string;
  timeOfDay: string;
  sortOrder: number;
};

export type Medication = {
  id: string;
  userId: string;
  name: string;
  dosage: string | null;
  notes: string | null;
  scheduleType: ScheduleType;
  courseStartDate: string | null;
  courseDurationDays: number | null;
  active: boolean;
  doses: Dose[];
};

export type MedicationDraft = {
  name: string;
  dosage?: string | null;
  notes?: string | null;
  scheduleType: ScheduleType;
  courseStartDate?: string | null;
  courseDurationDays?: number | null;
  active: boolean;
  doses: Array<{ timeOfDay: string }>;
};

export type DoseLog = {
  id: string;
  doseId: string;
  date: string;
  takenAt: string;
};

type MedicationDoseRow = {
  id: string;
  time_of_day: string;
  sort_order: number;
};

type MedicationRow = {
  id: string;
  user_id: string;
  name: string;
  dosage: string | null;
  notes: string | null;
  schedule_type: ScheduleType;
  course_start_date: string | null;
  course_duration_days: number | null;
  active: boolean;
  medication_doses: MedicationDoseRow[] | null;
};

type DoseLogRow = {
  id: string;
  dose_id: string;
  date: string;
  taken_at: string;
};

const MEDICATION_COLUMNS =
  'id, user_id, name, dosage, notes, schedule_type, course_start_date, course_duration_days, active, medication_doses(id, time_of_day, sort_order)';
const DOSE_LOG_COLUMNS = 'id, dose_id, date, taken_at';

const toDose = (row: MedicationDoseRow): Dose => ({
  id: row.id,
  timeOfDay: row.time_of_day.slice(0, 5),
  sortOrder: row.sort_order,
});

const toMedication = (row: MedicationRow): Medication => ({
  id: row.id,
  userId: row.user_id,
  name: row.name,
  dosage: row.dosage,
  notes: row.notes,
  scheduleType: row.schedule_type,
  courseStartDate: row.course_start_date,
  courseDurationDays: row.course_duration_days,
  active: row.active,
  doses: [...(row.medication_doses ?? [])]
    .sort((a, b) => {
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order;
      }

      return a.time_of_day.localeCompare(b.time_of_day);
    })
    .map(toDose),
});

const toDoseLog = (row: DoseLogRow): DoseLog => ({
  id: row.id,
  doseId: row.dose_id,
  date: row.date,
  takenAt: row.taken_at,
});

const toRpcPayload = (draft: MedicationDraft) => ({
  name: draft.name,
  dosage: draft.dosage ?? null,
  notes: draft.notes ?? null,
  schedule_type: draft.scheduleType,
  course_start_date: draft.courseStartDate ?? null,
  course_duration_days: draft.courseDurationDays ?? null,
  active: draft.active,
  doses: draft.doses.map((dose) => ({
    time_of_day: `${dose.timeOfDay}:00`,
  })),
});

export const listMedications = async (userId: string): Promise<Medication[]> => {
  const { data, error } = await supabase
    .from('medications')
    .select(MEDICATION_COLUMNS)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .returns<MedicationRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map(toMedication);
};

export const getMedication = async (id: string): Promise<Medication | null> => {
  const { data, error } = await supabase
    .from('medications')
    .select(MEDICATION_COLUMNS)
    .eq('id', id)
    .maybeSingle<MedicationRow>();

  if (error) {
    throw error;
  }

  return data ? toMedication(data) : null;
};

export const createMedication = async (
  userId: string,
  draft: MedicationDraft,
): Promise<Medication> => {
  const { data, error } = await supabase
    .rpc('create_medication_with_doses', {
      payload: toRpcPayload(draft),
    })
    .single<{ id: string }>();

  if (error) {
    throw error;
  }

  const created = await getMedication(data.id);

  if (created?.userId !== userId) {
    throw new Error('Không thể tải dữ liệu thuốc vừa tạo.');
  }

  return created;
};

export const updateMedication = async (id: string, draft: MedicationDraft): Promise<Medication> => {
  const { data, error } = await supabase
    .rpc('update_medication_with_doses', {
      target_id: id,
      payload: toRpcPayload(draft),
    })
    .single<{ id: string }>();

  if (error) {
    throw error;
  }

  const updated = await getMedication(data.id);

  if (!updated) {
    throw new Error('Không thể tải dữ liệu thuốc vừa cập nhật.');
  }

  return updated;
};

export const deleteMedication = async (id: string): Promise<void> => {
  const { error } = await supabase.from('medications').delete().eq('id', id);

  if (error) {
    throw error;
  }
};

export const listDoseLogs = async (userId: string, date: string): Promise<DoseLog[]> => {
  const { data, error } = await supabase
    .from('dose_logs')
    .select(DOSE_LOG_COLUMNS)
    .eq('user_id', userId)
    .eq('date', date)
    .returns<DoseLogRow[]>();

  if (error) {
    throw error;
  }

  return (data ?? []).map(toDoseLog);
};

export const logDose = async (userId: string, doseId: string, date: string): Promise<DoseLog> => {
  const payload = {
    user_id: userId,
    dose_id: doseId,
    date,
    taken_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('dose_logs')
    .upsert(payload, { onConflict: 'dose_id,date' })
    .select(DOSE_LOG_COLUMNS)
    .single<DoseLogRow>();

  if (error) {
    throw error;
  }

  return toDoseLog(data);
};

export const unlogDose = async (userId: string, doseId: string, date: string): Promise<void> => {
  const { error } = await supabase
    .from('dose_logs')
    .delete()
    .eq('user_id', userId)
    .eq('dose_id', doseId)
    .eq('date', date);

  if (error) {
    throw error;
  }
};
