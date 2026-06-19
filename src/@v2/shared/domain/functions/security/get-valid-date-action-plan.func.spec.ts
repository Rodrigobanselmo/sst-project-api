import { describe, expect, it } from '@jest/globals';

import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';
import { getValidDateActionPlan } from './get-valid-date-action-plan.func';

const validityStart = new Date('2025-12-01T00:00:00.000Z');
const periods = {
  monthsLevel_2: 24,
  monthsLevel_3: 12,
  monthsLevel_4: 6,
  monthsLevel_5: 3,
};

const params = { validityStart, periods, endDate: null as Date | null };

describe('getValidDateActionPlan', () => {
  it('level 1 uses monthsLevel_2', () => {
    const result = getValidDateActionPlan({ ...params, level: 1 });
    expect(result?.getTime()).toBe(dateUtils(validityStart).addMonths(periods.monthsLevel_2).getTime());
  });

  it('level 2 uses monthsLevel_2', () => {
    const result = getValidDateActionPlan({ ...params, level: 2 });
    expect(result?.getTime()).toBe(dateUtils(validityStart).addMonths(periods.monthsLevel_2).getTime());
  });

  it('level 1 and level 2 produce the same due date', () => {
    const level1 = getValidDateActionPlan({ ...params, level: 1 });
    const level2 = getValidDateActionPlan({ ...params, level: 2 });
    expect(level1?.getTime()).toBe(level2?.getTime());
  });

  it('level 3 uses monthsLevel_3', () => {
    const result = getValidDateActionPlan({ ...params, level: 3 });
    expect(result?.getTime()).toBe(dateUtils(validityStart).addMonths(periods.monthsLevel_3).getTime());
  });

  it('level 4 uses monthsLevel_4', () => {
    const result = getValidDateActionPlan({ ...params, level: 4 });
    expect(result?.getTime()).toBe(dateUtils(validityStart).addMonths(periods.monthsLevel_4).getTime());
  });

  it('level 5 uses monthsLevel_5', () => {
    const result = getValidDateActionPlan({ ...params, level: 5 });
    expect(result?.getTime()).toBe(dateUtils(validityStart).addMonths(periods.monthsLevel_5).getTime());
  });

  it('level 6 returns validityStart', () => {
    const result = getValidDateActionPlan({ ...params, level: 6 });
    expect(result?.getTime()).toBe(validityStart.getTime());
  });

  it('returns null without validityStart', () => {
    expect(getValidDateActionPlan({ ...params, level: 1, validityStart: null })).toBeNull();
  });

  it('manual endDate takes priority', () => {
    const endDate = new Date('2026-01-15T00:00:00.000Z');
    expect(getValidDateActionPlan({ ...params, level: 1, endDate })?.getTime()).toBe(endDate.getTime());
  });
});
