import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { IDateProvider } from '../models/IDateProvider';

dayjs.extend(utc);

class DayJSProvider implements IDateProvider {
  addSeconds(date: Date, seconds: number): Date {
    return dayjs(date).add(seconds, 'seconds').toDate();
  }

  addHours(date: Date, hours: number): Date {
    return dayjs(date).add(hours, 'hours').toDate();
  }
  addDay(date: Date, days: number): Date {
    return dayjs(date).add(days, 'days').toDate();
  }

  compareIfBefore(start_date: Date, end_date: Date): boolean {
    return dayjs(start_date).isBefore(end_date);
  }

  compareInHours(start_date: Date, end_date: Date): number {
    const endDateFormat = this.convertToUTC(end_date);
    const startDateFormat = this.convertToUTC(start_date);
    return dayjs(endDateFormat).diff(startDateFormat, 'hours');
  }

  compareInDays(start_date: Date, end_date: Date): number {
    const endDateFormat = this.convertToUTC(end_date);
    const startDateFormat = this.convertToUTC(start_date);
    return dayjs(endDateFormat).diff(startDateFormat, 'days');
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  dateNow(): Date {
    return dayjs().toDate();
  }
}

export { DayJSProvider };
