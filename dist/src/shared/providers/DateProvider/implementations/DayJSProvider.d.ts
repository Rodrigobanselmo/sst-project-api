import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
import { IDateProvider, ManipulateType } from '../models/IDateProvider.types';
declare class DayJSProvider implements IDateProvider {
    dayjs: typeof dayjs;
    addSeconds(date: Date, seconds: number): Date;
    addHours(date: Date, hours: number): Date;
    addDay(date: Date, days: number): Date;
    addTime(date: Date, value: number, type: string): Date;
    onlyDate(date: Date): Date;
    compareIfBefore(start_date: Date, end_date: Date): boolean;
    compareTime(start_date: Date, end_date: Date, compareIn: ManipulateType): number;
    convertToUTC(date: Date): string;
    dateNow(): Date;
    format(date: Date, format?: string): string;
}
export { DayJSProvider, dayjs };
