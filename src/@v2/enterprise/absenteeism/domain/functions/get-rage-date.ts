import { dateUtils } from '@/@v2/shared/utils/helpers/date-utils';

export function gerRageDate(filters: { startDate?: Date; endDate?: Date }, options?: { addYear: number }) {
  let effectiveStartDate: Date;
  let effectiveEndDate: Date;

  const now = new Date();
  const { startDate, endDate } = filters;

  if (startDate && endDate) {
    // Case 1: Both startDate and endDate are provided
    effectiveStartDate = startDate;
    effectiveEndDate = endDate;
  } else if (startDate && !endDate) {
    // Case 2: Only startDate is provided, endDate is undefined
    // endDate will be 1 year from startDate
    effectiveStartDate = startDate;
    effectiveEndDate = dateUtils(startDate).addTime(options?.addYear || 3, 'year');
  } else if (!startDate && endDate) {
    // Case 3: Only endDate is provided, startDate is undefined
    // startDate will be 1 year before endDate
    effectiveEndDate = endDate;
    effectiveStartDate = dateUtils(endDate).addTime(-(options?.addYear || 3), 'year');
  } else {
    // Case 4: Both startDate and endDate are undefined
    // Get one year range from now (now - 1 year to now)
    effectiveEndDate = now;
    effectiveStartDate = dateUtils(now).addTime(-(options?.addYear || 3), 'year');
  }

  return { startDate: effectiveStartDate, endDate: effectiveEndDate };
}
