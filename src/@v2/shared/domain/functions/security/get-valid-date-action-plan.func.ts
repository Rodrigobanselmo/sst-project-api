import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';

interface IValidDateParams {
  level: number | null;
  endDate: Date | null;
  validityStart: Date | null;
  periods: {
    monthsLevel_2: number;
    monthsLevel_3: number;
    monthsLevel_4: number;
    monthsLevel_5: number;
  };
}

type IValidDateResponse = Date | null;

export const getValidDateActionPlan = ({ endDate, level, periods, validityStart }: IValidDateParams): IValidDateResponse => {
  if (endDate) return endDate;
  if (!validityStart) return null;

  if (level == 2) return dateUtils(validityStart).addMonths(periods.monthsLevel_2);
  if (level == 3) return dateUtils(validityStart).addMonths(periods.monthsLevel_3);
  if (level == 4) return dateUtils(validityStart).addMonths(periods.monthsLevel_4);
  if (level == 5) return dateUtils(validityStart).addMonths(periods.monthsLevel_5);
  if (level == 6) return validityStart;

  return null;
};
