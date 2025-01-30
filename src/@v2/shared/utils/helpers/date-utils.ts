import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.locale('pt-br');
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

type UnitTypeShort = 'd' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms' | 'w';

type UnitTypeLong = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year' | 'week';

type UnitTypeLongPlural = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'months' | 'years' | 'weeks';

export type ManipulateType = UnitTypeLong | UnitTypeLongPlural | UnitTypeShort;

class DateUtils extends Date {
  constructor(date: Date | string | number = new Date()) {
    super(date);
  }

  static builder(date = new Date()) {
    return new DateUtils(date);
  }

  format(template: string) {
    return dayjs(this).format(template);
  }

  addMonths(months: number) {
    return dayjs(this).add(months, 'month').toDate();
  }

  addTime(value: number, type: ManipulateType): Date {
    return dayjs(this).add(value, type).toDate();
  }
}

export const dateUtils = (date?: Date) => {
  return DateUtils.builder(date);
};
