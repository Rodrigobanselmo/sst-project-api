import { getValidDateActionPlan } from '@/@v2/shared/domain/functions/security/get-valid-date-action-plan.func';

export const calculateActionPlanValidDate = (data: {
  level: number | null;
  validDate: Date | null;
  monthsPeriodLevel_2: number;
  monthsPeriodLevel_3: number;
  monthsPeriodLevel_4: number;
  monthsPeriodLevel_5: number;
  validityStart: Date | null;
}): Date | null =>
  getValidDateActionPlan({
    endDate: data.validDate,
    level: data.level,
    validityStart: data.validityStart,
    periods: {
      monthsLevel_2: data.monthsPeriodLevel_2,
      monthsLevel_3: data.monthsPeriodLevel_3,
      monthsLevel_4: data.monthsPeriodLevel_4,
      monthsLevel_5: data.monthsPeriodLevel_5,
    },
  });
