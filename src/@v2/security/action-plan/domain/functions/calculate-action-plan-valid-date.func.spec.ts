import { describe, expect, it } from '@jest/globals';

import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import { calculateActionPlanValidDate } from './calculate-action-plan-valid-date.func';

const validityStart = new Date('2025-12-01T00:00:00.000Z');

describe('calculateActionPlanValidDate', () => {
  it('delegates level 1 to monthsPeriodLevel_2', () => {
    const result = calculateActionPlanValidDate({
      level: 1,
      validDate: null,
      validityStart,
      monthsPeriodLevel_2: 24,
      monthsPeriodLevel_3: 12,
      monthsPeriodLevel_4: 6,
      monthsPeriodLevel_5: 3,
    });

    expect(result?.getTime()).toBe(dateUtils(validityStart).addMonths(24).getTime());
  });

  it('manual validDate takes priority', () => {
    const validDate = new Date('2026-02-01T00:00:00.000Z');
    expect(
      calculateActionPlanValidDate({
        level: 1,
        validDate,
        validityStart,
        monthsPeriodLevel_2: 24,
        monthsPeriodLevel_3: 12,
        monthsPeriodLevel_4: 6,
        monthsPeriodLevel_5: 3,
      })?.toISOString(),
    ).toBe(validDate.toISOString());
  });
});
