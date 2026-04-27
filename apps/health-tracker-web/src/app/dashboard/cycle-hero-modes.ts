import type { CycleSnapshot } from './cycle-utils';

export type CycleHeroMode = 'nudge' | 'predict' | 'overdue' | 'stale';

export function deriveCycleHeroMode(snapshot: CycleSnapshot | null): CycleHeroMode {
  if (snapshot === null) {
    return 'nudge';
  }

  if (snapshot.isStale) {
    return 'stale';
  }

  if (snapshot.isOverdue) {
    return 'overdue';
  }

  return 'predict';
}
