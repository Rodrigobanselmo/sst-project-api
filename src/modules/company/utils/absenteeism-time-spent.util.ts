import { DateUnitEnum } from '@prisma/client';
import { Dayjs } from 'dayjs';

const MINUTES_PER_DAY = 24 * 60;

export function calcAbsenteeismTimeSpent(
  startDate: Dayjs,
  endDate: Dayjs,
  timeUnit?: DateUnitEnum,
): number {
  let timeSpent = startDate.diff(endDate, 'minutes');

  if (
    timeUnit === DateUnitEnum.DAY &&
    startDate.startOf('day').isSame(endDate.startOf('day'))
  ) {
    timeSpent = -MINUTES_PER_DAY;
  }

  return timeSpent;
}
