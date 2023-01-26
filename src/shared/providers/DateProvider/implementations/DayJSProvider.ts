import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IDateProvider, ManipulateType } from '../models/IDateProvider.types';

dayjs.locale('pt-br');
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(utc);
dayjs.extend(timezone);
class DayJSProvider implements IDateProvider {
  dayjs = dayjs;

  addSeconds(date: Date, seconds: number): Date {
    return dayjs(date).add(seconds, 'seconds').toDate();
  }

  addHours(date: Date, hours: number): Date {
    return dayjs(date).add(hours, 'hours').toDate();
  }

  addDay(date: Date, days: number): Date {
    return dayjs(date).add(days, 'days').toDate();
  }

  addTime(date: Date, value: number, type: ManipulateType): Date {
    return dayjs(date).add(value, type).toDate();
  }

  onlyDate(date: Date): Date {
    return dayjs(date).set('h', 0).set('m', 0).set('s', 0).set('ms', 0).toDate();
  }

  compareIfBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(start_date).isBefore(end_date);
  }

  compareTime(start_date: Date, end_date: Date, compareIn: ManipulateType): number {
    const endDateFormat = this.convertToUTC(end_date);
    const startDateFormat = this.convertToUTC(start_date);
    return dayjs(endDateFormat).diff(startDateFormat, compareIn);
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  dateNow(): Date {
    return dayjs().toDate();
  }

  format(date: Date, format?: string): string {
    return dayjs(date).format(format || 'DD/MM/YYYY');
  }
}

export { DayJSProvider, dayjs };
