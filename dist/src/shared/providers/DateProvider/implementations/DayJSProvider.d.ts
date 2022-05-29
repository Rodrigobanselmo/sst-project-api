import { IDateProvider, ManipulateType } from '../models/IDateProvider.types';
declare class DayJSProvider implements IDateProvider {
    addSeconds(date: Date, seconds: number): Date;
    addHours(date: Date, hours: number): Date;
    addDay(date: Date, days: number): Date;
    addTime(date: Date, value: number, type: string): Date;
    compareIfBefore(start_date: Date, end_date: Date): boolean;
    compareTime(start_date: Date, end_date: Date, compareIn: ManipulateType): number;
    convertToUTC(date: Date): string;
    dateNow(): Date;
}
export { DayJSProvider };
