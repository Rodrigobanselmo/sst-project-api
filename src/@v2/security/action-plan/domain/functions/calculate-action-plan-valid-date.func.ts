import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';

export const calculateActionPlanValidDate = (data: {
  level: number | null;
  validDate: Date | null;
  monthsPeriodLevel_2: number;
  monthsPeriodLevel_3: number;
  monthsPeriodLevel_4: number;
  monthsPeriodLevel_5: number;
  validityStart: Date | null;
}): Date | null => {
  if (data.validDate) return data.validDate;
  if (!data.level) return null;
  if (!data.validityStart) return null;

  if (data.level === 2) return dateUtils(data.validityStart).addMonths(data.monthsPeriodLevel_2);
  if (data.level === 3) return dateUtils(data.validityStart).addMonths(data.monthsPeriodLevel_3);
  if (data.level === 4) return dateUtils(data.validityStart).addMonths(data.monthsPeriodLevel_4);
  if (data.level === 5) return dateUtils(data.validityStart).addMonths(data.monthsPeriodLevel_5);

  return null;
};
