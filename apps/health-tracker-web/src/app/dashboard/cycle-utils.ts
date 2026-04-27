import { DateTime } from 'luxon';

export const PERIOD_LENGTH_DAYS = 5;
export const LUTEAL_LENGTH_DAYS = 14;
export const FERTILE_WINDOW_BEFORE_OVULATION = 5;
export const FERTILE_WINDOW_AFTER_OVULATION = 1;

export type CyclePhase = 'menstrual' | 'follicular' | 'fertile' | 'luteal';

export type CycleSnapshot = {
  dayOfCycle: number;
  phase: CyclePhase;
  isOvulationDay: boolean;
  isFertileWindow: boolean;
  daysSinceLastPeriod: number;
  daysUntilNextPeriod: number;
  daysUntilFertileEnd: number | null;
  daysUntilFertileStart: number | null;
  isOverdue: boolean;
  isStale: boolean;
};

export const PHASE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'Kỳ kinh',
  follicular: 'Tiền rụng trứng',
  fertile: 'Cửa sổ thụ thai',
  luteal: 'Hoàng thể',
};

export const PHASE_BADGE_LABELS: Record<CyclePhase, string> = {
  menstrual: 'KỲ KINH',
  follicular: 'TIỀN RỤNG TRỨNG',
  fertile: 'CỬA SỔ THỤ THAI',
  luteal: 'PHA HOÀNG THỂ',
};

export const VN_WEEKDAY_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const;

export const getWeekdayShort = (date: DateTime): string => VN_WEEKDAY_SHORT[date.weekday - 1];

type ComputeInput = {
  cycleLengthDays: number;
  lastPeriodStartDate: DateTime;
  targetDate: DateTime;
};

export function computeCycleSnapshot(input: ComputeInput): CycleSnapshot | null {
  const { cycleLengthDays, lastPeriodStartDate, targetDate } = input;

  const daysSinceLastPeriod = Math.floor(
    targetDate.startOf('day').diff(lastPeriodStartDate.startOf('day'), 'days').days,
  );

  if (daysSinceLastPeriod < 0) {
    return null;
  }

  const dayOfCycle = (daysSinceLastPeriod % cycleLengthDays) + 1;
  const ovulationDay = cycleLengthDays - LUTEAL_LENGTH_DAYS;
  const fertileStart = ovulationDay - FERTILE_WINDOW_BEFORE_OVULATION;
  const fertileEnd = ovulationDay + FERTILE_WINDOW_AFTER_OVULATION;

  let phase: CyclePhase;

  if (dayOfCycle <= PERIOD_LENGTH_DAYS) {
    phase = 'menstrual';
  } else if (dayOfCycle >= fertileStart && dayOfCycle <= fertileEnd) {
    phase = 'fertile';
  } else if (dayOfCycle < fertileStart) {
    phase = 'follicular';
  } else {
    phase = 'luteal';
  }

  const isFertileWindow = dayOfCycle >= fertileStart && dayOfCycle <= fertileEnd;
  const isOvulationDay = dayOfCycle === ovulationDay;
  const daysUntilNextPeriod = cycleLengthDays - dayOfCycle + 1;
  const daysUntilFertileEnd = isFertileWindow ? fertileEnd - dayOfCycle : null;
  const daysUntilFertileStart =
    !isFertileWindow && dayOfCycle < fertileStart ? fertileStart - dayOfCycle : null;
  const isOverdue = daysSinceLastPeriod >= cycleLengthDays - 2;
  const isStale = daysSinceLastPeriod > 2 * cycleLengthDays;

  return {
    dayOfCycle,
    phase,
    isOvulationDay,
    isFertileWindow,
    daysSinceLastPeriod,
    daysUntilNextPeriod,
    daysUntilFertileEnd,
    daysUntilFertileStart,
    isOverdue,
    isStale,
  };
}
