import { DateTime } from 'npm:luxon@3.7.2';
import type { SupabaseClient, User } from 'npm:@supabase/supabase-js@2';

import type { AnthropicToolResultBlock, AnthropicToolUseBlock, Json } from './types.ts';

type MedicationDoseRow = {
  id: string;
  time_of_day: string;
  sort_order: number;
};

type MedicationRow = {
  id: string;
  name: string;
  dosage: string | null;
  notes: string | null;
  schedule_type: 'daily' | 'course';
  course_start_date: string | null;
  course_duration_days: number | null;
  active: boolean;
  medication_doses: MedicationDoseRow[] | null;
};

type DoseLogRow = {
  dose_id: string;
  date: string;
  taken_at: string;
};

type DailyLogRow = {
  date: string;
  bbt_celsius: number | null;
  mood: string | null;
  weight_kg: number | null;
};

const MEDICATION_COLUMNS =
  'id, name, dosage, notes, schedule_type, course_start_date, course_duration_days, active, medication_doses(id, time_of_day, sort_order)';

const TOOL_DEFINITIONS = [
  {
    name: 'get_profile',
    description: 'Đọc hồ sơ cá nhân, chu kỳ, cơ thể và thông tin liên hệ khẩn cấp của người dùng.',
    input_schema: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    cache_control: {
      type: 'ephemeral',
    },
  },
  {
    name: 'get_medications',
    description: 'Lấy danh sách thuốc hiện có cùng lịch uống và trạng thái active.',
    input_schema: {
      type: 'object',
      properties: {
        active_only: {
          type: 'boolean',
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: 'get_medication_adherence',
    description: 'Tính tỷ lệ tuân thủ uống thuốc trong N ngày gần đây dựa trên dose logs.',
    input_schema: {
      type: 'object',
      properties: {
        days: {
          type: 'integer',
          minimum: 1,
          maximum: 30,
        },
      },
      required: ['days'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_daily_logs',
    description: 'Lấy daily logs theo khoảng ngày. Metric hiện có: bbt_celsius, mood, weight_kg.',
    input_schema: {
      type: 'object',
      properties: {
        from_date: {
          type: 'string',
          description: 'Ngày bắt đầu theo ISO date YYYY-MM-DD',
        },
        to_date: {
          type: 'string',
          description: 'Ngày kết thúc theo ISO date YYYY-MM-DD',
        },
        metrics: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['bbt_celsius', 'mood', 'weight_kg'],
          },
        },
      },
      required: ['from_date', 'to_date'],
      additionalProperties: false,
    },
  },
  {
    name: 'get_log_summary',
    description: 'Tóm tắt thống kê daily logs trong N ngày gần đây.',
    input_schema: {
      type: 'object',
      properties: {
        days: {
          type: 'integer',
          minimum: 1,
          maximum: 30,
        },
      },
      required: ['days'],
      additionalProperties: false,
    },
  },
] as const;

const extractMetadata = (user: User) => {
  const metadata =
    typeof user.user_metadata === 'object' && user.user_metadata !== null ? user.user_metadata : {};

  return metadata as Record<string, unknown>;
};

const getStringValue = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const getNumberValue = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const calculateAge = (birthDate: string | null) => {
  if (!birthDate) {
    return null;
  }

  const birth = DateTime.fromISO(birthDate);

  if (!birth.isValid) {
    return null;
  }

  return Math.max(0, Math.floor(DateTime.now().diff(birth, 'years').years));
};

const isMedicationEligibleForDate = (medication: MedicationRow, date: string) => {
  if (!medication.active) {
    return false;
  }

  if (medication.schedule_type === 'daily') {
    return true;
  }

  if (!medication.course_start_date || !medication.course_duration_days) {
    return false;
  }

  const targetDate = DateTime.fromISO(date).startOf('day');
  const startDate = DateTime.fromISO(medication.course_start_date).startOf('day');

  if (!targetDate.isValid || !startDate.isValid) {
    return false;
  }

  return (
    targetDate >= startDate &&
    targetDate < startDate.plus({ days: medication.course_duration_days })
  );
};

const serializeToolContent = (payload: Json) => JSON.stringify(payload, null, 2);

const clampArray = <T>(items: T[], limit = 100) =>
  items.length > limit ? items.slice(items.length - limit) : items;

const loadMedications = async (supabase: SupabaseClient, activeOnly = false) => {
  const query = supabase
    .from('medications')
    .select(MEDICATION_COLUMNS)
    .order('created_at', { ascending: false });

  const { data, error } = await (activeOnly ? query.eq('active', true) : query).returns<
    MedicationRow[]
  >();

  if (error) {
    throw error;
  }

  return data ?? [];
};

const loadDailyLogs = async (supabase: SupabaseClient, fromDate: string, toDate: string) => {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('date, bbt_celsius, mood, weight_kg')
    .gte('date', fromDate)
    .lte('date', toDate)
    .order('date', { ascending: true })
    .returns<DailyLogRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
};

const loadDoseLogs = async (supabase: SupabaseClient, fromDate: string, toDate: string) => {
  const { data, error } = await supabase
    .from('dose_logs')
    .select('dose_id, date, taken_at')
    .gte('date', fromDate)
    .lte('date', toDate)
    .returns<DoseLogRow[]>();

  if (error) {
    throw error;
  }

  return data ?? [];
};

const getProfileResult = (user: User) => {
  const metadata = extractMetadata(user);
  const displayName = getStringValue(metadata.displayName);
  const birthDate = getStringValue(metadata.birthDate);
  const cycleLengthDays = getNumberValue(metadata.cycleLengthDays);
  const lastPeriodStartDate = getStringValue(metadata.lastPeriodStartDate);
  const heightCm = getNumberValue(metadata.heightCm);
  const weightKg = getNumberValue(metadata.weightKg);
  const emergencyContactName = getStringValue(metadata.emergencyContactName);
  const emergencyContactPhone = getStringValue(metadata.emergencyContactPhone);

  return {
    display_name: displayName,
    age_years: calculateAge(birthDate),
    birth_date: birthDate,
    selected_phase: getStringValue(metadata.selectedPhase),
    cycle_length_days: cycleLengthDays,
    last_period_start_date: lastPeriodStartDate,
    height_cm: heightCm,
    weight_kg: weightKg,
    emergency_contact:
      emergencyContactName || emergencyContactPhone
        ? {
            name: emergencyContactName,
            phone: emergencyContactPhone,
          }
        : null,
    available_health_data: ['bbt_celsius', 'mood', 'weight_kg'],
  } satisfies Json;
};

const getMedicationsResult = async (supabase: SupabaseClient, input: Record<string, unknown>) => {
  const medications = await loadMedications(supabase, input.active_only === true);

  return clampArray(
    medications.map((medication) => ({
      id: medication.id,
      name: medication.name,
      dosage: medication.dosage,
      notes: medication.notes,
      schedule_type: medication.schedule_type,
      course_start_date: medication.course_start_date,
      course_duration_days: medication.course_duration_days,
      active: medication.active,
      doses: (medication.medication_doses ?? [])
        .slice()
        .sort((left, right) => left.sort_order - right.sort_order)
        .map((dose) => ({
          id: dose.id,
          time_of_day: dose.time_of_day.slice(0, 5),
        })),
    })),
  ) satisfies Json;
};

const getMedicationAdherenceResult = async (
  supabase: SupabaseClient,
  input: Record<string, unknown>,
) => {
  const days = typeof input.days === 'number' && Number.isFinite(input.days) ? input.days : 7;
  const today = DateTime.now().startOf('day');
  const fromDate = today.minus({ days: days - 1 }).toISODate()!;
  const toDate = today.toISODate()!;

  const [medications, doseLogs] = await Promise.all([
    loadMedications(supabase, true),
    loadDoseLogs(supabase, fromDate, toDate),
  ]);

  let expectedDoses = 0;
  const takenDoseKeys = new Set(doseLogs.map((log) => `${log.dose_id}:${log.date}`));

  const byMedication = medications.map((medication) => {
    let medicationExpected = 0;
    let medicationTaken = 0;

    for (let index = 0; index < days; index += 1) {
      const date = today.minus({ days: days - index - 1 }).toISODate()!;

      if (!isMedicationEligibleForDate(medication, date)) {
        continue;
      }

      const doses = medication.medication_doses ?? [];
      medicationExpected += doses.length;

      doses.forEach((dose) => {
        if (takenDoseKeys.has(`${dose.id}:${date}`)) {
          medicationTaken += 1;
        }
      });
    }

    expectedDoses += medicationExpected;

    return {
      medication_id: medication.id,
      medication_name: medication.name,
      expected_doses: medicationExpected,
      taken_doses: medicationTaken,
      adherence_percent:
        medicationExpected > 0 ? Math.round((medicationTaken / medicationExpected) * 100) : null,
    };
  });

  const takenDoses = byMedication.reduce((sum, medication) => sum + medication.taken_doses, 0);

  return {
    days,
    from_date: fromDate,
    to_date: toDate,
    expected_doses: expectedDoses,
    taken_doses: takenDoses,
    adherence_percent: expectedDoses > 0 ? Math.round((takenDoses / expectedDoses) * 100) : null,
    medications: byMedication,
  } satisfies Json;
};

const getDailyLogsResult = async (supabase: SupabaseClient, input: Record<string, unknown>) => {
  const fromDate = typeof input.from_date === 'string' ? input.from_date : null;
  const toDate = typeof input.to_date === 'string' ? input.to_date : null;

  if (!fromDate || !toDate) {
    throw new Error('from_date và to_date là bắt buộc.');
  }

  const requestedMetrics = Array.isArray(input.metrics)
    ? input.metrics.filter(
        (value): value is 'bbt_celsius' | 'mood' | 'weight_kg' =>
          value === 'bbt_celsius' || value === 'mood' || value === 'weight_kg',
      )
    : null;

  const dailyLogs = await loadDailyLogs(supabase, fromDate, toDate);

  return clampArray(
    dailyLogs.map((log) => {
      const record: Record<string, Json> = {
        date: log.date,
      };

      const includeMetric = (metric: 'bbt_celsius' | 'mood' | 'weight_kg') =>
        !requestedMetrics || requestedMetrics.includes(metric);

      if (includeMetric('bbt_celsius')) {
        record.bbt_celsius = log.bbt_celsius;
      }

      if (includeMetric('mood')) {
        record.mood = log.mood;
      }

      if (includeMetric('weight_kg')) {
        record.weight_kg = log.weight_kg;
      }

      return record;
    }),
  ) satisfies Json;
};

const buildNumericSummary = (values: number[]) => {
  if (values.length === 0) {
    return null;
  }

  const first = values[0];
  const last = values[values.length - 1];
  const trend = last > first ? 'up' : last < first ? 'down' : 'flat';

  return {
    avg: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2)),
    min: Math.min(...values),
    max: Math.max(...values),
    trend,
  };
};

const getLogSummaryResult = async (supabase: SupabaseClient, input: Record<string, unknown>) => {
  const days = typeof input.days === 'number' && Number.isFinite(input.days) ? input.days : 7;
  const today = DateTime.now().startOf('day');
  const fromDate = today.minus({ days: days - 1 }).toISODate()!;
  const toDate = today.toISODate()!;
  const dailyLogs = await loadDailyLogs(supabase, fromDate, toDate);

  const bbtValues = dailyLogs
    .map((log) => log.bbt_celsius)
    .filter((value): value is number => typeof value === 'number');
  const weightValues = dailyLogs
    .map((log) => log.weight_kg)
    .filter((value): value is number => typeof value === 'number');
  const moodCounts = dailyLogs.reduce<Record<string, number>>((accumulator, log) => {
    if (!log.mood) {
      return accumulator;
    }

    accumulator[log.mood] = (accumulator[log.mood] ?? 0) + 1;
    return accumulator;
  }, {});

  return {
    days,
    from_date: fromDate,
    to_date: toDate,
    total_logs: dailyLogs.length,
    summaries: {
      bbt_celsius: buildNumericSummary(bbtValues),
      weight_kg: buildNumericSummary(weightValues),
      mood: moodCounts,
    },
  } satisfies Json;
};

const runTool = async (
  supabase: SupabaseClient,
  user: User,
  toolCall: AnthropicToolUseBlock,
): Promise<Json> => {
  switch (toolCall.name) {
    case 'get_profile':
      return getProfileResult(user);
    case 'get_medications':
      return getMedicationsResult(supabase, toolCall.input);
    case 'get_medication_adherence':
      return getMedicationAdherenceResult(supabase, toolCall.input);
    case 'get_daily_logs':
      return getDailyLogsResult(supabase, toolCall.input);
    case 'get_log_summary':
      return getLogSummaryResult(supabase, toolCall.input);
    default:
      throw new Error(`Tool không được hỗ trợ: ${toolCall.name}`);
  }
};

export const chatToolDefinitions = TOOL_DEFINITIONS;

export const executeToolCalls = async (
  supabase: SupabaseClient,
  user: User,
  toolCalls: AnthropicToolUseBlock[],
): Promise<AnthropicToolResultBlock[]> =>
  Promise.all(
    toolCalls.map(async (toolCall) => {
      try {
        const result = await runTool(supabase, user, toolCall);

        return {
          type: 'tool_result',
          tool_use_id: toolCall.id,
          content: serializeToolContent(result),
        } satisfies AnthropicToolResultBlock;
      } catch (error) {
        return {
          type: 'tool_result',
          tool_use_id: toolCall.id,
          content: error instanceof Error ? error.message : 'Tool execution failed.',
          is_error: true,
        } satisfies AnthropicToolResultBlock;
      }
    }),
  );
